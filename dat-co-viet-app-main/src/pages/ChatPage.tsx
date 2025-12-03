import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Search, Plus, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatWindow, CompactChatWindow } from "@/components/ChatWindow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { conversations, activeConversation, setActiveConversation, createConversation, unreadCount } = useChat();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleStartNewChat = () => {
    if (user) {
      // Create a conversation with admin
      const conversationId = createConversation([user.id, 'admin']);
      setActiveConversation(conversationId);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Hỗ trợ trực tuyến</h2>
            <p className="text-muted-foreground mb-6">
              Vui lòng đăng nhập để sử dụng tính năng chat với nhân viên hỗ trợ
            </p>
            <Button onClick={() => navigate('/auth')}>
              Đăng nhập ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hỗ trợ trực tuyến</h1>
          <p className="text-muted-foreground mt-1">
            Chat trực tiếp với nhân viên hỗ trợ của chúng tôi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1 space-y-6">

          {/* Search and Actions - Only show for admin users */}
          {(user.role === 'admin' || user.role === 'ADMIN' || user.role === 'CSKH' || user.role === 'MANAGER' || user.role === 'staff') && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cuộc trò chuyện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleStartNewChat}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Bắt đầu trò chuyện mới
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Conversations List */}
          <Card>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? "Không tìm thấy kết quả phù hợp" : "Chưa có cuộc trò chuyện nào"}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <CompactChatWindow
                      key={conversation.id}
                      conversation={conversation}
                      onSelect={() => setActiveConversation(conversation.id)}
                      isActive={activeConversation?.id === conversation.id}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              onClose={() => setActiveConversation(null)}
              className="h-[600px]"
            />
          ) : (
            <Card className="h-[600px] flex flex-col items-center justify-center text-center">
              <CardContent className="p-8">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chào mừng đến với hỗ trợ trực tuyến</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Chúng tôi ở đây để giúp bạn! Hãy chọn cuộc trò chuyện với "Hỗ trợ Hoa nắng"
                  từ danh sách bên trái để bắt đầu.
                </p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Đội ngũ hỗ trợ 24/7</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Phản hồi nhanh chóng</span>
                  </div>
                </div>
                {(user.role === 'admin' || user.role === 'ADMIN' || user.role === 'CSKH' || user.role === 'MANAGER' || user.role === 'staff') && (
                  <Button
                    className="mt-6"
                    onClick={handleStartNewChat}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Bắt đầu trò chuyện mới
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;