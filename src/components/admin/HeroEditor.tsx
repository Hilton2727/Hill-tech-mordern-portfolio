import { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { icons } from "lucide-react";
import { Trash, PlusCircle, Save } from "lucide-react";
import { saveHero } from "@/services/api";
import { toast } from "sonner";

const HeroEditor = () => {
  const { content, updateHero } = useContent();
  const [heroData, setHeroData] = useState({
    name: content.hero.name,
    tagline: content.hero.tagline,
    socialLinks: [...content.hero.socialLinks]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: 'name' | 'tagline', value: string) => {
    setHeroData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (index: number, field: 'name' | 'url' | 'icon', value: string) => {
    setHeroData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addSocialLink = () => {
    setHeroData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: "New Link", url: "#", icon: "Link" }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setHeroData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveHero(heroData);
      updateHero(heroData);
      toast.success("Hero updated!");
    } catch (e) {
      toast.error("Failed to update hero");
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
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Edit your main introduction and social links</CardDescription>
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
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={heroData.name} 
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input 
                id="tagline" 
                value={heroData.tagline} 
                onChange={(e) => handleChange('tagline', e.target.value)}
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
              {heroData.socialLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                  <div>
                    <Label htmlFor={`social-name-${index}`}>Name</Label>
                    <Input
                      id={`social-name-${index}`}
                      value={link.name}
                      onChange={(e) => handleSocialLinkChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`social-url-${index}`}>URL</Label>
                    <Input
                      id={`social-url-${index}`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`social-icon-${index}`}>Icon</Label>
                    <select
                      id={`social-icon-${index}`}
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

export default HeroEditor;
