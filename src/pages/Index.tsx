import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DisplayHeader from "@/components/ui/DisplayHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";
import AdminLink from "@/components/AdminLink";
import { checkInstallStatus } from "@/services/api";

const Index = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [checkingInstall, setCheckingInstall] = useState(true);
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "home", ref: heroRef },
        { id: "about", ref: aboutRef },
        { id: "projects", ref: projectsRef },
        { id: "skills", ref: skillsRef },
        { id: "contact", ref: contactRef },
      ];
      const scrollY = window.scrollY + window.innerHeight / 3;
      let current = "home";
      for (const section of sections) {
        const el = section.ref.current;
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            current = section.id;
            break;
          }
        }
      }
      setActiveItem(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Install status check
    const checkInstall = async () => {
      try {
        const json = await checkInstallStatus();
        // If DB has no tables, treat as not installed
        if (!json.success || !json.data || !json.data.database || json.data.database.tables === 0) {
          navigate("/install");
        }
      } catch (e) {
        navigate("/install");
      } finally {
        setCheckingInstall(false);
      }
    };
    checkInstall();
  }, [navigate]);

  if (checkingInstall) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DisplayHeader activeItem={activeItem} />
      <main>
        <section id="home" ref={heroRef}><Hero /></section>
        <section id="about" ref={aboutRef}><About /></section>
        <section id="projects" ref={projectsRef}><Projects /></section>
        <section id="skills" ref={skillsRef}><Skills /></section>
        <section id="contact" ref={contactRef}><Contact /></section>
      </main>
      <Footer />
      <ChatButton />
      <AdminLink />
    </div>
  );
};

export default Index;
