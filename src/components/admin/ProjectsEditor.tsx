import { useState, useRef } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Trash, 
  Edit, 
  X,
  Plus,
  Save
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { listUploadedFiles, uploadFile } from "@/services/api";
import AnimatedList from "@/components/ui/AnimatedList";
import { motion } from "framer-motion";

const ProjectsEditor = () => {
  const { content, updateProject, addProject, removeProject, updateCategories } = useContent();
  const [categories, setCategories] = useState(content.categories);
  const [newCategory, setNewCategory] = useState("");
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image: "",
    tags: [] as string[],
    demoLink: "",
    codeLink: "",
    category: "web"
  });
  const [newTag, setNewTag] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [serverFiles, setServerFiles] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedServerImage, setSelectedServerImage] = useState<string | null>(null);

  const startEditingProject = (id: number) => {
    const project = content.projects.find(p => p.id === id);
    if (project) {
      setProjectForm({
        title: project.title,
        description: project.description,
        image: project.image,
        tags: [...project.tags],
        demoLink: project.demoLink,
        codeLink: project.codeLink,
        category: project.category
      });
      setEditingProject(id);
    }
  };

  const saveProject = () => {
    if (editingProject !== null) {
      updateProject(editingProject, projectForm);
    } else {
      addProject(projectForm);
    }
    resetForm();
  };

  const resetForm = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      description: "",
      image: "",
      tags: [],
      demoLink: "",
      codeLink: "",
      category: "web"
    });
    setNewTag("");
  };

  const handleAddTag = () => {
    if (newTag && !projectForm.tags.includes(newTag)) {
      setProjectForm({
        ...projectForm,
        tags: [...projectForm.tags, newTag]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setProjectForm({
      ...projectForm,
      tags: projectForm.tags.filter(t => t !== tag)
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const newCategories = [...categories, newCategory];
      setCategories(newCategories);
      updateCategories(newCategories);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    if (category !== "all") {
      const newCategories = categories.filter(c => c !== category);
      setCategories(newCategories);
      updateCategories(newCategories);
    }
  };

  const openImageModal = async () => {
    setImageModalOpen(true);
    try {
      const data = await listUploadedFiles();
      // Only image files
      const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      const images = (data.files || []).filter((f: any) => imageExts.some(ext => f.name.toLowerCase().endsWith(ext)));
      setServerFiles(images.map((f: any) => f.url || f.path || f.name));
    } catch (e) {
      setServerFiles([]);
    }
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = await uploadFile(file);
      if (data.success && data.url) {
        setProjectForm({ ...projectForm, image: data.url });
        setImageModalOpen(false);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSelectServerFile = (url: string) => {
    setProjectForm({ ...projectForm, image: url });
    setImageModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage project categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category, index) => (
                <Badge key={index} className="px-3 py-1 flex items-center gap-1">
                  {category}
                  {category !== "all" && (
                    <button 
                      onClick={() => handleRemoveCategory(category)}
                      className="text-xs hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder="New category"
              />
              <Button onClick={handleAddCategory} variant="outline">Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{editingProject !== null ? "Edit Project" : "Add New Project"}</CardTitle>
              <CardDescription>
                {editingProject !== null 
                  ? "Update an existing project" 
                  : "Add a new project to your portfolio"}
              </CardDescription>
            </div>
            {editingProject !== null && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={projectForm.title} 
                onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                placeholder="Project title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={projectForm.description} 
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                placeholder="Project description"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="image" 
                  value={projectForm.image} 
                  onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
                <Button type="button" variant="outline" onClick={openImageModal}>Upload/Select Image</Button>
              </div>
              {projectForm.image && (
                <div className="flex items-center gap-4 mt-2">
                  <img src={projectForm.image} alt="Preview" className="max-h-32 rounded border" />
                  <Button type="button" variant="destructive" size="sm" onClick={() => setProjectForm({...projectForm, image: ""})}>
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {projectForm.tags.map((tag, index) => (
                  <Badge key={index} className="px-3 py-1 flex items-center gap-1">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="text-xs hover:text-destructive"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                />
                <Button onClick={handleAddTag} variant="outline">Add</Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={projectForm.category}
                onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {categories.filter(c => c !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="demoLink">Demo URL</Label>
              <Input 
                id="demoLink" 
                value={projectForm.demoLink} 
                onChange={(e) => setProjectForm({...projectForm, demoLink: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="codeLink">Code URL</Label>
              <Input 
                id="codeLink" 
                value={projectForm.codeLink} 
                onChange={(e) => setProjectForm({...projectForm, codeLink: e.target.value})}
                placeholder="https://github.com/yourusername/project"
              />
            </div>
            
            <Button onClick={saveProject} className="w-full gap-2">
              <Save size={16} />
              {editingProject !== null ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Projects</CardTitle>
          <CardDescription>Manage your portfolio projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.projects.map((project) => (
              <div key={project.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEditingProject(project.id)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            {content.projects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No projects yet. Add your first project!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {imageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#18181b] p-6 rounded-2xl shadow-2xl max-w-md w-full border border-[#222] text-white">
            <h2 className="text-lg font-bold mb-4">Select Project Image</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload from device</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleDeviceUpload} disabled={uploadingImage} className="bg-[#222] text-white rounded p-2" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Or select from server</label>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-2 bg-[#111] flex flex-wrap gap-4 justify-center">
                {serverFiles.length === 0 && <div className="text-sm text-gray-400">No images found.</div>}
                {serverFiles.map((url, i) => (
                  <motion.div
                    key={url}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => {
                      setProjectForm({ ...projectForm, image: url });
                      setImageModalOpen(false);
                    }}
                  >
                    <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg border-2 border-[#333] hover:border-primary transition" />
                  </motion.div>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setImageModalOpen(false)} className="mt-2 w-full py-2 rounded-lg bg-[#222] text-white hover:bg-[#333] transition">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsEditor;
