import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import ChatWidget from "./ChatWidget";
import { fetchMessagesAPI } from "@/services/api";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [useServer, setUseServer] = useState(false);
  
  useEffect(() => {
    // Check if server is available
    const checkServer = async () => {
      try {
        const response = await fetchMessagesAPI();
        if (response.ok) {
          setUseServer(true);
        }
      } catch (error) {
        console.error('Could not connect to server:', error);
        setUseServer(false);
      }
    };
    
    checkServer();
  }, []);
  
  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100]">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      </div>
      
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} useServer={useServer} />}
    </>
  );
};

export default ChatButton;
