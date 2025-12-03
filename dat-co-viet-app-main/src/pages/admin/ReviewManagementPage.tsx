import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  dishName?: string;
}

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
    
    return matchesSearch;
  });

  // Reset current page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredReviews.length);
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
          
          {/* Status filter removed */}
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
                  <th className="text-left py-3 px-4">Tên món</th>
                  <th className="text-left py-3 px-4">Đánh giá</th>
                  <th className="text-left py-3 px-4">Ngày tạo</th>
                  <th className="text-right py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      {searchTerm
                        ? 'Không tìm thấy đánh giá nào phù hợp'
                        : 'Chưa có đánh giá nào từ khách hàng'}
                    </td>
                  </tr>
                ) : (
                  paginatedReviews.map((review) => (
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
                        <div className="font-medium">{review.dishName || 'Không xác định'}</div>
                      </td>
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
              Hiển thị {filteredReviews.length === 0 ? 0 : startIndex + 1}-{endIndex} trên {filteredReviews.length} đánh giá
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ReviewManagementPage;