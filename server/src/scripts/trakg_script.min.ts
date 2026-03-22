// @ts-nocheck
(function () {
  const previousValues = {};
  const fieldStartTimes = {};
  const fieldDurations = {};
  const fieldClicks = {};
  const formStartTimes = {};
  let geoData = null;
  let leadId = null;
  let deviceInfo = null;
  let clickCount = 0;
  const timeSpent = {};
  let currentInput = null;
  let focusStartTime = 0;
  const utmParams = {};
  const referral = document.referrer || null;
  let userId = null;
  const SERVER = "__SERVER_URL__";
  const API_VERSION = "__API_VERSION__";

  try {
    new URLSearchParams(window.location.search).forEach((val, key) => {
      if (key.startsWith("utm_")) utmParams[key] = val;
    });
  } catch (err) {
    console.warn("Failed to parse UTM parameters", err);
  }

  function generateId(prefix = "form") {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
  const getID = async () => {
    let trackerId = sessionStorage.getItem("trackerId");
    if (trackerId && trackerId !== "unknown-script") return trackerId;

    const scriptElement = document.querySelector(
      'script[src*="tracker.min.js"]',
    );
    if (scriptElement) {
      const scriptSrc = scriptElement.getAttribute("src");
      const url = new URL(scriptSrc, window.location.origin);
      trackerId = url.searchParams.get("id") || "unknown-script";
      sessionStorage.setItem("trackerId", trackerId);
    }
    return trackerId || "unknown-script";
  };

  function getUserId() {
    try {
      if (!userId) {
        userId = localStorage.getItem("trakg_uid");
        if (!userId) {
          userId = `uid-${Math.random().toString(36).slice(2, 12)}`;
          localStorage.setItem("trakg_uid", userId);
        }
      }
    } catch (err) {
      userId = `uid-${Math.random().toString(36).slice(2, 12)}`;
    }
    return userId;
  }

  function getFieldName(field) {
    if (field.name) return field.name;

    try {
      const form = field.closest("form");
      const formId = form?.id || "noform";
      const placeholder = field.placeholder?.trim();
      const fieldKeyBase = `${formId}-${
        placeholder || "input"
      }-${Array.from(form.elements).indexOf(field)}`;
      const storageKey = `trakg_field_name_${fieldKeyBase}`;

      let storedName = localStorage.getItem(storageKey);
      if (storedName) {
        field.name = storedName;
        return storedName;
      }

      const fallbackName = placeholder
        ? placeholder.replace(/\s+/g, "_").toLowerCase()
        : `field_${Math.random().toString(36).slice(2, 8)}`;

      localStorage.setItem(storageKey, fallbackName);
      field.name = fallbackName;
      return fallbackName;
    } catch (e) {
      const fallback = `field_${Math.random().toString(36).slice(2, 8)}`;
      field.name = fallback;
      return fallback;
    }
  }

  function getLeadId() {
    try {
      if (!leadId) {
        leadId = sessionStorage.getItem("leadId");
        if (!leadId) {
          leadId = `user-${Math.random().toString(36).slice(2, 10)}`;
          sessionStorage.setItem("leadId", leadId);
        }
      }
    } catch (err) {
      console.warn("Failed to get/set leadId in sessionStorage", err);
      leadId = `user-${Math.random().toString(36).slice(2, 10)}`;
    }
    return leadId;
  }

  async function fetchGeoData() {
    if (geoData) return geoData;

    try {
      const cached = sessionStorage.getItem("geoInfo");
      const now = Date.now();
      const twoDays = 2 * 24 * 60 * 60 * 1000;

      if (cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < twoDays) {
          geoData = parsed.data;
          return geoData;
        }
      }
      try {
        const res = await fetch("https://free.freeipapi.com/api/json");
        const data = await res.json();

        if (!res.ok || !data || !data.ipAddress) {
          throw new Error("Invalid data from freeipapi");
        }

        geoData = {
          ipVersion: data.ipVersion,
          ipAddress: data.ipAddress,
          latitude: data.latitude,
          longitude: data.longitude,
          countryName: data.countryName,
          countryCode: data.countryCode,
          timeZone: data.timeZone,
          zipCode: data.zipCode,
          cityName: data.cityName,
          regionName: data.regionName,
          isProxy: data.isProxy,
          continent: data.continent,
          referral,
        };
      } catch (e) {
        try {
          const fallbackRes = await fetch("http://ip-api.com/json");
          const fallback = await fallbackRes.json();

          geoData = {
            ipVersion: "IPv4",
            ipAddress: fallback.query,
            latitude: fallback.lat,
            longitude: fallback.lon,
            countryName: fallback.country,
            countryCode: fallback.countryCode,
            timeZone: fallback.timezone,
            zipCode: fallback.zip,
            cityName: fallback.city,
            regionName: fallback.regionName,
            isProxy: fallback.proxy || false,
            continent: fallback.continent || "Unknown",
            referral,
          };
        } catch (fallbackErr) {
          console.error("Both geo IP fetch attempts failed", fallbackErr);
          geoData = {
            ipVersion: "IPv4",
            ipAddress: "",
            latitude: null,
            longitude: null,
            countryName: "Unknown",
            countryCode: "XX",
            timeZone: "Unknown",
            zipCode: "",
            cityName: "Unknown",
            regionName: "Unknown",
            isProxy: false,
            continent: "Unknown",
            referral,
          };
        }
      }
      sessionStorage.setItem(
        "geoInfo",
        JSON.stringify({ data: geoData, timestamp: now }),
      );
      return geoData;
    } catch (err) {
      console.error("Trakg: Geo fetch failed", err);
      geoData = { referral };
      return geoData;
    }
  }

  function getDeviceInfo() {
    if (deviceInfo) return deviceInfo;

    try {
      deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          availWidth: window.screen.availWidth,
          availHeight: window.screen.availHeight,
        },
        platform: navigator.platform,
        vendor: navigator.vendor,
      };
    } catch (err) {
      console.warn("Failed to get device info", err);
      deviceInfo = {};
    }
    return deviceInfo;
  }

  function debounce(fn, delay = 500) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function collectFieldAnalytics(formId) {
    let totalFormTime = 0;
    const formStart = formStartTimes[formId];
    if (formStart) {
      totalFormTime = Math.floor((Date.now() - formStart) / 1000);
    }

    const fieldsData = Object.entries(fieldDurations)
      .filter(([key]) => key.startsWith(formId + "-"))
      .map(([key, ms]) => {
        const field = key.slice(formId.length + 1);
        return {
          field,
          timeSpent: Math.floor(ms / 1000),
          clicks: fieldClicks[key] || 0,
        };
      });

    const formTime = totalFormTime > 0 ? totalFormTime : "0";

    return { fieldsData, formTime };
  }
  function attachClickTracker(form) {
    if (!form.dataset.clickTracked) {
      form.addEventListener("click", () => {
        clickCount++;
      });
      form.dataset.clickTracked = "true";
    }
  }

  async function sendToBackend(form, payload, isRetry = false) {
    const formId = form.id;
    const trackingScriptId = await getID();

    try {
      const { fieldsData, formTime } = collectFieldAnalytics(formId);
      const finalPayload = {
        leadId: getLeadId(),
        formId,
        pageUrl: window.location.href,
        referral,
        createdAt: new Date().toISOString(),
        utm: utmParams,
        fieldAnalytics: fieldsData,
        formTime,
        eventsOnForm: clickCount || 1,
        trackingScriptId,
        userId: getUserId(),
        ...payload,
      };

      // Load stored form info
      const storedFormInfo = JSON.parse(
        sessionStorage.getItem("currentFormID") || "{}",
      );
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // Check geo/device attach condition
      const geoDeviceSent = sessionStorage.getItem("geoDeviceSent");

      if (!geoDeviceSent || isRetry) {
        if (!finalPayload.geo) {
          finalPayload.geo = await fetchGeoData();
        }
        finalPayload.device = getDeviceInfo();
      }

      if (storedFormInfo.formId && storedFormInfo.addedOn) {
        if (storedFormInfo.formId !== formId) {
          finalPayload.device = getDeviceInfo();
        } else if (now - storedFormInfo.addedOn > fiveMinutes) {
          finalPayload.device = getDeviceInfo();
          finalPayload.geo = await fetchGeoData();
        }
      }

      const res = await fetch(`${SERVER}/${API_VERSION}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });

      if (res.ok && !geoDeviceSent) {
        sessionStorage.setItem("geoDeviceSent", "true");
        sessionStorage.setItem(
          "currentFormID",
          JSON.stringify({
            formId: formId,
            addedOn: new Date().toISOString(),
          }),
        );
      } else if (!res.ok && !isRetry) {
        console.warn("First send failed, retrying once...");
        await sendToBackend(form, payload, true);
      }
    } catch (err) {
      console.error("Error sending to backend", err);
      if (!isRetry) {
        await sendToBackend(form, payload, true);
      }
    }
  }

  // For updating time spent on current input continuously
  function updateCurrentFieldDuration(formId, fieldName) {
    const key = `${formId}-${fieldName}`;
    if (!fieldStartTimes[key]) return; // not focused

    const now = Date.now();
    const elapsed = now - fieldStartTimes[key];
    fieldDurations[key] = (fieldDurations[key] || 0) + elapsed;
    fieldStartTimes[key] = now; // reset start time to now
  }
  const sensitiveFieldTypes = new Set([
    "password",
    "cc-number",
    "cc-cvv",
    "cc-expiry",
    "credit-card",
  ]);
  const sensitiveFieldNames = new Set([
    "password",
    "credit_card",
    "ccv",
    "cvv",
    "card_number",
    "card_cvv",
    "card_expiry",
    "address",
    "billing_address",
    "shipping_address",
  ]);

  function isSensitiveField(field) {
    return (
      sensitiveFieldTypes.has(field.type?.toLowerCase()) ||
      sensitiveFieldNames.has(field.name?.toLowerCase())
    );
  }

  function autofillFormInputs(userId, form) {
    try {
      const formId = form.id;
      const storageKey = `trakg_opportunity`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");

      if (!stored[formId]) return;

      const { addedOn, data } = stored[formId];
      const now = Date.now();
      const oneMonth = 2592000000;
      if (now - addedOn > oneMonth) {
        delete stored[formId];
        localStorage.setItem(storageKey, JSON.stringify(stored));
        return;
      }

      for (const field of form.querySelectorAll("input, textarea, select")) {
        const name = field.name;
        if (!name || !(name in data)) continue;

        if (
          !isSensitiveField(field) &&
          field.getAttribute("trakg-input-autofill") === "true"
        ) {
          field.value = data[name];
        }
      }
    } catch (e) {
      console.warn("Failed to autofill inputs", e);
    }
  }
  function saveInputToLocal(formId, name, value) {
    try {
      const storageKey = `trakg_opportunity`;
      const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");

      if (!stored[formId]) {
        stored[formId] = {
          addedOn: Date.now(),
          data: {},
        };
      }

      stored[formId].data[name] = value;
      stored[formId].addedOn = Date.now();

      localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch (e) {
      console.warn("Failed to save input to localStorage", e);
    }
  }
  const handleInputChange = debounce(async (e) => {
    try {
      const field = e.target;
      const form = field.closest("form");
      if (!form || !field.name || field.type === "password") return;

      if (!form.id) form.id = generateId();
      const formId = form.id;
      const fieldKey = `${formId}-${field.name}`;
      form.addEventListener("click", () => {
        clickCount++;
      });

      const value = field.value.trim();

      if (value === previousValues[fieldKey]) return;

      updateCurrentFieldDuration(formId, field.name);

      saveInputToLocal(formId, field.name, value);

      await sendToBackend(form, {
        type: "update",
        field: field.name,
        value,
        timeSpentCurrentInput: Math.floor(
          (fieldDurations[fieldKey] || 0) / 1000,
        ),
      });
    } catch (err) {
      console.error("handleInputChange error", err);
    }
  }, 500);

  function trackFocus(e) {
    try {
      const field = e.target;
      const form = field.closest("form");
      if (!form || !field.name) return;

      if (!form.id) form.id = generateId();
      const formId = form.id;

      if (!formStartTimes[formId]) {
        formStartTimes[formId] = Date.now();
      }
      const fieldName = getFieldName(field);
      const key = `${formId}-${fieldName}`;

      fieldStartTimes[key] = Date.now();
    } catch (err) {
      console.error("trackFocus error", err);
    }
  }

  function trackBlur(e) {
    try {
      const field = e.target;
      const form = field.closest("form");
      if (!form) return;

      if (!form.id) form.id = generateId();
      const formId = form.id;
      const fieldName = getFieldName(field);
      const key = `${formId}-${fieldName}`;

      const start = fieldStartTimes[key];
      if (start) {
        const duration = Date.now() - start;
        fieldDurations[key] = (fieldDurations[key] || 0) + duration;
        delete fieldStartTimes[key];
      }
    } catch (err) {
      console.error("trackBlur error", err);
    }
  }

  function trackClick(e) {
    try {
      const field = e.target;
      const form = field.closest("form");
      if (!form) return;

      if (!form.id) form.id = generateId();
      const formId = form.id;
      const fieldName = getFieldName(field);
      const key = `${formId}-${fieldName}`;

      fieldClicks[key] = (fieldClicks[key] || 0) + 1;
    } catch (err) {
      console.error("trackClick error", err);
    }
  }

  async function handleFormSubmit(e) {
    try {
      e.preventDefault();
      const form = e.target;
      if (!form.id) form.id = generateId();
      const formId = form.id;

      for (const key in fieldStartTimes) {
        if (key.startsWith(formId + "-")) {
          const start = fieldStartTimes[key];
          if (start) {
            const duration = Date.now() - start;
            fieldDurations[key] = (fieldDurations[key] || 0) + duration;
            delete fieldStartTimes[key];
          }
        }
      }

      const inputs = form.querySelectorAll("input, textarea, select");
      const formData = {};
      let lastFilled = null;

      for (const input of inputs) {
        if (input.name && input.value.trim()) {
          formData[input.name] = input.value.trim();
          lastFilled = input.name;
        }
      }

      // Total time spent on form in seconds
      const formStart = formStartTimes[formId] || Date.now();
      const durationMs = Date.now() - formStart;
      const duration = Math.floor(durationMs / 1000);

      await sendToBackend(form, {
        type: "submit",
        formData,
        lastFilled,
        duration, // total time on form in seconds
      });

      // Optionally allow form submission after tracking, remove preventDefault if desired:
      // form.submit();
    } catch (err) {
      console.error("handleFormSubmit error", err);
    }
  }

  function initFormTracking() {
    try {
      document.querySelectorAll("form").forEach((form) => {
        if (form.getAttribute("trakg-form-track") === "notrack") return;

        // Use trakg-form-id or fallback to generated ID
        const customFormId = form.getAttribute("trakg-form-id");
        form.id = customFormId || form.id || generateId();

        // Optional: store custom name
        const formName = form.getAttribute("trakg-form-name");
        if (formName) form.dataset.trakgFormName = formName;

        autofillFormInputs(getUserId(), form);

        form.querySelectorAll("input, textarea, select").forEach((field) => {
          if (field.getAttribute("trakg-input-no-track") === "true") return;
          if (!field.name) return;
          field.removeEventListener("focus", trackFocus);
          field.removeEventListener("blur", trackBlur);
          field.removeEventListener("click", trackClick);
          field.removeEventListener("input", handleInputChange);

          field.addEventListener("focus", trackFocus);
          field.addEventListener("blur", trackBlur);
          field.addEventListener("click", trackClick);
          field.addEventListener("input", handleInputChange);
        });

        form.removeEventListener("submit", handleFormSubmit);
        form.addEventListener("submit", handleFormSubmit);
      });
      document.addEventListener("DOMContentLoaded", () => {
        const forms = document.querySelectorAll("form, [trkag_as_Form]");
        const uid = getUserId();
        forms.forEach((form) => {
          if (!form.id) form.id = generateId();
          autofillFormInputs(uid, form);
          attachClickTracker(form);
          formStartTimes[form.id] = Date.now();
        });
      });
    } catch (err) {
      console.error("trakg: initializing trakg on this form failed.", err);
    }
  }

  new MutationObserver(initFormTracking).observe(document.body, {
    subtree: true,
    childList: true,
  });

  initFormTracking();
})();
