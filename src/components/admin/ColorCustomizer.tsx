
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  destructive: string;
}

const defaultColors: ColorPalette = {
  primary: "250 47.4% 60.2%",
  secondary: "210 40% 96.1%",
  accent: "250 47.4% 95.1%",
  background: "0 0% 100%",
  foreground: "222.2 84% 4.9%",
  muted: "210 40% 96.1%",
  border: "214.3 31.8% 91.4%",
  destructive: "0 84.2% 60.2%",
};

const presetPalettes = [
  {
    name: "Ocean Blue",
    colors: {
      primary: "210 100% 50%",
      secondary: "210 40% 96.1%",
      accent: "210 100% 95%",
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      muted: "210 40% 96.1%",
      border: "214.3 31.8% 91.4%",
      destructive: "0 84.2% 60.2%",
    }
  },
  {
    name: "Forest Green",
    colors: {
      primary: "120 60% 40%",
      secondary: "120 20% 96.1%",
      accent: "120 60% 95%",
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      muted: "120 20% 96.1%",
      border: "214.3 31.8% 91.4%",
      destructive: "0 84.2% 60.2%",
    }
  },
  {
    name: "Sunset Orange",
    colors: {
      primary: "25 100% 60%",
      secondary: "25 40% 96.1%",
      accent: "25 100% 95%",
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      muted: "25 40% 96.1%",
      border: "214.3 31.8% 91.4%",
      destructive: "0 84.2% 60.2%",
    }
  }
];

const ColorCustomizer = () => {
  const [colors, setColors] = useState<ColorPalette>(defaultColors);

  useEffect(() => {
    // Load saved colors from localStorage
    const savedColors = localStorage.getItem('siteColors');
    if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors);
        setColors({ ...defaultColors, ...parsedColors });
      } catch (error) {
        console.error("Error parsing saved colors:", error);
      }
    }
  }, []);

  const applyColors = (newColors: ColorPalette) => {
    Object.entries(newColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  const handleColorChange = (colorKey: keyof ColorPalette, value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    applyColors(newColors);
  };

  const saveColors = () => {
    localStorage.setItem('siteColors', JSON.stringify(colors));
    toast.success("Colors saved successfully!");
  };

  const resetColors = () => {
    setColors(defaultColors);
    applyColors(defaultColors);
    localStorage.removeItem('siteColors');
    toast.success("Colors reset to default!");
  };

  const applyPreset = (preset: typeof presetPalettes[0]) => {
    setColors(preset.colors);
    applyColors(preset.colors);
    toast.success(`Applied ${preset.name} preset!`);
  };

  const hexToHsl = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number, l: number;

    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map((val, index) => {
      if (index === 0) return parseInt(val) / 360;
      return parseInt(val.replace('%', '')) / 100;
    });

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Palettes */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Preset Palettes</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {presetPalettes.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-12 justify-start"
                  onClick={() => applyPreset(preset)}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: `hsl(${preset.colors.primary})` }}
                    />
                    <span>{preset.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Individual Color Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id={key}
                    type="color"
                    value={hslToHex(value)}
                    onChange={(e) => handleColorChange(key as keyof ColorPalette, hexToHsl(e.target.value))}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                    placeholder="HSL format: 250 47.4% 60.2%"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button onClick={saveColors}>
              Save Colors
            </Button>
            <Button variant="outline" onClick={resetColors}>
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorCustomizer;
