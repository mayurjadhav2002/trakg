import { valkey } from "../lib/valkey";
import prisma from "../lib/prisma_client";

const FIVE_MINUTES = 5 * 60 * 1000;

export async function processExpiredLeads() {
  console.log("⏳ Lead ingestion worker running...");

  const now = Date.now();
  const cutoff = now - FIVE_MINUTES;

  const expiredKeys = await valkey.zrangebyscore("lead:index", 0, cutoff);

  if (!expiredKeys.length) {
    console.log("✔ No leads to sync.");
    return;
  }

  console.log(`➡️ Syncing ${expiredKeys.length} leads...`);

  for (const leadKey of expiredKeys) {
    try {
      const leadJson = await valkey.get(leadKey);
      if (!leadJson) {
        await valkey.zrem("lead:index", leadKey);
        continue;
      }

      const lead = JSON.parse(leadJson);

      const createdLead = await prisma.lead.create({
        data: {
          uniqueId: lead.id,
          formId: lead.formId,
          opportunityId: lead.opportunityId,

          sessionTime: lead.sessionTime ?? 0,
          conversion: lead.conversion ?? false,
          referral: lead.referral ?? "Direct",
          opportunityGeo: lead.geo ?? {},
          ipAddress: lead.ipAddress ?? "",
          country: lead.country ?? "",

          formData: lead.formData ?? {},
          utm_Params: lead.utm ?? null,
          websiteId: lead.websiteId,
          timeSpendOnForm: lead.timeSpendOnForm ?? 0,

          createdAt: new Date(lead.createdAt),
          updatedAt: new Date(lead.updatedAt),
        },
      });

      const leadId = createdLead.id;

      if (lead.deviceInfo) {
        await prisma.deviceInfo.create({
          data: {
            leadId,
            browser: lead.deviceInfo.browser ?? null,
            os: lead.deviceInfo.os ?? null,
            deviceType: lead.deviceInfo.deviceType ?? null,
            otherData: lead.deviceRaw ?? null,
          },
        });
      }

      await prisma.leadInfo.create({
        data: {
          leadId,
          lastFieldFilled: lead.lastFieldFilled ?? "",
          timeSpent: lead.timeSpentCurrentInput ?? 0,
        },
      });

      const analyticsKey = `${leadKey}-analytics`;
      const analyticsRaw = await valkey.lrange(analyticsKey, 0, -1);

      for (const a of analyticsRaw) {
        const ev = JSON.parse(a);

        await prisma.analytics.create({
          data: {
            websiteId: ev.websiteId,
            formId: ev.formId,
            leadId: leadId,
            pageUrl: ev.pageUrl,

            action: ev.action,

            country: ev.country,
            city: ev.city,
            pinCode: ev.pinCode,
            region: ev.region,

            browser: ev.browser,
            os: ev.os,
            device: ev.device,
            geo: ev.geo,

            createdAt: new Date(ev.timestamp),
          },
        });
      }

      const vcKey = `${leadKey}-valuechanges`;
      const fields = await valkey.hkeys(vcKey);

      for (const f of fields) {
        const rawArr = await valkey.hget(vcKey, f);
        if (!rawArr) continue;

        const events = JSON.parse(rawArr);

        for (const ev of events) {
          await prisma.valueChange.create({
            data: {
              leadId: leadId,
              key: ev.field,
              value: ev.value,
              currentTime: ev.currentTime,
              opportunityId: ev.opportunityId,
            },
          });
        }
      }

      await valkey.del(leadKey);
      await valkey.del(analyticsKey);
      await valkey.del(vcKey);
      await valkey.zrem("lead:index", leadKey);

      console.log(`✔ Synced lead ${lead.id}`);
    } catch (err) {
      console.error("❌ Worker error:", err);
    }
  }

  console.log("✔ Worker finished.\n");
}
