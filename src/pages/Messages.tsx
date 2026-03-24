import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send } from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as any]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const checkAuthAndLoad = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setCurrentUserId(user.id);
    await loadConversations(user.id);
  };

  const loadConversations = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        *,
        participant_1:profiles!conversations_participant_1_id_fkey(full_name),
        participant_2:profiles!conversations_participant_2_id_fkey(full_name)
      `)
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Failed to load conversations");
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*, sender:profiles(full_name)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load messages");
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const { error } = await supabase
      .from("messages")
      .insert({
        conversation_id: selectedConversation.id,
        sender_id: currentUserId,
        message_text: newMessage.trim(),
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
      loadMessages(selectedConversation.id);
    }
  };

  const selectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const getOtherParticipantName = (conversation: any) => {
    if (conversation.participant_1_id === currentUserId) {
      return conversation.participant_2?.full_name || "Unknown";
    }
    return conversation.participant_1?.full_name || "Unknown";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            <span className="bg-gradient-hero bg-clip-text text-transparent">Messages</span>
          </h1>

          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {conversations.length === 0 ? (
                    <p className="text-center text-muted-foreground p-4">No conversations yet</p>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => selectConversation(conv)}
                        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedConversation?.id === conv.id ? "bg-muted" : ""
                        }`}
                      >
                        <p className="font-semibold">{getOtherParticipantName(conv)}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.pet_type && `About ${conv.pet_type}`}
                        </p>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedConversation ? getOtherParticipantName(selectedConversation) : "Select a conversation"}
                </CardTitle>
                {selectedConversation && (
                  <CardDescription>
                    {selectedConversation.pet_type && `Discussion about ${selectedConversation.pet_type}`}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  {selectedConversation ? (
                    messages.length === 0 ? (
                      <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                msg.sender_id === currentUserId
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{msg.message_text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <p className="text-center text-muted-foreground">Select a conversation to view messages</p>
                  )}
                </ScrollArea>

                {selectedConversation && (
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
