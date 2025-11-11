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
import { feastSets, reviews } from "@/data/mockData";
import { FeastSet, Review } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function SetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  const { addToCart } = useCart();
  const [feastSet, setFeastSet] = useState<FeastSet | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [feastSetReviews, setFeastSetReviews] = useState<Review[]>([]);

  useEffect(() => {
    const found = feastSets.find(set => set.id === id);
    if (found) {
      setFeastSet(found);
      // Filter reviews for this feast set (in a real app, this would be API call)
      const feastSetReviews = reviews.filter(review =>
        review.comment.toLowerCase().includes(found.name.toLowerCase())
      );
      setFeastSetReviews(feastSetReviews);
    }
  }, [id]);

  if (!feastSet) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy mâm cỗ</h1>
            <Button onClick={() => navigate('/menu')}>
              Quay về thực đơn
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
    if (feastSet) {
      addToCart(feastSet, quantity);
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${feastSet.name} (x${quantity}) đã được thêm vào giỏ hàng`,
      });
    }
  };

  const handleOrderNow = () => {
    if (!isLoggedIn) {
      navigate("/auth");
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đặt mâm cỗ",
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

  const totalPrice = feastSet.price * quantity;


  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/menu')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay về thực đơn
        </Button>

        {/* Hero Image */}
        <div className="relative mb-6 rounded-lg overflow-hidden">
          <img
            src={feastSet.image}
            alt={feastSet.name}
            className="w-full h-64 md:h-80 object-cover"
          />
          {feastSet.isPopular && (
            <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
              Phổ biến
            </Badge>
          )}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/90 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="font-medium">{feastSet.rating}</span>
            <span className="text-muted-foreground">({feastSet.reviewCount} đánh giá)</span>
          </div>
        </div>

        {/* Main Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {feastSet.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {feastSet.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{feastSet.servings} người</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>2-3 giờ chuẩn bị</span>
              </div>
              <Badge variant="outline">{feastSet.category}</Badge>
            </div>

            <div className="text-center md:text-left">
              <div className="text-3xl font-bold text-primary mb-1">
                {formatPrice(feastSet.price)}
              </div>
              <div className="text-muted-foreground">
                {formatPrice(feastSet.price / feastSet.servings)} / người
              </div>
            </div>

            {/* Dishes in Set */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Món ăn trong mâm</h3>
              <div className="space-y-3">
                {feastSet.dishes.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.dish.image}
                          alt={item.dish.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.dish.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.dish.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">x{item.quantity}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.dish.price)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection
              reviews={feastSetReviews}
              title="Đánh giá từ khách hàng"
              emptyMessage="Chưa có đánh giá nào cho mâm cỗ này"
            />
          </div>

          {/* Order Section */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Đặt mâm cỗ</h3>
                
                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="text-base font-medium">
                      Số lượng mâm
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
                    <p className="text-sm text-muted-foreground mt-1">
                      Phục vụ cho {feastSet.servings * quantity} người
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-base font-medium">
                      Ghi chú đặc biệt (tùy chọn)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Ví dụ: Món chay, giảm mặn, không cay..."
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
                      <span>{formatPrice(feastSet.price)}</span>
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
                    Liên hệ trước 24 giờ để đảm bảo chất lượng tốt nhất
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