import { useScrollAnimation } from "@/lib/animations";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import { 
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Projects = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { content } = useContent();
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredProjects = filter === "all" 
    ? content.projects 
    : content.projects.filter(project => project.category === filter);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  return (
    <section id="projects" className="py-20 md:py-32 px-4 bg-secondary/50">
      <div 
        ref={ref}
        className={`container mx-auto px-4 md:px-6 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore a selection of my recent work that showcases my skills and areas of expertise.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {content.categories.map((category, index) => (
              <Badge 
                key={index}
                variant={filter === category ? "default" : "outline"}
                className="cursor-pointer text-sm py-2 px-4"
                onClick={() => setFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
              <Card 
              key={project.id}
              className="overflow-hidden hover-scale cursor-pointer w-full h-full"
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      {project.demoLink && (
                        <a 
                          href={project.demoLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink size={18} />
                          <span className="sr-only">Live Demo</span>
                        </a>
                      )}
                      {project.codeLink && (
                        <a 
                          href={project.codeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github size={18} />
                          <span className="sr-only">View Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
          {selectedProject && (
            <div className="flex flex-col h-full overflow-auto">
              {/* Header with image */}
              <div className="relative w-full h-64 md:h-80">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
                <DialogClose className="absolute top-4 right-4 bg-background/80 rounded-full p-1">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              
              {/* Content */}
              <div className="p-6 md:p-8 flex-grow">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <h2 className="text-3xl font-bold">{selectedProject.title}</h2>
                  <div className="flex items-center space-x-3">
                    {selectedProject.demoLink && (
                      <Button asChild variant="outline" size="sm">
                        <a 
                          href={selectedProject.demoLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {selectedProject.codeLink && (
                      <Button asChild variant="outline" size="sm">
                        <a 
                          href={selectedProject.codeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github size={16} />
                          Source Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Category</h3>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
