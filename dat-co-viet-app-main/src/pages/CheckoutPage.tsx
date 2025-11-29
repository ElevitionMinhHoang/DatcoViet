import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Phone, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ordersAPI, paymentsAPI } from "@/services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { cartItems, totalPrice, clearCart, addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const shipping = 20000;
  const total = totalPrice + shipping;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đặt hàng.",
        variant: "destructive"
      });
      return;
    }

    // Check if user is admin
    if (user?.role === 'admin') {
      toast({
        title: "Không thể đặt hàng",
        description: "Tài khoản admin không thể đặt hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin khách hàng.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Cart items:', cartItems);
      console.log('Cart items IDs:', cartItems.map(item => ({ id: item.item.id, type: typeof item.item.id })));
      
      // Validate cart items before creating order - all active menu IDs from database (10-41)
      const validMenuIds = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
      
      console.log('Valid menu IDs:', validMenuIds);
      
      // Filter out invalid items
      const validCartItems = cartItems.filter(item => {
        const menuId = Number(item.item.id);
        const isValid = validMenuIds.includes(menuId);
        console.log(`Checking item: ${item.item.name} (ID: ${item.item.id}, Number: ${menuId}), Valid: ${isValid}`);
        if (!isValid) {
          console.log(`Removing invalid cart item: ${item.item.name} (ID: ${item.item.id})`);
        }
        return isValid;
      });

      console.log('Valid cart items after filtering:', validCartItems);
      console.log('Valid cart items count:', validCartItems.length);

      if (validCartItems.length === 0) {
        console.log('All cart items are invalid. Cart items:', cartItems);
        throw new Error('Giỏ hàng không có món ăn hợp lệ. Vui lòng thêm món ăn từ thực đơn và thử lại.');
      }

      if (validCartItems.length !== cartItems.length) {
        console.log(`Cleaned cart: removed ${cartItems.length - validCartItems.length} invalid items`);
        // Update cart with only valid items
        clearCart();
        validCartItems.forEach(item => {
          addToCart(item.item, item.quantity);
        });
        
        toast({
          title: "Đã làm sạch giỏ hàng",
          description: `${cartItems.length - validCartItems.length} món ăn không hợp lệ đã được xóa khỏi giỏ hàng.`,
          variant: "default"
        });
      }
      
      // Create order
      const orderData = {
        items: validCartItems.map(item => ({
          menuId: Number(item.item.id),
          quantity: item.quantity
        }))
      };

      console.log('Order data to send:', orderData);
      const order = await ordersAPI.createOrder(orderData);
      
      // Create payment
      const paymentData = {
        orderId: order.id,
        method: paymentMethod,
        amount: total
      };

      const payment = await paymentsAPI.createPayment(paymentData);

      // Clear cart
      clearCart();

      toast({
        title: "Đặt hàng thành công",
        description: `Đơn hàng #${order.id} của bạn đã được xác nhận. Trạng thái thanh toán: ${payment.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}`,
      });

      // Navigate to order confirmation page
      navigate('/orders');
    } catch (error: any) {
      console.error('Order placement failed:', error);
      console.log('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast({
        title: "Đặt hàng thất bại",
        description: error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };


  return (
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
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ và tên"
                      className="mt-1"
                      value={customerInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      className="mt-1"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ giao hàng"
                      className="mt-1"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Ghi chú đặc biệt</Label>
                    <Input
                      id="notes"
                      placeholder="Ví dụ: Hướng dẫn đường đi, thời gian giao hàng..."
                      className="mt-1"
                      value={customerInfo.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
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
                  <div
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent ${
                      paymentMethod === 'COD' ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'COD' ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}></div>
                    <span>Thanh toán khi nhận hàng (COD)</span>
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
                    {cartItems.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.item.name}</span>
                          <span>{formatPrice(item.item.price * item.quantity)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>Số lượng: x{item.quantity}</span>
                          <span>{formatPrice(item.item.price)}/phần</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí giao hàng:</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={user?.role === 'admin' || isLoading || cartItems.length === 0}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isLoading ? 'Đang xử lý...' : user?.role === 'admin' ? 'Không thể đặt hàng' : 'Đặt hàng ngay'}
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
  );
}