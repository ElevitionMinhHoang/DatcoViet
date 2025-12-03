import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { feedbackAPI } from "@/services/api";

interface ReviewFormProps {
  orderId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReviewForm = ({ orderId, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Vui lòng đánh giá",
        description: "Bạn cần chọn số sao để đánh giá.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await feedbackAPI.createFeedback({
        orderId: orderId.toString(),
        rating,
        comment,
        images: [],
      });

      toast({
        title: "Đánh giá thành công",
        description: "Cảm ơn bạn đã đánh giá đơn hàng!",
      });

      // Emit custom event to notify other components (e.g., homepage) that a review was submitted
      window.dispatchEvent(new CustomEvent('reviewSubmitted'));

      onSuccess();
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Lỗi đánh giá",
        description: error.message || "Có lỗi xảy ra khi gửi đánh giá.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Đánh giá đơn hàng #{orderId}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Đánh giá sao *
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {rating === 0
              ? "Chọn số sao để đánh giá"
              : rating === 1
              ? "Rất không hài lòng"
              : rating === 2
              ? "Không hài lòng"
              : rating === 3
              ? "Bình thường"
              : rating === 4
              ? "Hài lòng"
              : "Rất hài lòng"}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Bình luận
          </label>
          <Textarea
            id="comment"
            placeholder="Chia sẻ trải nghiệm của bạn về món ăn và dịch vụ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>


        {/* Submit Button */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;