import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handlePlaceOrder = () => {
    // Check if user is admin
    if (user?.role === 'admin') {
      toast({
        title: "Không thể đặt hàng",
        description: "Tài khoản admin không thể đặt hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.",
        variant: "destructive"
      });
      return;
    }
    
    // Proceed with order placement logic
    toast({
      title: "Đặt hàng thành công",
      description: "Đơn hàng của bạn đã được xác nhận và đang được xử lý.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-6">Thanh Toán</h1>
        
        {user?.role === 'admin' && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Tài khoản admin không thể đặt hàng</p>
            <p className="text-sm">Vui lòng đăng nhập bằng tài khoản khách hàng để thực hiện đặt hàng.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin khách hàng
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="Nhập họ và tên" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Địa chỉ giao hàng</Label>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ giao hàng"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Ghi chú đặc biệt</Label>
                    <Input 
                      id="notes" 
                      placeholder="Ví dụ: Hướng dẫn đường đi, thời gian giao hàng..." 
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Phương thức thanh toán
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="w-4 h-4 rounded-full border-2 border-primary"></div>
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                    <span>Chuyển khoản ngân hàng</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground"></div>
                    <span>Ví điện tử (Momo, VNPay)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Mâm cỗ gia đình 4 người</span>
                      <span>{formatPrice(1200000)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Số lượng: x1</span>
                      <span>{formatPrice(1200000)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(1200000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí giao hàng:</span>
                      <span>{formatPrice(50000)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(1250000)}</span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={user?.role === 'admin'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {user?.role === 'admin' ? 'Không thể đặt hàng' : 'Đặt hàng ngay'}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Bằng cách đặt hàng, bạn đồng ý với điều khoản và điều kiện của chúng tôi
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