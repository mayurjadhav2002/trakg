import {
  normalizeForDb,
  parseUserAgent,
  toNumberSafe,
} from "../../lib/utils/lead_helpers";
import { valkey } from "../../lib/valkey";
import prisma from "../../lib/prisma_client";
import { FastifyRequest, FastifyReply } from "fastify";


const ONE_DAY_SECONDS = 60 * 60 * 24;

function getLead(key: string) {
  return valkey.get(key).then((data: any) => (data ? JSON.parse(data) : null));
}
function saveLead(key: string, lead: any) {
  lead.updatedAt = Date.now();

  const leadJson = JSON.stringify(lead);

  return Promise.all([
    valkey.set(key, leadJson, "EX", ONE_DAY_SECONDS),

    valkey.zadd("lead:index", lead.updatedAt, key),

    valkey.expire("lead:index", ONE_DAY_SECONDS),
  ]);
}

function saveAnalytics(leadKey: string, event: any) {
  const analyticsKey = `${leadKey}-analytics`;
  const payload = JSON.stringify(event);

  // LPUSH analytics entry + refresh TTL
  return valkey
    .lpush(analyticsKey, payload)
    .then(() => valkey.expire(analyticsKey, ONE_DAY_SECONDS));
}

export function buildDateBucketsStats(
  rawData: any[],
  from: Date,
  to: Date,
  intervalDays: number,
) {
  const buckets: Record<string, { partial: number; complete: number }> = {};

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + intervalDays)) {
    const dateKey = d.toISOString().split("T")[0];
    buckets[dateKey] = { partial: 0, complete: 0 };
  }

  for (const entry of rawData) {
    const created = new Date(entry.createdAt);
    let bucketDate = new Date(created);

    if (intervalDays > 1) {
      const dayOffset = Math.floor(
        (created.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
      );
      const bucketOffset = Math.floor(dayOffset / intervalDays) * intervalDays;
      bucketDate = new Date(from);
      bucketDate.setDate(from.getDate() + bucketOffset);
    }

    const bucketKey = bucketDate.toISOString().split("T")[0];
    if (!buckets[bucketKey]) {
      buckets[bucketKey] = { partial: 0, complete: 0 };
    }
    if (entry.conversion) buckets[bucketKey].complete += entry._count;
    else buckets[bucketKey].partial += entry._count;
  }

  return Object.entries(buckets).map(([date, counts]) => ({
    date,
    ...counts,
  }));
}

async function getOrCreateWebsiteAndForm(
  trackingId: string,
  pageUrl: string,
  formId: string,
  formName: string,
) {
  const normalizedUrl = normalizeForDb(pageUrl);
  if (!normalizedUrl) return null;

  const cacheKey = `wf:${trackingId}:${normalizedUrl}:${pageUrl}`;

  // 1. Check Redis cache
  const cached = await valkey.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Load website
  const website = await prisma.website.findFirst({
    where: { trackingId, url: normalizedUrl },
    select: { id: true, isActive: true },
  });

  if (!website || !website.isActive) return null;

  // 3. Load/create form
  let form = await prisma.form.findFirst({
    where: { websiteId: website.id, pageUrl },
    select: { id: true },
  });

  if (!form) {
    form = await prisma.form.create({
      data: {
        websiteId: website.id,
        pageUrl,
        pageId: formId,
        formId,
        formName: formName || formId,
      },
      select: { id: true },
    });
  }

  const result = { websiteId: website.id, formId: form.id };
  await valkey.set(cacheKey, JSON.stringify(result));

  return result;
}

export const createLead = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {
      device,
      geo,
      lastFilled,
      formId,
      field,
      pageUrl,
      referral,
      timeSpentCurrentInput,
      type,
      utm,
      value,
      trackingScriptId,
      formTime,
      userId,
      form_name,
    }: any = req.body;

    const wf = await getOrCreateWebsiteAndForm(
      trackingScriptId,
      pageUrl,
      formId,
      form_name,
    );

    if (!wf) {
      return reply.code(400).send({
        message: "Website Not Found or Not Active",
      });
    }
    const parsedDevice = parseUserAgent(device);
    const websiteId = wf.websiteId;
    const existing_formId2 = wf.formId;

    /* ---------- Lead Handling (Valkey) ---------- */
    const leadKey = `lead:${websiteId}:${existing_formId2}:${userId}`;

    let lead = await getLead(leadKey);

    const safeTimeSpent = toNumberSafe(timeSpentCurrentInput);
    const safeFormTime = toNumberSafe(formTime);

    if (lead) {
      // update
      lead.sessionTime = safeTimeSpent;
      lead.conversion = type === "submit" || lead.conversion;

      lead.formData = {
        ...(lead.formData || {}),
        [field]: value,
      };

      lead.timeSpendOnForm = safeFormTime;
      lead.lastFieldFilled = field || lastFilled;
      lead.timeSpentCurrentInput = safeTimeSpent;

      lead.geo = geo ?? lead.geo;
      lead.referral = referral ?? lead.referral;

      await saveLead(leadKey, lead);
    } else {
      // create new
      lead = {
        id: crypto.randomUUID(),
        websiteId: websiteId,
        formId: existing_formId2,
        opportunityId: userId,

        createdAt: Date.now(),
        updatedAt: Date.now(),

        sessionTime: safeTimeSpent,
        conversion: type === "submit" || false,
        formData: field ? { [field]: value } : {},
        utm: utm || null,
        geo: geo || null,
        referral: referral || "Direct",
        pageUrl,

        country: geo?.countryName || "",
        ipAddress: geo?.ipAddress || "",
        timeSpendOnForm: safeFormTime,

        deviceRaw: device,
        deviceInfo: parsedDevice,

        lastFieldFilled: field || lastFilled || null,
        timeSpentCurrentInput: safeTimeSpent,
      };

      await saveLead(leadKey, lead); // TTL 30 min
    }

    /* ---------- Analytics Saved to Valkey (not DB) ---------- */
    const analyticsEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),

      leadId: lead.id,
      websiteId: websiteId,
      formId: existing_formId2,

      action: type === "submit" ? "FORM_FILLED" : "FORM_PARTIAL_FILL",

      country: geo?.countryName || "Unknown",
      city: geo?.cityName || "Unknown",
      pinCode: geo?.zipCode || "Unknown",
      region: geo?.regionName || "Unknown",

      device,
      browser: parsedDevice.browser,
      os: parsedDevice.os,
      deviceType: parsedDevice.deviceType,

      geo,
      pageUrl,
      field,
      value,
      timeSpentCurrentInput: safeTimeSpent,
    };

    await saveAnalytics(leadKey, analyticsEvent);
    if (field) {
      const valueChangeEvent = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),

        leadId: lead.id,
        field,
        value,
        opportunityId: userId,
        currentTime: safeTimeSpent.toString(),
      };

      await saveValueChange(leadKey, field, valueChangeEvent);
    }
    /* ---------- Response ---------- */
    return reply.code(200).send({
      message: "Lead Created",
      status: "Success",
      data: lead,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({
      message: "Internal Server Error",
    });
  }
};

async function saveValueChange(leadKey: string, field: string, value: any) {
  const key = `${leadKey}-valuechanges`;

  const existing = await valkey.hget(key, field);
  let arr: any[] = existing ? JSON.parse(existing) : [];

  if (arr[arr.length - 1] !== value) {
    arr.push(value);
  }

  await valkey.hset(key, field, JSON.stringify(arr));

  await valkey.expire(key, ONE_DAY_SECONDS);
}
