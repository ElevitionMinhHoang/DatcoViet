import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ReviewModal from "@/components/ReviewModal";
import { ordersAPI } from "@/services/api";

const OrdersPage = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user) {
        try {
          const orders = await ordersAPI.getMyOrders();
          setUserOrders(orders);
        } catch (error) {
          console.error('Failed to fetch user orders:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  const completedOrders = userOrders.filter(order => order.status === 'COMPLETED');
  const pendingOrders = userOrders.filter(order => order.status === 'PENDING');
  const confirmedOrders = userOrders.filter(order => order.status === 'CONFIRMED');
  const cancelledOrders = userOrders.filter(order => order.status === 'CANCELLED');

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenReview = (order: any) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (reviewData: { rating: number; comment: string }) => {
    // In a real app, this would submit to an API
    console.log("Submitting review for order:", selectedOrder.id, reviewData);
    
    // Close modal and reset
    setIsReviewModalOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>
          <div className="bg-card rounded-lg border p-6 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>
          <div className="bg-card rounded-lg border p-6 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-muted-foreground">
              Bạn cần đăng nhập để xem đơn hàng của mình
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

          {userOrders.length === 0 ? (
            <div className="bg-card rounded-lg border p-6">
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng</h2>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có đơn hàng nào. Hãy đặt món ăn để bắt đầu!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Completed Orders */}
              {completedOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Đơn hàng đã hoàn thành</h2>
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                      <div key={order.id} className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-medium mb-2">Món đã đặt:</h4>
                            <ul className="text-sm space-y-1">
                              {order.items.map((item: any, index: number) => (
                                <li key={index}>
                                  {item.quantity}x {item.menu?.name || `Món #${item.menuId}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Thông tin:</h4>
                            <p className="text-sm">Tổng tiền: {order.total.toLocaleString('vi-VN')}đ</p>
                            <p className="text-sm text-muted-foreground">
                              Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold">
                            Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirmed Orders */}
              {confirmedOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Đơn hàng đã xác nhận</h2>
                  <div className="space-y-4">
                    {confirmedOrders.map((order) => (
                      <div key={order.id} className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-lg font-semibold">
                          Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Orders */}
              {pendingOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Đơn hàng chờ xác nhận</h2>
                  <div className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-lg font-semibold">
                          Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Orders */}
              {cancelledOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Đơn hàng đã hủy</h2>
                  <div className="space-y-4">
                    {cancelledOrders.map((order) => (
                      <div key={order.id} className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-lg font-semibold">
                          Tổng tiền: {order.total.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedOrder(null);
        }}
        orderId={selectedOrder?.id || ''}
        orderItems={selectedOrder?.items || []}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default OrdersPage;