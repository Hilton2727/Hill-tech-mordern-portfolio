import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { fetchMessagesAPI } from "@/services/api";

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWidgetProps {
  onClose: () => void;
  useServer?: boolean;
}

const ChatWidget = ({ onClose, useServer = false }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hi there! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [adminReply, setAdminReply] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check for existing chat session in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key) || '{}');
          setSessionId(key.replace('chat_', ''));
          setName(chatData.user.name);
          setEmail(chatData.user.email);
          setChatStarted(true);
          setMessages([
            {
              text: "Hi there! How can I help you today?",
              isUser: false,
              timestamp: new Date(),
            },
            ...chatData.messages
          ]);
          
          // If there's an admin reply, show it
          if (chatData.reply) {
            setAdminReply(chatData.reply);
          }
          
          break;
        } catch (error) {
          console.error('Error loading chat session:', error);
        }
      }
    }
  }, []);
  
  useEffect(() => {
    // Check if we have a sessionId and useServer is true
    if (sessionId && useServer && adminReply === null) {
      // Try to get the message from the server
      const fetchMessage = async () => {
        try {
          const response = await fetchMessagesAPI();
          if (response.success && response.data) {
              // Find the message with the matching ID
            const message = response.data.find((msg: any) => msg.id.toString() === sessionId);
              if (message && message.reply) {
                setAdminReply(message.reply);
                
                // Add the admin reply to the messages
                setMessages(prev => [
                  ...prev,
                  {
                    text: message.reply,
                    isUser: false,
                    timestamp: new Date(),
                  }
                ]);
            }
          }
        } catch (error) {
          console.error('Error fetching message:', error);
        }
      };
      
      fetchMessage();
    }
  }, [sessionId, useServer]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleStart = () => {
    // Validate name and email
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Generate a session ID
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setChatStarted(true);
  };
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setIsSubmitting(true);
    
    // Store chat session in localStorage
    const chatSession = {
      user: {
        name,
        email,
      },
      messages: [...messages.slice(1), userMessage], // Skip the initial greeting
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    // Save to server if available
    if (useServer) {
      try {
        const response = await fetchMessagesAPI();
        
        if (response.success && response.data) {
          // If the server returns an ID, use it as the session ID
          if (response.data.id) {
            setSessionId(response.data.id.toString());
          }
        } else {
          // If server fails, fallback to localStorage
          localStorage.setItem(`chat_${sessionId}`, JSON.stringify(chatSession));
        }
      } catch (error) {
        console.error('Error saving message to server:', error);
        // Fallback to localStorage
        localStorage.setItem(`chat_${sessionId}`, JSON.stringify(chatSession));
      }
    } else {
      // Store in localStorage if server is not available
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(chatSession));
    }
    
    // Clear input
    setInput("");
    setIsSubmitting(false);
    
    // Simulate auto response or you could connect to an actual API
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thanks for your message! We'll get back to you soon.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };
  
  return (
    <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50 flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between bg-primary p-3">
        <h3 className="text-primary-foreground font-medium flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Chat with Us
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:text-primary-foreground hover:bg-primary/90"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {!chatStarted ? (
        <div className="p-4 flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleStart} className="w-full">
            Start Chat
          </Button>
        </div>
      ) : (
        <>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-secondary text-secondary-foreground rounded-tl-none'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 block text-right mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                className="min-h-[40px] max-h-[120px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isSubmitting}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isSubmitting || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
