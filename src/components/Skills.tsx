
import { useScrollAnimation } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/contexts/ContentContext";
import { icons } from "lucide-react";

const Skills = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { content } = useContent();

  // Dynamically render icons based on the icon name
  const renderIcon = (iconName: string) => {
    const LucideIcon = icons[iconName as keyof typeof icons];
    return LucideIcon ? <LucideIcon size={24} className="text-primary" /> : null;
  };

  return (
    <section id="skills" className="py-20 md:py-32 px-4">
      <div 
        ref={ref}
        className={`container mx-auto px-4 md:px-6 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Expertise</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My technical skills and areas of expertise that I've developed over the years.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.skills.map((skill, index) => (
            <Card key={index} className="hover-scale">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-accent rounded-full mb-4">
                    {renderIcon(skill.icon)}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{skill.title}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {skill.skills.map((item, i) => (
                      <span 
                        key={i} 
                        className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
