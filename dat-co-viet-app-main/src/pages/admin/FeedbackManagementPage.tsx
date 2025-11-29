import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react";
import { feedbackAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Feedback {
  id: number;
  orderId: number;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackManagementPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const data = await feedbackAPI.getAllFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Failed to load feedbacks:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đánh giá",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await feedbackAPI.approveFeedback(id);
      toast({
        title: "Thành công",
        description: "Đánh giá đã được phê duyệt",
      });
      loadFeedbacks();
    } catch (error) {
      console.error('Failed to approve feedback:', error);
      toast({
        title: "Lỗi",
        description: "Không thể phê duyệt đánh giá",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await feedbackAPI.rejectFeedback(id);
      toast({
        title: "Thành công",
        description: "Đánh giá đã bị từ chối",
      });
      loadFeedbacks();
    } catch (error) {
      console.error('Failed to reject feedback:', error);
      toast({
        title: "Lỗi",
        description: "Không thể từ chối đánh giá",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <MessageSquare className="w-8 h-8" />
          Quản lý đánh giá
        </h1>
        <p className="text-muted-foreground">
          Quản lý và phê duyệt đánh giá từ khách hàng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả đánh giá ({feedbacks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {feedbacks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Bình luận</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">#{feedback.id}</TableCell>
                    <TableCell>Đơn hàng #{feedback.orderId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">
                          {feedback.comment || "Không có bình luận"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={feedback.isApproved ? "default" : "secondary"}
                        className={
                          feedback.isApproved
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }
                      >
                        {feedback.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!feedback.isApproved && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(feedback.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(feedback.id)}
                              className="text-red-500 border-red-500 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Chưa có đánh giá nào
              </h3>
              <p className="text-muted-foreground">
                Các đánh giá từ khách hàng sẽ xuất hiện ở đây
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}