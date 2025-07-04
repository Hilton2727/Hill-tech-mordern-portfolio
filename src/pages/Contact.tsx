
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AdminLink from "@/components/AdminLink";
import ChatButton from "@/components/ChatButton";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Contact />
      </main>
      <Footer />
      <ChatButton />
      <AdminLink />
    </div>
  );
};

export default ContactPage;
