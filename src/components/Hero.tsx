import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import { icons } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Aurora from "@/components/ui/Aurora";
import SplitText from "@/components/ui/SplitText";
import ShinyText from "@/components/ui/ShinyText";
import { useTheme } from "@/contexts/ThemeContext";
import { API_BASE } from "@/services/api";

const Hero = () => {
  const { content } = useContent();
  const { theme } = useTheme();
  const { name, tagline, socialLinks } = content.hero;
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const resumeLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (theme === "dark") {
      setBackgroundImage(""); // No image, Aurora will be used
    } else {
    const savedBackgrounds = localStorage.getItem('heroBackgrounds');
    const backgrounds = savedBackgrounds ? JSON.parse(savedBackgrounds) : null;
    let images: string[];
    if (backgrounds && backgrounds.length > 0) {
      images = backgrounds;
      } else {
        images = ["/screen1.jpg", "/screen2.jpg", "/screen3.jpg", "/screen4.jpg"];
      }
    const randomIndex = Math.floor(Math.random() * images.length);
    setBackgroundImage(images[randomIndex]);
    }
  }, [theme]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderIcon = (iconName: string) => {
    const LucideIcon = icons[iconName as keyof typeof icons];
    return LucideIcon ? <LucideIcon size={24} /> : null;
  };

  const handleResumeDownload = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/resume/index.php`);
      if (!res.ok) throw new Error("Resume not found");
      const blob = await res.blob();
      // Use hero name for filename
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
    <section
      className="relative min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: theme === "light" && backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      {/* Aurora background for dark mode */}
      {theme === "dark" && (
        <div className="absolute inset-0 -z-10">
          <Aurora />
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      <div className="container mx-auto px-4 md:px-6 space-y-12 text-center relative z-10">
        <div className="space-y-4 fade-in-up animation-delay-200">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            <SplitText 
              text={`Hi, I'm ${name}`}
              highlight={name}
              className="inline-block text-white"
            />
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            <ShinyText text={tagline} />
          </p>
        </div>
        <div className="fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            className="rounded-full px-6 py-6"
            onClick={() => scrollToSection("contact")}
          >
            Contact Me
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => scrollToSection("projects")}
          >
            <ShinyText text="View Projects" />
          </Button>
        </div>
        </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-20">
        <div className="flex items-center justify-center gap-6">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="hover-scale text-white/80 hover:text-white"
              aria-label={link.name}
            >
              {renderIcon(link.icon)}
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </div>
        <a
          href="#about"
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDown size={24} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
