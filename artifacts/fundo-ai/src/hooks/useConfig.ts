import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface SiteConfig {
  whatsapp_number: string;
  announcement: string;
}

const DEFAULT: SiteConfig = { whatsapp_number: "263719647303", announcement: "" };

let cached: SiteConfig | null = null;

export function useConfig(): SiteConfig {
  const [config, setConfig] = useState<SiteConfig>(cached || DEFAULT);

  useEffect(() => {
    if (cached) return;
    api.getConfig()
      .then((d: any) => {
        const c: SiteConfig = {
          whatsapp_number: d.whatsapp_number || DEFAULT.whatsapp_number,
          announcement:    d.announcement    || "",
        };
        cached = c;
        setConfig(c);
      })
      .catch(() => {});
  }, []);

  return config;
}

export function waLink(number: string) {
  return `https://wa.me/${number.replace(/[^0-9]/g, "")}`;
}
