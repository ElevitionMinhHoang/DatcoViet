import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, X, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderItems: any[];
  onSubmit: (review: { rating: number; comment: string; images?: string[] }) => void;
}

const ReviewModal = ({ isOpen, onClose, orderId, orderItems, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Vui lòng chọn đánh giá",
        description: "Bạn cần chọn số sao để đánh giá đơn hàng",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Nhận xét quá ngắn",
        description: "Vui lòng viết nhận xét ít nhất 10 ký tự",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      rating,
      comment: comment.trim(),
    });

    // Reset form
    setRating(0);
    setComment("");
    onClose();
    
    toast({
      title: "Đánh giá thành công",
      description: "Cảm ơn bạn đã đánh giá đơn hàng!",
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={starValue}
          type="button"
          className="p-1"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            className={`w-8 h-8 ${
              starValue <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Đánh giá đơn hàng #{orderId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <h4 className="font-semibold mb-2">Món đã đặt:</h4>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{item.quantity}x {item.item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="text-center">
            <h4 className="font-semibold mb-4">Bạn hài lòng thế nào với đơn hàng?</h4>
            <div className="flex justify-center mb-2">{renderStars()}</div>
            <p className="text-sm text-muted-foreground">
              {rating === 0 ? "Chọn số sao để đánh giá" : `${rating} sao`}
            </p>
          </div>

          {/* Comment */}
          <div>
            <h4 className="font-semibold mb-2">Nhận xét của bạn:</h4>
            <Textarea
              placeholder="Chia sẻ trải nghiệm của bạn về món ăn, dịch vụ giao hàng..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 ký tự
            </p>
          </div>

          {/* Image Upload (Placeholder for future implementation) */}
          <div>
            <h4 className="font-semibold mb-2">Hình ảnh (tùy chọn):</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Tính năng tải ảnh sẽ được cập nhật sớm
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={rating === 0 || comment.trim().length < 10}
            >
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;