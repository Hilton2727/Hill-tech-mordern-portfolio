import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { ContentProvider } from "./contexts/ContentContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteSettingsProvider from "@/contexts/SiteSettingsContext";
import Install from "./pages/Install";
import { checkInstallStatus } from "./services/api";

const queryClient = new QueryClient();

const AppContent = ({ isInstalled }: { isInstalled: boolean | null }) => {
  // Apply saved colors on startup
  useEffect(() => {
    const savedColors = localStorage.getItem('siteColors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value as string);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* If not installed, redirect all except /install to /install */}
        <Route path="/install" element={isInstalled ? <Navigate to="/" replace /> : <Install />} />
        <Route path="/*" element={
          !isInstalled ? <Navigate to="/install" replace /> :
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
          </Routes>
        } />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  useEffect(() => {
    console.log('API BASE:', import.meta.env.VITE_API_BASE_URL);
  }, []);
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstallStatus = async () => {
      try {
        const response = await checkInstallStatus();
        setIsInstalled(response.installed);
      } catch (error) {
        console.error("Failed to check installation status:", error);
        toast.error("Could not connect to the server. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstallStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ContentProvider>
            <ThemeProvider>
              <SiteSettingsProvider>
                <Toaster />
                <Sonner />
                <AppContent isInstalled={isInstalled} />
              </SiteSettingsProvider>
            </ThemeProvider>
          </ContentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
