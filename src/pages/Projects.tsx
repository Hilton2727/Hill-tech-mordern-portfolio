
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdminLink from "@/components/AdminLink";
import ChatButton from "@/components/ChatButton";

const ProjectsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Projects />
      </main>
      <Footer />
      <ChatButton />
      <AdminLink />
    </div>
  );
};

export default ProjectsPage;
