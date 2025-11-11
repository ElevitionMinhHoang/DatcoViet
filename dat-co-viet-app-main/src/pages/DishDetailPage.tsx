import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Users, Clock, Plus, Minus, ShoppingCart } from "lucide-react";
import ReviewsSection from "@/components/ReviewsSection";
import { dishes, reviews } from "@/data/mockData";
import { Dish, Review } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DishDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const [dish, setDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [dishReviews, setDishReviews] = useState<Review[]>([]);

  useEffect(() => {
    const found = dishes.find(d => d.id === id);
    if (found) {
      setDish(found);
      // Filter reviews for this dish (in a real app, this would be API call)
      const dishReviews = reviews.filter(review => 
        review.comment.toLowerCase().includes(found.name.toLowerCase())
      );
      setDishReviews(dishReviews);
    }
  }, [id]);

  if (!dish) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy món ăn</h1>
            <Button onClick={() => navigate('/individual-dishes')}>
              Quay về món ăn lẻ
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 20) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${dish.name} (x${quantity}) đã được thêm vào giỏ hàng`,
    });
  };

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đặt món ăn",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user is admin - admin cannot place orders
    if (user?.role === 'admin') {
      toast({
        title: "Không thể đặt hàng",
        description: "Tài khoản quản trị viên không thể đặt hàng. Vui lòng sử dụng tài khoản khách hàng.",
        variant: "destructive"
      });
      return;
    }
    
    // Redirect to checkout page for logged in users
    navigate("/checkout");
    toast({
      title: "Chuyển đến trang thanh toán",
      description: "Bạn đang được chuyển đến trang thanh toán",
    });
  };

  const totalPrice = dish.price * quantity;


  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/individual-dishes')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay về món ăn lẻ
        </Button>

        {/* Hero Image */}
        <div className="relative mb-6 rounded-lg overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/90 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="font-medium">4.5</span>
            <span className="text-muted-foreground">({dishReviews.length} đánh giá)</span>
          </div>
        </div>

        {/* Main Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {dish.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {dish.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{dish.preparationTime} phút chuẩn bị</span>
              </div>
              <Badge variant="outline">{dish.category}</Badge>
              {dish.isVegetarian && (
                <Badge className="bg-green-500 text-white">Chay</Badge>
              )}
              {dish.isSpicy && (
                <Badge className="bg-red-500 text-white">Cay</Badge>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Thành phần</h3>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients?.map((ingredient, index) => (
                  <Badge key={index} variant="secondary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {dish.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection
              reviews={dishReviews}
              title="Đánh giá từ khách hàng"
              emptyMessage="Chưa có đánh giá nào cho món ăn này"
            />
          </div>

          {/* Order Section */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Đặt món ăn</h3>
                
                <div className="space-y-4">
                  {/* Price Display */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatPrice(dish.price)}
                    </div>
                    <div className="text-muted-foreground">
                      / {dish.unit}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="text-base font-medium">
                      Số lượng
                    </Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= 20) setQuantity(val);
                        }}
                        className="text-center w-20"
                        min="1"
                        max="20"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 20}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base font-medium">
                      Ghi chú đặc biệt (tùy chọn)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Ví dụ: Giảm mặn, không cay, thêm rau..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Đơn giá:</span>
                      <span>{formatPrice(dish.price)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Số lượng:</span>
                      <span>x{quantity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-primary">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      onClick={handleOrderNow}
                    >
                      Đặt ngay
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Thêm vào giỏ
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Liên hệ trước 2 giờ để đảm bảo chất lượng tốt nhất
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}