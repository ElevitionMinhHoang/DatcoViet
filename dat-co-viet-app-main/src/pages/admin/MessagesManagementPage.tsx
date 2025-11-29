import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Search, Filter, Mail, User, Clock, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow, CompactChatWindow } from "@/components/ChatWindow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const MessagesManagementPage = () => {
  const { conversations, activeConversation, setActiveConversation, unreadCount } = useChat();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter conversations based on active tab and search term
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participants.some(p =>
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesTab = activeTab === "all" ||
      (activeTab === "active" && conv.status === "active") ||
      (activeTab === "unread" && conv.unreadCount > 0) ||
      (activeTab === "resolved" && conv.status === "resolved");

    return matchesSearch && matchesTab;
  });

  const activeConversations = conversations.filter(conv => conv.status === "active");
  const unreadConversations = conversations.filter(conv => conv.unreadCount > 0);

  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tin nhắn & Hỗ trợ khách hàng</h1>
            <p className="text-muted-foreground mt-1">Quản lý và trả lời tin nhắn từ khách hàng</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            {unreadCount} tin nhắn mới
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{conversations.length}</div>
                  <div className="text-sm text-muted-foreground">Tổng số</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{unreadConversations.length}</div>
                  <div className="text-sm text-muted-foreground">Chưa đọc</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bộ lọc</CardTitle>
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
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                    <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                  </TabsList>
                  <div className="mt-2 space-y-1">
                    <Button
                      variant={activeTab === "all" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("all")}
                    >
                      Tất cả ({conversations.length})
                    </Button>
                    <Button
                      variant={activeTab === "active" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("active")}
                    >
                      Đang hoạt động ({activeConversations.length})
                    </Button>
                    <Button
                      variant={activeTab === "unread" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("unread")}
                    >
                      Chưa đọc ({unreadConversations.length})
                    </Button>
                    <Button
                      variant={activeTab === "resolved" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("resolved")}
                    >
                      Đã giải quyết
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {filteredConversations.length === 0 ? (
              <Card className="h-[600px] flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không có cuộc trò chuyện</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Không tìm thấy kết quả phù hợp" : "Chưa có cuộc trò chuyện nào"}
                  </p>
                </CardContent>
              </Card>
            ) : activeConversation ? (
              <ChatWindow
                conversation={activeConversation}
                onClose={() => setActiveConversation(null)}
                className="h-[600px]"
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Cuộc trò chuyện</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredConversations.map((conversation) => (
                      <CompactChatWindow
                        key={conversation.id}
                        conversation={conversation}
                        onSelect={() => setActiveConversation(conversation.id)}
                        isActive={false}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  );
};

export default MessagesManagementPage;