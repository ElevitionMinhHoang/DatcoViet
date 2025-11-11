import AdminLayout from "@/components/layout/AdminLayout";
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { reviews } from "@/data/mockData";
import { useState } from "react";

const ReviewManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleApprove = (reviewId: string) => {
    // In a real app, this would update the review status via API
    console.log("Approve review:", reviewId);
    alert(`Đã duyệt đánh giá ${reviewId}`);
  };

  const handleReject = (reviewId: string) => {
    // In a real app, this would update the review status via API
    console.log("Reject review:", reviewId);
    alert(`Đã từ chối đánh giá ${reviewId}`);
  };

  const handleViewOrder = (orderId: string) => {
    // In a real app, this would navigate to order details
    console.log("View order:", orderId);
    alert(`Xem chi tiết đơn hàng ${orderId}`);
  };

  return (
    <AdminLayout title="Quản lý đánh giá">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý đánh giá</h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm đánh giá..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <Button 
              variant={statusFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              Tất cả ({reviews.length})
            </Button>
            <Button 
              variant={statusFilter === "pending" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Chờ duyệt ({reviews.filter(r => r.status === 'pending').length})
            </Button>
            <Button 
              variant={statusFilter === "approved" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("approved")}
            >
              Đã duyệt ({reviews.filter(r => r.status === 'approved').length})
            </Button>
            <Button 
              variant={statusFilter === "rejected" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("rejected")}
            >
              Đã từ chối ({reviews.filter(r => r.status === 'rejected').length})
            </Button>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-card rounded-lg border p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Mã đánh giá</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Đơn hàng</th>
                  <th className="text-left py-3 px-4">Đánh giá</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Ngày tạo</th>
                  <th className="text-right py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="border-b">
                    <td className="py-3 px-4 font-mono">#{review.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{review.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {Array.from({ length: review.rating })
                            .map((_, i) => '⭐')
                            .join('')}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">#{review.orderId}</td>
                    <td className="py-3 px-4">
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{review.comment}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(review.status)}
                    </td>
                    <td className="py-3 px-4">
                      {review.createdAt.toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(review.orderId)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {review.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleApprove(review.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReject(review.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {review.status === 'approved' && review.adminResponse && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => alert(`Phản hồi: ${review.adminResponse}`)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không có đánh giá nào</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
                  : 'Chưa có đánh giá nào từ khách hàng'}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredReviews.length} trên {reviews.length} đánh giá
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Trước</Button>
              <Button variant="outline" size="sm">Sau</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewManagementPage;