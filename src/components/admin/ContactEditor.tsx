import { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { icons } from "lucide-react";
import { Trash, PlusCircle, Save } from "lucide-react";
import { saveContact } from "@/services/api";
import { toast } from "sonner";

const ContactEditor = () => {
  const { content, updateContact } = useContent();
  const [contactData, setContactData] = useState({
    location: content.contact.location,
    email: content.contact.email,
    phone: content.contact.phone,
    socialLinks: [...content.contact.socialLinks]
  });
  const [loading, setLoading] = useState(false);

  const handleContactChange = (field: 'location' | 'email' | 'phone', value: string) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (index: number, field: 'name' | 'url' | 'icon', value: string) => {
    setContactData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    setContactData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: "New Link", url: "#", icon: "Link" }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setContactData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveContact(contactData);
      updateContact(contactData);
      toast.success("Contact information saved successfully!");
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error("Failed to save contact information");
    } finally {
      setLoading(false);
    }
  };

  // Get all icon names from lucide-react
  const iconNames = Object.keys(icons);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Edit your contact details</CardDescription>
            </div>
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={contactData.location} 
                onChange={(e) => handleContactChange('location', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={contactData.email} 
                onChange={(e) => handleContactChange('email', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                value={contactData.phone} 
                onChange={(e) => handleContactChange('phone', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Social Links</Label>
              <Button 
                onClick={addSocialLink} 
                variant="outline" 
                size="sm"
                className="gap-1"
              >
                <PlusCircle size={16} />
                Add Link
              </Button>
            </div>
            
            <div className="space-y-4">
              {contactData.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                  <div>
                    <Label htmlFor={`contact-social-name-${index}`}>Name</Label>
                    <Input
                      id={`contact-social-name-${index}`}
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`contact-social-url-${index}`}>URL</Label>
                    <Input
                      id={`contact-social-url-${index}`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`contact-social-icon-${index}`}>Icon</Label>
                    <select
                      id={`contact-social-icon-${index}`}
                      value={link.icon}
                      onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {iconNames.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactEditor;
