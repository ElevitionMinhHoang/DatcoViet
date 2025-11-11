import { NavLink } from "react-router-dom";
import { Home, Utensils, Info, Phone, ChefHat, Salad, GlassWater, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MobileNav() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/", icon: Home, label: "Trang chủ" },
    {
      to: "/special-sets",
      icon: ChefHat,
      label: "Mâm cỗ đặc biệt",
      description: "Các mâm cỗ được thiết kế sẵn"
    },
    {
      to: "/individual-dishes",
      icon: Salad,
      label: "Món ăn lẻ",
      description: "Lựa chọn từng món ăn riêng lẻ"
    },
    {
      to: "/drinks",
      icon: GlassWater,
      label: "Đồ uống",
      description: "Các loại đồ uống đa dạng"
    },
    { to: "/about", icon: Info, label: "Giới thiệu" },
    { to: "/contact", icon: Phone, label: "Liên hệ" },
  ];

  return (
    <div className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-sm text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </div>
            </NavLink>
          ))}

          {isLoggedIn && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <User className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">Hồ sơ</div>
                  <div className="text-sm text-muted-foreground">
                    Thông tin tài khoản
                  </div>
                </div>
              </NavLink>

              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-md p-3 text-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium">Đăng xuất</div>
                  <div className="text-sm text-muted-foreground">
                    Thoát khỏi tài khoản
                  </div>
                </div>
              </Button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}