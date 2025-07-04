import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-primary" : "text-foreground";
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/90 backdrop-blur-md shadow-sm py-2 border-b border-border' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            <span className="text-primary">Portfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`hover:text-primary transition-colors ${isActive('/')}`}>Home</Link>
            <Link to="/about" className={`hover:text-primary transition-colors ${isActive('/about')}`}>About</Link>
            <Link to="/projects" className={`hover:text-primary transition-colors ${isActive('/projects')}`}>Projects</Link>
            <Link to="/skills" className={`hover:text-primary transition-colors ${isActive('/skills')}`}>Skills</Link>
            <Link to="/contact" className={`hover:text-primary transition-colors ${isActive('/contact')}`}>Contact</Link>
            <Button variant="default" size="sm">Resume</Button>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden p-2 focus:outline-none text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 animate-fade-in border-t border-border">
          <nav className="flex flex-col items-center pt-10 space-y-6">
            <Link 
              to="/" 
              className={`text-lg hover:text-primary transition-colors ${isActive('/')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-lg hover:text-primary transition-colors ${isActive('/about')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/projects" 
              className={`text-lg hover:text-primary transition-colors ${isActive('/projects')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              to="/skills" 
              className={`text-lg hover:text-primary transition-colors ${isActive('/skills')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Skills
            </Link>
            <Link 
              to="/contact" 
              className={`text-lg hover:text-primary transition-colors ${isActive('/contact')}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button variant="default" size="sm">Resume</Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
