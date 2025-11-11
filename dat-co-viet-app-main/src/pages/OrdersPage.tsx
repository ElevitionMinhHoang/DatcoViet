import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Package, Clock, CheckCircle, XCircle, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orders, reviews } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import ReviewModal from "@/components/ReviewModal";

const OrdersPage = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Filter orders for current user
  const userOrders = orders.filter(order => order.customerId === user?.id);
  const completedOrders = userOrders.filter(order => order.status === 'completed');

  const hasReviewedOrder = (orderId: string) => {
    return reviews.some(review => review.orderId === orderId && review.customerId === user?.id);
  };

  const handleOpenReview = (order: any) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = (reviewData: { rating: number; comment: string }) => {
    // In a real app, this would submit to an API
    console.log("Submitting review for order:", selectedOrder.id, reviewData);
    // Add the review to the mock data
    const newReview = {
      id: `review-${Date.now()}`,
      orderId: selectedOrder.id,
      customerId: user?.id || '',
      customerName: user?.name || '',
      rating: reviewData.rating,
      comment: reviewData.comment,
      images: [],
      status: 'pending',
      createdAt: new Date(),
    };
    console.log("New review created:", newReview);
    
    // Close modal and reset
    setIsReviewModalOpen(false);
    setSelectedOrder(null);
  };

  if (!user) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

          {userOrders.length === 0 ? (
            <div className="bg-card rounded-lg border p-6">
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng</h2>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa có đơn hàng nào. Hãy đặt mâm cỗ để bắt đầu!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Completed Orders with Review Option */}
              {completedOrders.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Đơn hàng đã hoàn thành</h2>
                  <div className="space-y-4">
                    {completedOrders.map((order) => {
                      const hasReview = hasReviewedOrder(order.id);
                      return (
                        <div key={order.id} className="bg-card rounded-lg border p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ngày đặt: {order.createdAt.toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Đã hoàn thành
                              </span>
                              {hasReview && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Đã đánh giá
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">Món đã đặt:</h4>
                              <ul className="text-sm space-y-1">
                                {order.items.map((item, index) => (
                                  <li key={index}>
                                    {item.quantity}x {item.item.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Thông tin giao hàng:</h4>
                              <p className="text-sm">{order.deliveryAddress}</p>
                              <p className="text-sm text-muted-foreground">
                                Ngày giao: {order.deliveryDate.toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">
                              Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Xem chi tiết
                              </Button>
                              {!hasReview && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleOpenReview(order)}
                                >
                                  <Star className="w-4 h-4 mr-2" />
                                  Đánh giá
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Orders */}
              {userOrders.filter(order => order.status !== 'completed').length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Đơn hàng khác</h2>
                  <div className="space-y-4">
                    {userOrders
                      .filter(order => order.status !== 'completed')
                      .map((order) => (
                        <div key={order.id} className="bg-card rounded-lg border p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Ngày đặt: {order.createdAt.toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              {order.status === 'pending' && 'Chờ xác nhận'}
                              {order.status === 'confirmed' && 'Đã xác nhận'}
                              {order.status === 'preparing' && 'Đang chuẩn bị'}
                              {order.status === 'delivering' && 'Đang giao hàng'}
                            </span>
                          </div>
                          <div className="text-lg font-semibold">
                            Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
    </Layout>
  );
};

export default OrdersPage;