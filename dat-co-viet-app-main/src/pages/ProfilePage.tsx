import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User, Mail, Phone, MapPin, Calendar, Utensils, Package, History, Bell, Edit, Users, ChefHat, BarChart3, Star, ShoppingBag, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { EditProfileModal } from "@/components/EditProfileModal";
import ReviewForm from "@/components/ReviewForm";
import api from "@/services/api";
import { ordersAPI, feedbackAPI } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<any>(null);
  const [reviewingOrder, setReviewingOrder] = useState<number | null>(null);
  const [orderFeedbacks, setOrderFeedbacks] = useState<Record<number, any>>({});
  const { toast } = useToast();

  // Handle tab state from navigation
  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      // Clear the state to prevent it from persisting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch order history when history or order-status tab is active
  useEffect(() => {
    if ((activeTab === 'history' || activeTab === 'order-status') && user) {
      fetchOrderHistory();
    }
  }, [activeTab, user]);

  const fetchOrderHistory = async () => {
    try {
      setLoadingHistory(true);
      const orders = await api.orders.getMyOrders();
      setOrderHistory(orders);
      
      // Fetch feedbacks for completed orders
      const completedOrders = orders.filter(order => order.status === 'COMPLETED');
      
      if (completedOrders.length > 0) {
        const feedbacksMap: Record<number, any> = {};
        
        // Fetch feedback for each completed order
        for (const order of completedOrders) {
          try {
            const feedback = await feedbackAPI.getFeedbackByOrder(order.id.toString());
            feedbacksMap[order.id] = feedback;
          } catch (error) {
            // If no feedback exists for this order, continue
            console.log(`No feedback found for order ${order.id}`);
          }
        }
        
        setOrderFeedbacks(feedbacksMap);
      }
    } catch (error) {
      console.error('Failed to fetch order history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Filter orders for different tabs
  const completedOrders = orderHistory.filter(order => order.status === 'COMPLETED');
 const activeOrders = orderHistory.filter(order =>
  order.status !== 'COMPLETED'
);



  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  if (!user) {
    return (
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
    );
  }


  const handleCancelOrder = (order: any) => {
    setOrderToCancel(order);
    setCancelConfirmOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      setCancellingOrder(orderToCancel.id);
      await ordersAPI.cancelOrder(orderToCancel.id);
      
      toast({
        title: "Hủy đơn hàng thành công",
        description: `Đơn hàng #${orderToCancel.id} đã được hủy.`,
      });

      // Refresh order history
      fetchOrderHistory();
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Không thể hủy đơn hàng';
        if (errorMessage.includes('PENDING')) {
          toast({
            title: "Không thể hủy đơn hàng",
            description: "😔 Rất tiếc! Đơn hàng của bạn đã được chuyển sang giai đoạn chuẩn bị, giai đoạn giao hàng,... nên hiện tại không thể hủy. Nếu cần hỗ trợ thêm, vui lòng liên hệ hotline!",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Không thể hủy đơn hàng",
            description: errorMessage,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Lỗi hủy đơn hàng",
          description: "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.",
          variant: "destructive"
        });
      }
    } finally {
      setCancellingOrder(null);
      setCancelConfirmOpen(false);
      setOrderToCancel(null);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PREPARING': return 'Đang chuẩn bị';
      case 'DELIVERING': return 'Đang giao hàng';
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const handleReviewOrder = (order: any) => {
    setReviewingOrder(order.id);
  };

  const handleReviewSuccess = () => {
    setReviewingOrder(null);
    fetchOrderHistory(); // Refresh to show the new review
  };

  const handleReviewCancel = () => {
    setReviewingOrder(null);
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-purple-100 text-purple-800';
      case 'DELIVERING': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Quản lý tài khoản</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="flex justify-center w-full max-w-2xl mx-auto px-4">
              <TabsTrigger value="profile">
                <User className="w-4 h-4 mr-2" />
                Thông tin cá nhân
              </TabsTrigger>
              <TabsTrigger value="order-status">
                <Clock className="w-4 h-4 mr-2" />
                Trạng thái đơn hàng
              </TabsTrigger>
              <TabsTrigger value="history">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Lịch sử mua hàng
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
                  <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
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
          ) : null}

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

            {/* Order History Tab */}
            <TabsContent value="history">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">Lịch sử mua hàng</h2>
                
                {loadingHistory ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Đang tải lịch sử mua hàng...</div>
                  </div>
                ) : completedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng hoàn thành</h3>
                    <p className="text-muted-foreground mb-6">
                      Bạn chưa có đơn hàng nào đã hoàn thành. Hãy đặt món ngay để trải nghiệm dịch vụ của chúng tôi!
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Đặt món ngay
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-lg">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(order.total)}
                              </div>
                              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'PREPARING' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {order.status === 'COMPLETED' ? 'Hoàn thành' :
                                 order.status === 'CANCELLED' ? 'Đã hủy' :
                                 order.status === 'PENDING' ? 'Chờ xác nhận' :
                                 order.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                 order.status === 'PREPARING' ? 'Đang chuẩn bị' :
                                 'Đang giao hàng'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <h4 className="font-medium mb-2">Sản phẩm đã đặt:</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                  <div>
                                    <span className="font-medium">{item.menu?.name || 'Món ăn'}</span>
                                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format(item.price * item.quantity)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review Section - Show review info or write review button */}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-medium mb-1">Đánh giá đơn hàng</h4>
                                {orderFeedbacks[order.id] ? (
                                  <div className="flex items-center gap-2">
                                    {renderStars(orderFeedbacks[order.id].rating)}
                                    <p className="text-sm text-muted-foreground">
                                      Đã đánh giá vào {new Date(orderFeedbacks[order.id].createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    Hãy chia sẻ trải nghiệm của bạn về đơn hàng này
                                  </p>
                                )}
                              </div>
                              {!orderFeedbacks[order.id] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReviewOrder(order)}
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Viết đánh giá
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Order Status Tab */}
            <TabsContent value="order-status">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">Trạng thái đơn hàng</h2>
                
                {loadingHistory ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-lg">Đang tải đơn hàng...</div>
                  </div>
                ) : activeOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không có đơn hàng đang hoạt động</h3>
                    <p className="text-muted-foreground mb-6">
                      Bạn không có đơn hàng nào đang chờ xử lý. Hãy đặt món ngay để trải nghiệm dịch vụ của chúng tôi!
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Đặt món ngay
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(order.total)}
                            </div>
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Sản phẩm đã đặt:</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <div>
                                  <span className="font-medium">{item.menu?.name || 'Món ăn'}</span>
                                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                  }).format(item.price * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cancel Button - Only show for PENDING orders */}
                        {order.status === 'PENDING' && (
                          <div className="border-t pt-3 mt-3">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order)}
                              disabled={cancellingOrder === order.id}
                            >
                              {cancellingOrder === order.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>


          </Tabs>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #{orderToCancel?.id}?
              <br />
              <span className="text-red-500 font-medium">
                Hành động này không thể hoàn tác.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelConfirmOpen(false)}
              disabled={cancellingOrder !== null}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelOrder}
              disabled={cancellingOrder !== null}
            >
              {cancellingOrder !== null ? 'Đang hủy...' : 'Xác nhận hủy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Form Dialog */}
      <Dialog open={reviewingOrder !== null} onOpenChange={(open) => !open && setReviewingOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đánh giá đơn hàng</DialogTitle>
            <DialogDescription>
              Chia sẻ trải nghiệm của bạn về đơn hàng #{reviewingOrder}
            </DialogDescription>
          </DialogHeader>
          {reviewingOrder && (
            <ReviewForm
              orderId={reviewingOrder}
              onSuccess={handleReviewSuccess}
              onCancel={handleReviewCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;