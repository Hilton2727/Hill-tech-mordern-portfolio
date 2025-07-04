import { useScrollAnimation } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/contexts/ContentContext";
import { useCounter } from "@/hooks/useCounter";
import ProfileCard from "@/components/ui/ProfileCard";
import RotatingText from "@/components/ui/RotatingText";

const About = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { content } = useContent();
  const { paragraphs, stats } = content.about;

  return (
    <section id="about" className="py-20 md:py-32 px-4">
      <div 
        ref={ref}
        className={`container mx-auto px-4 md:px-6 ${isVisible ? 'fade-in-up' : 'opacity-0'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="flex justify-center">
              <ProfileCard 
                avatarUrl={content.about.profile_image || "/profile.jpg"}
                name={content.hero.name}
                title={content.about.title || "Software Engineer"}
                handle={content.hero.name.toLowerCase().replace(/\s+/g, '')}
                status={content.about.status || "Online"}
                contactText="Contact"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <span className="text-4xl md:text-5xl font-extrabold text-[#d1d1d1] mr-2">{content.about.creative_text || 'Creative'}</span>
                <span className="bg-[#6c47ff] rounded-lg px-6 py-2 text-3xl md:text-4xl font-bold text-white flex items-center overflow-hidden min-w-[160px] max-w-[220px] justify-center">
                  <RotatingText texts={content.about.rotating_texts || ["Developer", "Designer", "Thinker"]} rotationInterval={2000} mainClassName="inline-block w-full text-center" />
                </span>
              </div>
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} isVisible={isVisible} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, isVisible }: { stat: { value: string; label: string }, isVisible: boolean }) => {
  const numericValue = parseInt(stat.value.replace(/\D/g, ''));
  const count = useCounter(numericValue, 2000, isVisible);
  const suffix = stat.value.replace(/\d/g, '');

  return (
    <Card className="hover-scale">
      <CardContent className="p-6 text-center">
        <h3 className="text-5xl font-bold text-primary mb-2 animate-count-up">
          {count}{suffix}
        </h3>
        <p className="text-muted-foreground">{stat.label}</p>
      </CardContent>
    </Card>
  );
};

export default About;
