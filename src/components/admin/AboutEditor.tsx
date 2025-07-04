import { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash, Save } from "lucide-react";
import { saveAbout, fetchAbout } from "@/services/api";
import { toast } from "sonner";

const statusOptions = [
  { value: 'online', label: '🟢 Online' },
  { value: 'offline', label: '⚪️ Offline' },
  { value: 'sleep', label: '💤 Sleep' },
];

const AboutEditor = () => {
  const { content, updateAbout } = useContent();
  const [paragraphs, setParagraphs] = useState(content.about.paragraphs);
  const [stats, setStats] = useState(content.about.stats);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(content.about.status || 'online');
  const [profileImage, setProfileImage] = useState(content.about.profile_image || '');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(profileImage ? profileImage : '');
  const [title, setTitle] = useState(content.about.title || 'Software Engineer');
  const [creativeText, setCreativeText] = useState(content.about.creative_text || 'Creative');
  const [rotatingTexts, setRotatingTexts] = useState<string[]>(content.about.rotating_texts || []);

  const handleParagraphChange = (index: number, value: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
  };

  const addParagraph = () => {
    setParagraphs(prev => [...prev, "New paragraph"]);
  };

  const removeParagraph = (index: number) => {
    setParagraphs(prev => prev.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: 'value' | 'label', value: string) => {
    setStats(prev => prev.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat
    ));
  };

  const addStat = () => {
    setStats(prev => [...prev, { value: "0", label: "New Stat" }]);
  };

  const removeStat = (index: number) => {
    setStats(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRotatingTextChange = (index: number, value: string) => {
    setRotatingTexts(prev => prev.map((t, i) => i === index ? value : t));
  };

  const addRotatingText = () => {
    setRotatingTexts(prev => [...prev, 'New Text']);
  };

  const removeRotatingText = (index: number) => {
    setRotatingTexts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', status);
      formData.append('title', title);
      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      } else if (profileImage) {
        formData.append('profile_image', profileImage);
      }
      formData.append('paragraphs', JSON.stringify(paragraphs));
      formData.append('stats', JSON.stringify(stats));
      formData.append('rotating_texts', JSON.stringify(rotatingTexts));
      formData.append('creative_text', creativeText);
      await saveAbout(formData);
      const latestAbout = await fetchAbout();
      updateAbout(latestAbout);
      toast.success("About updated!");
    } catch (e) {
      toast.error("Failed to update about");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
          <CardTitle>About Section</CardTitle>
              <CardDescription>Edit your bio, profile image, status, creative text, and rotating texts</CardDescription>
            </div>
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex flex-col items-center gap-2">
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && <img src={previewUrl} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />}
            </div>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Job Title"
              />
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <Label htmlFor="creativeText">Creative Text</Label>
              <Input
                id="creativeText"
                value={creativeText}
                onChange={e => setCreativeText(e.target.value)}
                placeholder="Creative Text"
              />
            </div>
          </div>
          <div className="space-y-4">
            {paragraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <Textarea 
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  rows={3}
                  className="flex-1"
                />
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => removeParagraph(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            <Button 
              onClick={addParagraph}
              variant="outline"
              className="w-full gap-2"
            >
              <PlusCircle size={16} />
              Add Paragraph
            </Button>
          </div>
          <div className="mb-6">
            <Label>Rotating Texts</Label>
            {rotatingTexts.map((text, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <Input
                  value={text}
                  onChange={e => handleRotatingTextChange(i, e.target.value)}
                  className="flex-1"
                />
                <Button variant="destructive" size="icon" onClick={() => removeRotatingText(i)}><Trash size={16} /></Button>
              </div>
            ))}
            <Button onClick={addRotatingText} variant="outline" className="mt-2">Add Rotating Text</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
          <CardDescription>Edit your achievement statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label htmlFor={`stat-value-${index}`}>Value</Label>
                  <Input
                    id={`stat-value-${index}`}
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`stat-label-${index}`}>Label</Label>
                  <Input
                    id={`stat-label-${index}`}
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeStat(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
            <Button 
              onClick={addStat}
              variant="outline"
              className="w-full gap-2"
            >
              <PlusCircle size={16} />
              Add Stat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutEditor;
