import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAbout, fetchHero, fetchProjectsDynamic, fetchSkills, fetchContact, createSkill, updateSkillAPI, deleteSkill, createProject, updateProjectAPI, deleteProject } from '../services/api';

// Define types for each section's content
export type HeroContent = {
  name: string;
  tagline: string;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
};

export type AboutContent = {
  paragraphs: string[];
  stats: Array<{
    value: string;
    label: string;
  }>;
  profile_image?: string;
  status?: string;
  title?: string;
  rotating_texts?: string[];
  creative_text?: string;
};

export type ProjectContent = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoLink: string;
  codeLink: string;
  category: string;
};

export type SkillContent = {
  title: string;
  icon: string;
  skills: string[];
};

export type ContactContent = {
  location: string;
  email: string;
  phone: string;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
  }>;
};

// Define the complete content state
interface ContentState {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectContent[];
  categories: string[];
  skills: SkillContent[];
  contact: ContactContent;
}

// Define initial content
const initialContent: ContentState = {
  hero: {
    name: "John Doe",
    tagline: "I design and build digital experiences with a focus on usability and performance",
    socialLinks: [
      { name: "Github", url: "#", icon: "Github" },
      { name: "LinkedIn", url: "#", icon: "Linkedin" },
      { name: "Twitter", url: "#", icon: "Twitter" }
    ]
  },
  about: {
    paragraphs: [
      "Hello! I'm a passionate designer and developer with over 5 years of experience crafting digital experiences that delight users and solve real problems.",
      "My journey in tech began when I built my first website at 16. Since then, I've worked with startups and established companies to create innovative solutions that blend form and function.",
      "When I'm not coding, you'll find me exploring hiking trails, experimenting with new cooking recipes, or learning about emerging technologies."
    ],
    stats: [
      { value: "5+", label: "Years Experience" },
      { value: "20+", label: "Projects Completed" },
      { value: "10+", label: "Happy Clients" },
      { value: "3", label: "Design Awards" }
    ],
    profile_image: "/profile.jpg",
    status: "online",
    title: "Software Engineer",
    rotating_texts: ["Thinker", "Designer", "Developer"],
    creative_text: "Creative"
  },
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-featured online store with shopping cart, user authentication, and payment processing.",
      image: "https://placehold.co/600x400/e9ecef/495057?text=E-commerce+Platform",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      demoLink: "#",
      codeLink: "#",
      category: "web"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A Kanban-style app for organizing tasks with drag-and-drop functionality.",
      image: "https://placehold.co/600x400/e9ecef/495057?text=Task+Manager",
      tags: ["React", "Redux", "Firebase"],
      demoLink: "#",
      codeLink: "#",
      category: "web"
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "A responsive portfolio website showcasing my work and skills.",
      image: "https://placehold.co/600x400/e9ecef/495057?text=Portfolio",
      tags: ["React", "Tailwind CSS", "Framer Motion"],
      demoLink: "#",
      codeLink: "#", 
      category: "web"
    },
    {
      id: 4,
      title: "iOS Weather App",
      description: "A clean and intuitive weather application with detailed forecasts.",
      image: "https://placehold.co/600x400/e9ecef/495057?text=Weather+App",
      tags: ["Swift", "Weather API", "CoreLocation"],
      demoLink: "#",
      codeLink: "#",
      category: "mobile"
    },
    {
      id: 5,
      title: "Brand Identity Design",
      description: "Complete brand identity package for a sustainable fashion startup.",
      image: "https://placehold.co/600x400/e9ecef/495057?text=Brand+Design",
      tags: ["Branding", "Logo Design", "Style Guide"],
      demoLink: "#",
      codeLink: "#",
      category: "design"
    },
    {
      id: 6,
      title: "Chat Application",
      description: "Real-time messaging application with group chat functionality.",
      image: "https://placehold.co/600x400/e9ecef/495057?text=Chat+App",
      tags: ["React", "Socket.io", "Express"],
      demoLink: "#",
      codeLink: "#",
      category: "web"
    }
  ],
  categories: ["all", "web", "mobile", "design"],
  skills: [
    {
      title: "Frontend Development",
      icon: "Layout",
      skills: ["HTML/CSS", "JavaScript", "React", "Vue.js", "Tailwind CSS", "TypeScript"]
    },
    {
      title: "Backend Development",
      icon: "Database",
      skills: ["Node.js", "Express", "Python", "Django", "Java", "RESTful APIs"]
    },
    {
      title: "Mobile Development",
      icon: "Smartphone",
      skills: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"]
    },
    {
      title: "UI/UX Design",
      icon: "Palette",
      skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"]
    },
    {
      title: "DevOps",
      icon: "GitBranch",
      skills: ["Git", "CI/CD", "Docker", "AWS", "Serverless"]
    },
    {
      title: "Data Visualization",
      icon: "LineChart",
      skills: ["D3.js", "Recharts", "Canvas", "SVG Animations"]
    },
    {
      title: "Web Performance",
      icon: "Layers",
      skills: ["Lighthouse", "Performance Budgeting", "Lazy Loading", "Optimization"]
    },
    {
      title: "Languages",
      icon: "Code",
      skills: ["JavaScript", "TypeScript", "Python", "Java", "Swift", "PHP"]
    }
  ],
  contact: {
    location: "San Francisco, CA",
    email: "hello@example.com",
    phone: "+1 (234) 567-890",
    socialLinks: [
      { name: "Twitter", url: "#", icon: "Twitter" },
      { name: "LinkedIn", url: "#", icon: "Linkedin" },
      { name: "GitHub", url: "#", icon: "Github" }
    ]
  }
};

