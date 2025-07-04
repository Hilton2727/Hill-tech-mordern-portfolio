
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash, MoveUp, MoveDown, Plus, Shuffle } from "lucide-react";

const BackgroundManager = () => {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [newBackground, setNewBackground] = useState("");
  const [randomMode, setRandomMode] = useState(true);

  useEffect(() => {
    // Load saved backgrounds
    const savedBackgrounds = localStorage.getItem('heroBackgrounds');
    if (savedBackgrounds) {
      setBackgrounds(JSON.parse(savedBackgrounds));
    } else {
      // Default backgrounds
      setBackgrounds(["/screen1.jpg", "/screen2.jpg", "/screen3.jpg", "/screen4.jpg"]);
    }

    const savedRandomMode = localStorage.getItem('backgroundRandomMode');
    setRandomMode(savedRandomMode ? JSON.parse(savedRandomMode) : true);
  }, []);

  const saveBackgrounds = () => {
    localStorage.setItem('heroBackgrounds', JSON.stringify(backgrounds));
    localStorage.setItem('backgroundRandomMode', JSON.stringify(randomMode));
    toast.success("Background settings saved successfully");
  };

  const addBackground = () => {
    if (!newBackground.trim()) {
      toast.error("Please enter a background URL");
      return;
    }
    
    setBackgrounds([...backgrounds, newBackground]);
    setNewBackground("");
  };

  const removeBackground = (index: number) => {
    setBackgrounds(backgrounds.filter((_, i) => i !== index));
  };

  const moveBackground = (index: number, direction: 'up' | 'down') => {
    const newBackgrounds = [...backgrounds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < backgrounds.length) {
      [newBackgrounds[index], newBackgrounds[targetIndex]] = [newBackgrounds[targetIndex], newBackgrounds[index]];
      setBackgrounds(newBackgrounds);
    }
  };

  const testBackground = (url: string) => {
    // Create a temporary div to test the background
    const testDiv = document.createElement('div');
    testDiv.style.backgroundImage = `url(${url})`;
    testDiv.style.width = '100px';
    testDiv.style.height = '100px';
    testDiv.style.position = 'fixed';
    testDiv.style.top = '-200px';
    testDiv.style.backgroundSize = 'cover';
    
    document.body.appendChild(testDiv);
    
    setTimeout(() => {
      document.body.removeChild(testDiv);
    }, 1000);
    
    toast.success("Background test completed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Background Manager</CardTitle>
        <CardDescription>Manage hero section background images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Random Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Random Background Selection</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, backgrounds will be randomly selected on page load
            </p>
          </div>
          <Switch checked={randomMode} onCheckedChange={setRandomMode} />
        </div>

        {/* Add New Background */}
        <div className="space-y-2">
          <Label>Add New Background</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL (e.g., /image.jpg or https://...)"
              value={newBackground}
              onChange={(e) => setNewBackground(e.target.value)}
            />
            <Button onClick={addBackground}>
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Background List */}
        <div className="space-y-2">
          <Label>Current Backgrounds ({backgrounds.length})</Label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {backgrounds.map((bg, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium truncate">{bg}</div>
                  <div className="text-xs text-muted-foreground">Position: {index + 1}</div>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testBackground(bg)}
                  >
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveBackground(index, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveBackground(index, 'down')}
                    disabled={index === backgrounds.length - 1}
                  >
                    <MoveDown size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeBackground(index)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={saveBackgrounds} className="flex-1">
            <Shuffle size={16} className="mr-2" />
            Save Settings
          </Button>
        </div>

        {/* Usage Instructions */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use high-resolution images (1920x1080 or higher) for best quality</li>
            <li>Images should be in JPG, PNG, or WebP format</li>
            <li>For dark mode, consider using darker images or overlays</li>
            <li>Test backgrounds before saving to ensure they load correctly</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundManager;
