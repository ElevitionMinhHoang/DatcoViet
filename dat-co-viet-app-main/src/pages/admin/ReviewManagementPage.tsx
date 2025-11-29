import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from '@/services/api';

interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  images?: string[];
  status: string;
  createdAt: Date;
  approvedAt?: Date;
}

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await api.feedback.getFeedback();
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case 'REJECTED':
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

  const handleApprove = async (reviewId: string) => {
    try {
      // TODO: Add approve API endpoint
      // await api.feedback.approveFeedback(reviewId);
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId ? { ...review, status: 'APPROVED' } : review
        )
      );
      alert(`Đã duyệt đánh giá ${reviewId}`);
    } catch (error) {
      console.error('Failed to approve review:', error);
      alert('Có lỗi xảy ra khi duyệt đánh giá');
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      // TODO: Add reject API endpoint
      // await api.feedback.rejectFeedback(reviewId);
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId ? { ...review, status: 'REJECTED' } : review
        )
      );
      alert(`Đã từ chối đánh giá ${reviewId}`);
    } catch (error) {
      console.error('Failed to reject review:', error);
      alert('Có lỗi xảy ra khi từ chối đánh giá');
    }
  };

  const handleViewOrder = (orderId: string) => {
    // In a real app, this would navigate to order details
    console.log("View order:", orderId);
    alert(`Xem chi tiết đơn hàng ${orderId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý đánh giá</h1>
          <div className="text-sm text-muted-foreground">
            Tổng cộng: {reviews.length} đánh giá
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm đánh giá theo tên khách hàng, nội dung hoặc mã đơn hàng..."
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
              variant={statusFilter === "PENDING" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("PENDING")}
            >
              Chờ duyệt ({reviews.filter(r => r.status === 'PENDING').length})
            </Button>
            <Button 
              variant={statusFilter === "APPROVED" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("APPROVED")}
            >
              Đã duyệt ({reviews.filter(r => r.status === 'APPROVED').length})
            </Button>
            <Button 
              variant={statusFilter === "REJECTED" ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter("REJECTED")}
            >
              Đã từ chối ({reviews.filter(r => r.status === 'REJECTED').length})
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
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Không tìm thấy đánh giá nào phù hợp' 
                        : 'Chưa có đánh giá nào từ khách hàng'}
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono">#{review.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{review.customerName}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">#{review.orderId}</td>
                      <td className="py-3 px-4">
                        <div className="max-w-xs">
                          <p className="text-sm line-clamp-2">{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {review.images.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              ))}
                              {review.images.length > 3 && (
                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs">
                                  +{review.images.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(review.status)}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(review.createdAt)}
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
                          {review.status === 'PENDING' && (
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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
  );
};

export default ReviewManagementPage;