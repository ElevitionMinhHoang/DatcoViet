import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  const shipping = 20000; // Example shipping cost
  const total = totalPrice + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Giỏ hàng của bạn đang trống.</p>
            <Button asChild>
              <Link to="/menu">Bắt đầu mua sắm</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cartItems.map((cartItem) => (
                  <div key={cartItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={cartItem.item.image || "/placeholder.svg"}
                        alt={cartItem.item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{cartItem.item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cartItem.item.price?.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={cartItem.quantity}
                          className="w-16 text-center"
                          readOnly
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(cartItem.id)}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-muted/40 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{shipping.toLocaleString("vi-VN")}₫</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>
              <Button asChild className="w-full mt-6">
                <Link to="/checkout">Tiến hành thanh toán</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
  );
};

export default CartPage;
