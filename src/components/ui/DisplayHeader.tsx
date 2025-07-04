import React from "react";
import "./DisplayHeader.css";
import { useContent } from "@/contexts/ContentContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { fetchResumeFile } from "@/services/api";

const navItems = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

interface DisplayHeaderProps {
  activeItem?: string;
}

const DisplayHeader: React.FC<DisplayHeaderProps> = ({ activeItem }) => {
  const { content } = useContent();
  const { siteSettings } = useSiteSettings();
  const name = content.hero?.name || "resume";

  const handleResumeDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetchResumeFile();
      if (!res.ok) throw new Error("Resume not found");
      const blob = await res.blob();
      const safeName = name ? name.replace(/[^a-zA-Z0-9_-]/g, "").replace(/\s+/g, "_") : "resume";
      const ext = res.headers.get("Content-Type")?.includes("pdf") ? "pdf" : "docx";
      const fileName = `${safeName}_cv.${ext}`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 100);
    } catch (e) {
      alert("Resume not found or failed to download.");
    }
  };

  return (
    <header className="header laptop-navbar">
      <div className="header-container">
        <a href="#home" className="logo flex items-center">
          <img src={siteSettings?.site_logo || "/logo.png"} alt="Logo" style={{ height: 60, width: 60 }} />
          <span className="ml-2 font-bold text-2xl text-primary">{siteSettings?.site_name || "Hill tech"}</span>
        </a>
        <nav className="landing-nav-items">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`nav-link${activeItem === item.name.toLowerCase() ? " active-link" : ""}`}
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="nav-cta-group">
          <a href="#resume" className="cta-button font-bold px-9 py-1 " onClick={handleResumeDownload}>
            Resume
          </a>
        </div>
      </div>
    </header>
  );
};

export default DisplayHeader; 