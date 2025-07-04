import React, { createContext, useContext, useEffect, useState } from "react";
import { getSiteSettings } from "@/services/api";

interface SiteSettings {
  site_name: string;
  site_logo: string;
  favicon: string;
  site_title: string;
  site_description: string;
}

const SiteSettingsContext = createContext<{ siteSettings: SiteSettings | null }>({ siteSettings: null });

const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data.success && data.data) setSiteSettings(data.data);
      });
  }, []);

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.site_title) document.title = siteSettings.site_title;
      if (siteSettings.favicon) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = siteSettings.favicon;
      }
      // Optionally update meta description
      if (siteSettings.site_description) {
        let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement("meta");
          meta.name = "description";
          document.head.appendChild(meta);
        }
        meta.content = siteSettings.site_description;
      }
    }
  }, [siteSettings]);

  return (
    <SiteSettingsContext.Provider value={{ siteSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
export default SiteSettingsProvider; 