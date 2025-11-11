import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatWindow, CompactChatWindow } from "@/components/ChatWindow";
import { LogOut, User, Mail, Phone, MapPin, Calendar, Utensils, Package, History, Bell, Edit, Users, ChefHat, MessageSquare, BarChart3, Star, MessageCircle, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { EditProfileModal } from "@/components/EditProfileModal";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { conversations, activeConversation, setActiveConversation, createConversation, unreadCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handle tab state from navigation
  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      // Clear the state to prevent it from persisting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">Tài khoản</h1>
          <div className="max-w-md mx-auto bg-card rounded-lg border p-6 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để quản lý tài khoản</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Đăng nhập ngay
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleStartChat = () => {
    if (user) {
      // Create conversation with admin (user ID '1')
      const conversationId = createConversation([user.id, '1']);
      setActiveConversation(conversationId);
      setActiveTab("chat");
    }
  };

  return (
    <Layout>
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Quản lý tài khoản</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Hỗ trợ trực tuyến
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              {user?.role === 'admin' && (
                <TabsTrigger value="admin">
                  <ChefHat className="w-4 h-4 mr-2" />
                  Quản trị
                </TabsTrigger>
              )}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              {/* User Info Card */}
              <div className="bg-card rounded-lg border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground capitalize">
                    {user.role === 'customer' ? 'Khách hàng' :
                     user.role === 'admin' ? 'Quản trị viên' : user.role}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleEditProfile}>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                  <p className="font-medium">{user.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                  <p className="font-medium">{user.address || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Thành viên từ</p>
                  <p className="font-medium">{user.createdAt.toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
  
            {/* Review Statistics - Only for customers */}
            {user.role === 'customer' && (
              <div className="bg-card rounded-lg border p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Thống kê đánh giá</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Tổng đơn</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm text-muted-foreground">Đã đánh giá</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm text-muted-foreground">Chưa đánh giá</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ đánh giá</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions - Role Based */}
          {user.role === 'customer' ? (
            /* Customer View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/orders")}
              >
                <Utensils className="w-6 h-6" />
                <span>Đơn hàng</span>
                <span className="text-sm text-muted-foreground">Lịch sử đặt mâm</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/delivery")}
              >
                <Package className="w-6 h-6" />
                <span>Đang giao</span>
                <span className="text-sm text-muted-foreground">0 đơn hàng</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/history")}
              >
                <History className="w-6 h-6" />
                <span>Lịch sử</span>
                <span className="text-sm text-muted-foreground">Xem đã đặt</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="w-6 h-6" />
                <span>Thông báo</span>
                <span className="text-sm text-muted-foreground">Cập nhật đơn</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/history")}
              >
                <Star className="w-6 h-6" />
                <span>Đánh giá</span>
                <span className="text-sm text-muted-foreground">Xem & đánh giá</span>
              </Button>
            </div>
          ) : (
            /* Admin View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="w-6 h-6" />
                <span>Quản lý người dùng</span>
                <span className="text-sm text-muted-foreground">Quản lý khách hàng</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/admin/orders")}
              >
                <Package className="w-6 h-6" />
                <span>Quản lý đơn hàng</span>
                <span className="text-sm text-muted-foreground">Xem & xử lý đơn</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/admin/menu")}
              >
                <Utensils className="w-6 h-6" />
                <span>Quản lý món ăn</span>
                <span className="text-sm text-muted-foreground">Quản lý thực đơn</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/admin/combos")}
              >
                <ChefHat className="w-6 h-6" />
                <span>Quản lý combo</span>
                <span className="text-sm text-muted-foreground">Quản lý gói cỗ</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/admin/messages")}
              >
                <MessageSquare className="w-6 h-6" />
                <span>Tin nhắn & Hỗ trợ</span>
                <span className="text-sm text-muted-foreground">Quản lý tin nhắn</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => navigate("/admin/reports")}
              >
                <BarChart3 className="w-6 h-6" />
                <span>Báo cáo & Thống kê</span>
                <span className="text-sm text-muted-foreground">Xem báo cáo</span>
              </Button>
            </div>
          )}

              {/* Logout Section */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Tài khoản</h3>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Cuộc trò chuyện</span>
                      <Button size="sm" onClick={handleStartChat}>
                        <Plus className="w-4 h-4 mr-1" />
                        Mới
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {conversations.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                          <p>Chưa có cuộc trò chuyện nào</p>
                          <Button variant="link" onClick={handleStartChat}>
                            Bắt đầu trò chuyện
                          </Button>
                        </div>
                      ) : (
                        conversations.map((conversation) => (
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

                {/* Chat Window */}
                <div className="lg:col-span-2">
                  {activeConversation ? (
                    <ChatWindow
                      conversation={activeConversation}
                      onClose={() => setActiveConversation(null)}
                    />
                  ) : (
                    <Card className="h-[500px] flex items-center justify-center">
                      <CardContent className="text-center">
                        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Chào mừng đến với hỗ trợ trực tuyến</h3>
                        <p className="text-muted-foreground mb-4">
                          Chọn một cuộc trò chuyện hoặc bắt đầu cuộc trò chuyện mới để nhận hỗ trợ
                        </p>
                        <Button onClick={handleStartChat}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Bắt đầu trò chuyện
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Admin Tab */}
            {user?.role === 'admin' && (
              <TabsContent value="admin">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => navigate("/admin/users")}
                  >
                    <Users className="w-6 h-6" />
                    <span>Quản lý người dùng</span>
                    <span className="text-sm text-muted-foreground">Quản lý khách hàng</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => navigate("/admin/orders")}
                  >
                    <Package className="w-6 h-6" />
                    <span>Quản lý đơn hàng</span>
                    <span className="text-sm text-muted-foreground">Xem & xử lý đơn</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => navigate("/admin/menu")}
                  >
                    <Utensils className="w-6 h-6" />
                    <span>Quản lý món ăn</span>
                    <span className="text-sm text-muted-foreground">Quản lý thực đơn</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => navigate("/admin/combos")}
                  >
                    <ChefHat className="w-6 h-6" />
                    <span>Quản lý combo</span>
                    <span className="text-sm text-muted-foreground">Quản lý gói cỗ</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => navigate("/admin/messages")}
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>Tin nhắn & Hỗ trợ</span>
                    <span className="text-sm text-muted-foreground">Quản lý tin nhắn</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                    onClick={() => navigate("/admin/reports")}
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>Báo cáo & Thống kê</span>
                    <span className="text-sm text-muted-foreground">Xem báo cáo</span>
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;