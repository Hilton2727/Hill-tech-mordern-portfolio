import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircle, Trash, Eye, EyeOff, Send } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { fetchMessagesAPI } from "@/services/api";

interface MessagesEditorProps {
  useServer?: boolean;
  onUpdate?: () => void;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  user: {
    name: string;
    email: string;
  };
  messages: ChatMessage[];
  createdAt: string;
  read: boolean;
  reply?: string;
}

const MessagesEditor = ({ useServer = false, onUpdate }: MessagesEditorProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    loadChatSessions();
  }, []);
  
  const loadChatSessions = async () => {
    if (useServer) {
      try {
        const response = await fetchMessagesAPI();
        if (response.data && Array.isArray(response.data)) {
          const serverSessions = response.data.map((msg: any) => ({
            id: msg.id.toString(),
            user: {
              name: msg.name,
              email: msg.email
            },
            messages: [{
              text: msg.message,
              isUser: true,
              timestamp: new Date(msg.created_at)
            }],
            createdAt: msg.created_at,
            read: msg.read === 1,
            reply: msg.reply
          }));
          setChatSessions(serverSessions);
          
          // Update selected chat if it exists
          if (selectedChat) {
            const updatedSelectedChat = serverSessions.find(chat => chat.id === selectedChat.id);
            if (updatedSelectedChat) {
              setSelectedChat(updatedSelectedChat);
            }
          }
          
          return;
        }
      } catch (error) {
        console.error('Error loading server messages:', error);
        toast.error("Failed to load messages from server. Falling back to local storage.");
      }
    }
    
    // Fallback to localStorage if server failed or not available
    const sessions: ChatSession[] = [];
    
    // Get all chat sessions from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('chat_')) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key) || '{}');
          sessions.push({
            ...chatData,
            id: key.replace('chat_', '')
          });
        } catch (error) {
          console.error('Error parsing chat data:', error);
        }
      }
    }
    
    // Sort by date (newest first)
    sessions.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setChatSessions(sessions);
    
    // Update selected chat if it exists
    if (selectedChat) {
      const updatedSelectedChat = sessions.find(chat => chat.id === selectedChat.id);
      if (updatedSelectedChat) {
        setSelectedChat(updatedSelectedChat);
      }
    }
  };
  
  const handleViewChat = async (chat: ChatSession) => {
    // Mark as read if not already
    if (!chat.read) {
      if (useServer) {
        try {
          const response = await fetchMessagesAPI();
          
          if (response.ok) {
            if (onUpdate) onUpdate();
          }
        } catch (error) {
          console.error('Error updating message on server:', error);
        }
      } else {
        const updatedChat = { ...chat, read: true };
        localStorage.setItem(`chat_${chat.id}`, JSON.stringify(updatedChat));
        setChatSessions(prev => 
          prev.map(c => c.id === chat.id ? updatedChat : c)
        );
        
        if (onUpdate) onUpdate();
      }
    }
    
    setSelectedChat(chat);
    // If there's a reply, show it in the reply text field
    if (chat.reply) {
      setReplyText(chat.reply);
    } else {
      setReplyText("");
    }
  };
  
  const handleToggleRead = async (chat: ChatSession) => {
    const newReadState = !chat.read;
    
    if (useServer) {
      try {
        const response = await fetchMessagesAPI();
        
        if (response.ok) {
          const updatedChat = { ...chat, read: newReadState };
          setChatSessions(prev => 
            prev.map(c => c.id === chat.id ? updatedChat : c)
          );
          
          if (selectedChat && selectedChat.id === chat.id) {
            setSelectedChat(updatedChat);
          }
          
          toast.success(`Marked as ${newReadState ? 'read' : 'unread'}`);
          
          if (onUpdate) onUpdate();
        } else {
          toast.error("Failed to update message status");
        }
      } catch (error) {
        console.error('Error updating message on server:', error);
        toast.error("Failed to update message status");
      }
    } else {
      const updatedChat = { ...chat, read: newReadState };
      localStorage.setItem(`chat_${chat.id}`, JSON.stringify(updatedChat));
      
      setChatSessions(prev => 
        prev.map(c => c.id === chat.id ? updatedChat : c)
      );
      
      toast.success(`Marked as ${newReadState ? 'read' : 'unread'}`);
      
      // Update selected chat if it's the one being toggled
      if (selectedChat && selectedChat.id === chat.id) {
        setSelectedChat(updatedChat);
      }
      
      if (onUpdate) onUpdate();
    }
  };
  
  const handleDeleteChat = async (chat: ChatSession) => {
    if (window.confirm(`Are you sure you want to delete this conversation with ${chat.user.name}?`)) {
      if (useServer) {
        try {
          const response = await fetchMessagesAPI();
          
          if (response.ok) {
            setChatSessions(prev => prev.filter(c => c.id !== chat.id));
            
            if (selectedChat && selectedChat.id === chat.id) {
              setSelectedChat(null);
              setReplyText("");
            }
            
            toast.success("Message deleted successfully");
            
            if (onUpdate) onUpdate();
          } else {
            toast.error("Failed to delete message");
          }
        } catch (error) {
          console.error('Error deleting message from server:', error);
          toast.error("Failed to delete message");
        }
      } else {
        localStorage.removeItem(`chat_${chat.id}`);
        setChatSessions(prev => prev.filter(c => c.id !== chat.id));
        
        if (selectedChat && selectedChat.id === chat.id) {
          setSelectedChat(null);
          setReplyText("");
        }
        
        toast.success("Chat deleted successfully");
        
        if (onUpdate) onUpdate();
      }
    }
  };
  
  const handleSendReply = async () => {
    if (!selectedChat) return;
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    setIsReplying(true);
    
    if (useServer) {
      try {
        const response = await fetchMessagesAPI();
        
        if (response.ok) {
          toast.success("Reply sent successfully");
          
          // Refresh the messages to get the updated state
          await loadChatSessions();
          
          if (onUpdate) onUpdate();
        } else {
          toast.error("Failed to send reply");
        }
      } catch (error) {
        console.error('Error sending reply:', error);
        toast.error("Failed to send reply");
      } finally {
        setIsReplying(false);
      }
    } else {
      // For localStorage, we need to update the chat session
      setTimeout(() => {
        try {
          const updatedChat = { 
            ...selectedChat, 
            reply: replyText,
            read: true
          };
          
          localStorage.setItem(`chat_${selectedChat.id}`, JSON.stringify(updatedChat));
          
          // Update the chat sessions list
          setChatSessions(prev => 
            prev.map(c => c.id === selectedChat.id ? updatedChat : c)
          );
          
          // Update the selected chat
          setSelectedChat(updatedChat);
          
          toast.success("Reply sent successfully");
          
          if (onUpdate) onUpdate();
        } catch (error) {
          console.error('Error saving reply to localStorage:', error);
          toast.error("Failed to save reply");
        } finally {
          setIsReplying(false);
        }
      }, 500);
    }
  };
  
  // Render the component based on whether user is authenticated
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>You need to be logged in to view messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>Please log in to access the messages</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle size={20} /> Messages 
            <span className="text-sm font-normal text-muted-foreground">
              ({chatSessions.length})
            </span>
          </CardTitle>
          <CardDescription>
            Manage visitor chat messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chatSessions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No chat messages yet
            </p>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chatSessions.map(chat => (
                    <TableRow 
                      key={chat.id} 
                      className={`cursor-pointer ${selectedChat?.id === chat.id ? 'bg-muted' : ''} ${!chat.read ? 'font-medium' : ''}`}
                      onClick={() => handleViewChat(chat)}
                    >
                      <TableCell>
                        {chat.user.name}
                        {chat.reply && <span className="ml-1 text-xs text-green-500">★</span>}
                      </TableCell>
                      <TableCell>
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleRead(chat);
                            }}
                          >
                            {chat.read ? <EyeOff size={16} /> : <Eye size={16} />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat);
                            }}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          {selectedChat ? (
            <>
              <CardTitle>
                Conversation with {selectedChat.user.name}
              </CardTitle>
              <CardDescription>
                {selectedChat.user.email} • {new Date(selectedChat.createdAt).toLocaleString()}
              </CardDescription>
            </>
          ) : (
            <CardTitle>Select a conversation</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {selectedChat ? (
            <>
              <div className="space-y-4 max-h-[300px] overflow-y-auto p-2 mb-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-3 rounded-lg bg-primary text-primary-foreground rounded-tr-none">
                    <p className="text-sm">{selectedChat.messages[0].text}</p>
                    <span className="text-xs opacity-70 block text-right mt-1">
                      {new Date(selectedChat.messages[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                {/* Admin reply (if any) */}
                {selectedChat.reply && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-secondary-foreground rounded-tl-none">
                      <p className="text-sm">{selectedChat.reply}</p>
                      <span className="text-xs opacity-70 block text-right mt-1">
                        Admin Reply
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Reply form */}
              <div className="space-y-4 mt-4">
                <Textarea
                  placeholder="Type your reply here..."
                  className="min-h-[100px]"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isReplying}
                />
                <Button 
                  onClick={handleSendReply}
                  disabled={isReplying || !replyText.trim()}
                  className="w-full"
                >
                  {isReplying ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Sending Reply...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <MessageCircle className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesEditor;
