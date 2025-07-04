
import { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { icons } from "lucide-react";
import { 
  PlusCircle, 
  Trash, 
  Edit, 
  X,
  Plus,
  Save
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SkillsEditor = () => {
  const { content, updateSkill, addSkill, removeSkill } = useContent();
  const [editingSkill, setEditingSkill] = useState<number | null>(null);
  const [skillForm, setSkillForm] = useState({
    title: "",
    icon: "Code",
    skills: [] as string[]
  });
  const [newSkillTag, setNewSkillTag] = useState("");

  // Get all icon names from lucide-react
  const iconNames = Object.keys(icons);

  const startEditingSkill = (index: number) => {
    const skill = content.skills[index];
    setSkillForm({
      title: skill.title,
      icon: skill.icon,
      skills: [...skill.skills]
    });
    setEditingSkill(index);
  };

  const saveSkill = () => {
    if (editingSkill !== null) {
      updateSkill(editingSkill, skillForm);
    } else {
      addSkill(skillForm);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingSkill(null);
    setSkillForm({
      title: "",
      icon: "Code",
      skills: []
    });
    setNewSkillTag("");
  };

  const handleAddSkillTag = () => {
    if (newSkillTag && !skillForm.skills.includes(newSkillTag)) {
      setSkillForm({
        ...skillForm,
        skills: [...skillForm.skills, newSkillTag]
      });
      setNewSkillTag("");
    }
  };

  const handleRemoveSkillTag = (tag: string) => {
    setSkillForm({
      ...skillForm,
      skills: skillForm.skills.filter(t => t !== tag)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{editingSkill !== null ? "Edit Skill" : "Add New Skill"}</CardTitle>
              <CardDescription>
                {editingSkill !== null 
                  ? "Update an existing skill" 
                  : "Add a new skill to your portfolio"}
              </CardDescription>
            </div>
            {editingSkill !== null && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="skill-title">Title</Label>
              <Input 
                id="skill-title" 
                value={skillForm.title} 
                onChange={(e) => setSkillForm({...skillForm, title: e.target.value})}
                placeholder="Skill category title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="skill-icon">Icon</Label>
              <select
                id="skill-icon"
                value={skillForm.icon}
                onChange={(e) => setSkillForm({...skillForm, icon: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {iconNames.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skillForm.skills.map((skill, index) => (
                  <Badge key={index} className="px-3 py-1 flex items-center gap-1">
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkillTag(skill)}
                      className="text-xs hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkillTag}
                  onChange={e => setNewSkillTag(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button onClick={handleAddSkillTag} variant="outline">Add</Button>
              </div>
            </div>
            
            <Button onClick={saveSkill} className="w-full gap-2">
              <Save size={16} />
              {editingSkill !== null ? "Update Skill" : "Add Skill"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Skills</CardTitle>
          <CardDescription>Manage your skills and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.skills.map((skill, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-semibold">{skill.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {skill.skills.slice(0, 3).join(", ")} 
                    {skill.skills.length > 3 && "..."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEditingSkill(index)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            {content.skills.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No skills yet. Add your first skill category!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsEditor;
