
import About from "@/components/About";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdminLink from "@/components/AdminLink";
import ChatButton from "@/components/ChatButton";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <About />
      </main>
      <Footer />
      <ChatButton />
      <AdminLink />
    </div>
  );
};

export default AboutPage;
