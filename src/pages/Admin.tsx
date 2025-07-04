import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AboutEditor from "@/components/admin/AboutEditor";
import ProjectsEditor from "@/components/admin/ProjectsEditor";
import SkillsEditor from "@/components/admin/SkillsEditor";
import ContactEditor from "@/components/admin/ContactEditor";
import HeroEditor from "@/components/admin/HeroEditor";
import MessagesEditor from "@/components/admin/MessagesEditor";
import SettingsEditor from "@/components/admin/SettingsEditor";
import ColorCustomizer from "@/components/admin/ColorCustomizer";
import BackgroundManager from "@/components/admin/BackgroundManager";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, ArrowLeft, Settings, LogOut, User, Briefcase, Brain, MessageCircle, Palette, Image, Home, FileText, Upload as UploadIcon, Server } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchMessagesAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Resume from "./admin/Resume";
import Upload from "./admin/Upload";
import Status from "./admin/Status";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isServerConnected, setIsServerConnected] = useState(true);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetchMessagesAPI();
        if (response.ok) {
          setIsServerConnected(true);
          loadMessages();
        } else {
          const data = await response.json();
          if (data.error === 'System not installed' && data.redirect === '/install') {
            window.location.href = '/install';
          } else {
            setIsServerConnected(false);
            countUnreadMessages();
          }
        }
      } catch (error) {
        setIsServerConnected(false);
        countUnreadMessages();
      }
    };
    
    checkServer();
  }, []);
  
  const loadMessages = async () => {
    try {
      const messages = await fetchMessagesAPI();
      const unreadCount = messages.filter((msg: any) => !msg.read).length;
      setUnreadMessages(unreadCount);
    } catch (error) {
      console.error('Error loading messages:', error);
      countUnreadMessages();
    }
  };
  
  const countUnreadMessages = () => {
    let count = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key) || '{}');
          if (!chatData.read) {
            count++;
          }
        } catch (error) {
          console.error('Error parsing chat data:', error);
        }
      }
    }
    
    setUnreadMessages(count);
  };
  
  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Changes saved successfully!");
    }, 1000);
  };
  
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { id: "hero", label: "Hero", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Brain },
    { id: "contact", label: "Contact", icon: MessageCircle },
    { 
      id: "messages", 
      label: "Messages", 
      icon: MessageCircle, 
      badge: unreadMessages > 0 ? unreadMessages : undefined 
    },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "uploads", label: "Uploads", icon: UploadIcon },
    { id: "colors", label: "Colors", icon: Palette },
    { id: "backgrounds", label: "Backgrounds", icon: Image },
    { id: "status", label: "Status", icon: Server },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "hero": return <HeroEditor />;
      case "about": return <AboutEditor />;
      case "projects": return <ProjectsEditor />;
      case "skills": return <SkillsEditor />;
      case "contact": return <ContactEditor />;
      case "messages": return <MessagesEditor useServer={isServerConnected} onUpdate={isServerConnected ? loadMessages : countUnreadMessages} />;
      case "resume": return <Resume />;
      case "uploads": return <Upload />;
      case "colors": return <ColorCustomizer />;
      case "backgrounds": return <BackgroundManager />;
      case "status": return <Status />;
      case "settings": return <SettingsEditor />;
      default: return <HeroEditor />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                        className="w-full justify-start"
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 space-y-2">
            <Link to="/">
              <Button variant="outline" className="w-full justify-start">
                <ArrowLeft size={18} className="mr-2" />
                Back to Site
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              {!isServerConnected && (
                <Link to="/install">
                  <Button variant="outline" className="gap-2">
                    <Settings size={18} />
                    Install Database
                  </Button>
                </Link>
              )}
              <Button onClick={handleSave} disabled={loading} className="gap-2">
                <Save size={18} />
                Save Changes
              </Button>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab} Management</CardTitle>
                <CardDescription>
                  Manage your {activeTab} section content and settings
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="mt-6">
              {renderContent()}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
