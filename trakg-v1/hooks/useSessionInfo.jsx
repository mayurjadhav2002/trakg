"use client";

import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

const GEO_URL = "https://ipapi.co/json/";
const LOCAL_KEY = "sessionInfo";
const CACHE_TIME = 24 * 60 * 60 * 1000; // 24h

export const useSessionInfo = () => {
  const [sessionInfo, setSessionInfo] = useState(null);

  useEffect(() => {
    const loadSessionInfo = async () => {
      try {
        const cached = localStorage.getItem(LOCAL_KEY);

        if (cached) {
          const parsed = JSON.parse(cached);

          if (Date.now() - parsed._ts < CACHE_TIME) {
            setSessionInfo(parsed.data);
            return;
          }
        }

        const parser = new UAParser();
        const result = parser.getResult();

        const deviceInfo = {
          browser: result.browser.name,
          browserVersion: result.browser.version,
          os: result.os.name,
          osVersion: result.os.version,
          deviceType: result.device.type || "desktop",
          vendor: result.device.vendor,
          model: result.device.model,
          cpu: result.cpu.architecture,
          screen: `${window.screen.width}x${window.screen.height}`,
          pixelRatio: window.devicePixelRatio,
          language: navigator.language,
          userAgent: navigator.userAgent,
          isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
        };

        setSessionInfo(deviceInfo);

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);

          const geoRes = await fetch(GEO_URL, {
            signal: controller.signal,
          });

          clearTimeout(timeout);

          if (!geoRes.ok) return;

          const geoData = await geoRes.json();

          const combined = {
            ...deviceInfo,
            ...geoData,
          };

          localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify({
              _ts: Date.now(),
              data: combined,
            }),
          );

          setSessionInfo(combined);
        } catch (err) {
          console.warn("Geo lookup failed:", err);
        }
      } catch (err) {
        console.error("Session info error:", err);
      }
    };

    loadSessionInfo();
  }, []);

  return sessionInfo;
};