// Create the context
const ContentContext = createContext<{
  content: ContentState;
  updateHero: (data: Partial<HeroContent>) => void;
  updateAbout: (data: Partial<AboutContent>) => void;
  updateProject: (id: number, data: Partial<ProjectContent>) => void;
  addProject: (project: Omit<ProjectContent, "id">) => void;
  removeProject: (id: number) => void;
  updateCategories: (categories: string[]) => void;
  updateSkill: (index: number, data: Partial<SkillContent>) => void;
  addSkill: (skill: SkillContent) => void;
  removeSkill: (index: number) => void;
  updateContact: (data: Partial<ContactContent>) => void;
} | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentState>(() => {
    const savedContent = localStorage.getItem('portfolioContent');
    return savedContent ? JSON.parse(savedContent) : initialContent;
  });

  // Fetch hero, about, projects, skills, and contact from backend on mount
  useEffect(() => {
    async function loadContent() {
      const [hero, about, projects, skills, contact] = await Promise.all([
        fetchHero(),
        fetchAbout(),
        fetchProjectsDynamic(),
        fetchSkills(),
        fetchContact()
      ]);
      setContent(prev => ({
        ...prev,
        ...(hero ? { hero } : {}),
        ...(about ? { about } : {}),
        ...(projects ? { projects } : {}),
        ...(skills ? { skills } : {}),
        ...(contact ? { contact } : {})
      }));
    }
    loadContent();
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem('portfolioContent', JSON.stringify(content));
  }, [content]);

  const updateHero = (data: Partial<HeroContent>) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, ...data }
    }));
  };

  const updateAbout = (data: Partial<AboutContent>) => {
    setContent(prev => ({
      ...prev,
      about: { ...prev.about, ...data }
    }));
  };

  const updateProject = async (id: number, data: Partial<ProjectContent>) => {
    try {
      const project = content.projects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      await updateProjectAPI(id, { ...project, ...data });
      const projects = await fetchProjectsDynamic();
      setContent(prev => ({ ...prev, projects }));
    } catch (e) {
      console.error('Failed to update project', e);
    }
  };

  const addProject = async (project: Omit<ProjectContent, "id">) => {
    try {
      await createProject(project as any);
      const projects = await fetchProjectsDynamic();
      setContent(prev => ({ ...prev, projects }));
    } catch (e) {
      console.error('Failed to add project', e);
    }
  };

  const removeProject = async (id: number) => {
    try {
      await deleteProject(id);
      const projects = await fetchProjectsDynamic();
      setContent(prev => ({ ...prev, projects }));
    } catch (e) {
      console.error('Failed to delete project', e);
    }
  };

  const updateCategories = (categories: string[]) => {
    setContent(prev => ({
      ...prev,
      categories
    }));
  };

  const updateSkill = async (index: number, data: Partial<SkillContent>) => {
    try {
      const skill = content.skills[index];
      await updateSkillAPI(index + 1, { ...skill, ...data }); // Assuming index+1 is the skill id
      const skills = await fetchSkills();
      setContent(prev => ({ ...prev, skills }));
    } catch (e) {
      console.error('Failed to update skill', e);
    }
  };

  const addSkill = async (skill: SkillContent) => {
    try {
      await createSkill(skill);
      const skills = await fetchSkills();
      setContent(prev => ({ ...prev, skills }));
    } catch (e) {
      console.error('Failed to add skill', e);
    }
  };

  const removeSkill = async (index: number) => {
    try {
      const skill = content.skills[index];
      await deleteSkill(index + 1); // Assuming index+1 is the skill id
      const skills = await fetchSkills();
      setContent(prev => ({ ...prev, skills }));
    } catch (e) {
      console.error('Failed to delete skill', e);
    }
  };

  const updateContact = (data: Partial<ContactContent>) => {
    setContent(prev => ({
      ...prev,
      contact: { ...prev.contact, ...data }
    }));
  };

  return (
    <ContentContext.Provider value={{
      content,
      updateHero,
      updateAbout,
      updateProject,
      addProject,
      removeProject,
      updateCategories,
      updateSkill,
      addSkill,
      removeSkill,
      updateContact
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
