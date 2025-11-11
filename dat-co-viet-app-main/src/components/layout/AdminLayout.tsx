import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Utensils,
  ChefHat,
  MessageSquare,
  BarChart3,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
      icon: Users,
      description: "Quản lý tài khoản khách hàng"
    },
    {
      title: "Quản lý đơn hàng",
      href: "/admin/orders",
      icon: Package,
      description: "Xem và xử lý đơn hàng"
    },
    {
      title: "Quản lý món ăn",
      href: "/admin/menu",
      icon: Utensils,
      description: "Quản lý thực đơn món ăn"
    },
    {
      title: "Quản lý combo",
      href: "/admin/combos",
      icon: ChefHat,
      description: "Quản lý gói cỗ và combo"
    },
    {
      title: "Tin nhắn & Hỗ trợ",
      href: "/admin/messages",
      icon: MessageSquare,
      description: "Quản lý tin nhắn khách hàng"
    },
    {
      title: "Quản lý đánh giá",
      href: "/admin/reviews",
      icon: Star,
      description: "Quản lý đánh giá từ khách hàng"
    },
    {
      title: "Báo cáo & Thống kê",
      href: "/admin/reports",
      icon: BarChart3,
      description: "Báo cáo doanh thu và thống kê"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center gap-2">
              <img
                src="/images/Logo.png"
                alt="Hoa Nắng Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-primary">Admin Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary",
                    isActive
                      ? "bg-primary/20 text-primary border-r-2 border-primary"
                      : "text-muted-foreground"
                  )
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">Quản trị viên</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Messages Notification */}
              <Button variant="ghost" size="icon" className="relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;