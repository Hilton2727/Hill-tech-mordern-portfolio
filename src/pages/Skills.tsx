
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdminLink from "@/components/AdminLink";
import ChatButton from "@/components/ChatButton";

const SkillsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Skills />
      </main>
      <Footer />
      <ChatButton />
      <AdminLink />
    </div>
  );
};

export default SkillsPage;
