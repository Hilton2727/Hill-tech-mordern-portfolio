
import { useScrollAnimation } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import { icons } from "lucide-react";

const Contact = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { content } = useContent();
  const { location, email, phone, socialLinks } = content.contact;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
  };

  // Dynamically render icons based on the icon name
  const renderIcon = (iconName: string) => {
    const LucideIcon = icons[iconName as keyof typeof icons];
    return LucideIcon ? <LucideIcon size={16} /> : null;
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-4 bg-secondary/50">
      <div 
        ref={ref}
        className={`container mx-auto px-4 md:px-6 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent rounded-full">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Location</h3>
                  <p className="text-muted-foreground">{location}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent rounded-full">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Email</h3>
                  <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-accent rounded-full">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Phone</h3>
                  <a href={`tel:${phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <h3 className="text-xl font-semibold">Let's connect</h3>
              <p className="text-muted-foreground">
                Follow me on social media or check out my coding portfolio.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url} 
                    className="p-3 bg-accent hover:bg-accent/80 text-foreground rounded-full transition-colors"
                    aria-label={link.name}
                  >
                    {renderIcon(link.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="How can I help you?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
