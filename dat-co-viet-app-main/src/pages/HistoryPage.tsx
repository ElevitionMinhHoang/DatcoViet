import { Layout } from "@/components/layout/Layout";
import { History, CheckCircle, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orders, reviews } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const HistoryPage = () => {
  const { user } = useAuth();

  // Filter completed orders for current user
  const userOrders = orders.filter(order =>
    order.customerId === user?.id && order.status === 'completed'
  );

  const hasReviewedOrder = (orderId: string) => {
    return reviews.some(review => review.orderId === orderId && review.customerId === user?.id);
  };

  const getReviewForOrder = (orderId: string) => {
    return reviews.find(review => review.orderId === orderId && review.customerId === user?.id);
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>
            <div className="bg-card rounded-lg border p-6 text-center">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
              <p className="text-muted-foreground">
                Bạn cần đăng nhập để xem lịch sử đơn hàng
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
          <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>

          {userOrders.length === 0 ? (
            <div className="bg-card rounded-lg border p-6">
              <div className="text-center py-8">
                <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Chưa có lịch sử đơn hàng</h2>
                <p className="text-muted-foreground">
                  Lịch sử đơn hàng của bạn sẽ xuất hiện ở đây sau khi bạn đặt mâm cỗ.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Đơn hàng đã hoàn thành</h2>
                  <div className="text-sm text-muted-foreground">
                    Tổng: {userOrders.length} đơn hàng
                  </div>
                </div>

                <div className="space-y-4">
                  {userOrders.map((order) => {
                    const hasReview = hasReviewedOrder(order.id);
                    const review = getReviewForOrder(order.id);

                    return (
                      <div key={order.id} className="border rounded-lg p-4">
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
                            <h4 className="font-medium mb-2">Thông tin:</h4>
                            <p className="text-sm">
                              Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Ngày giao: {order.deliveryDate.toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>

                        {/* Review Section */}
                        {hasReview && review && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              Đánh giá của bạn
                            </h4>
                            <div className="bg-muted/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.createdAt.toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                              <p className="text-sm">{review.comment}</p>
                              {review.status === 'pending' && (
                                <p className="text-xs text-yellow-600 mt-2">
                                  ⏳ Đánh giá đang chờ duyệt
                                </p>
                              )}
                              {review.status === 'approved' && (
                                <p className="text-xs text-green-600 mt-2">
                                  ✅ Đánh giá đã được duyệt
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Thống kê đơn hàng</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {userOrders.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Tổng đơn</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userOrders.filter(order => hasReviewedOrder(order.id)).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Đã đánh giá</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {userOrders.filter(order => !hasReviewedOrder(order.id)).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Chưa đánh giá</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {Math.round((userOrders.filter(order => hasReviewedOrder(order.id)).length / userOrders.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Tỷ lệ đánh giá</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;