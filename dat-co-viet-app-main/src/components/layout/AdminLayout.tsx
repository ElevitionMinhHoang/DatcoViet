import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Package, ChefHat, MessageSquare, Star, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Force close any mobile overlays when entering admin layout
  useEffect(() => {
    // This ensures any mobile menu overlays are closed when admin layout mounts
    const body = document.body;
    body.style.overflow = 'auto';
    body.style.position = 'static';
    
    // Remove any potential overlay classes - more comprehensive approach
    const overlaySelectors = [
      '.fixed.inset-0.z-40',
      '.fixed.inset-0.z-50',
      '[data-overlay="true"]',
      '.backdrop-blur-sm',
      '[class*="bg-black"]'
    ];
    
    overlaySelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
          el.remove();
        }
      });
    });

    // Also remove any event listeners that might be keeping overlays open
    const cleanupOverlays = () => {
      const overlays = document.querySelectorAll('.fixed.inset-0');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement &&
            (overlay.classList.contains('backdrop-blur-sm') ||
             overlay.style.backgroundColor === 'rgba(0, 0, 0, 0.5)')) {
          overlay.remove();
        }
      });
    };

    // Run cleanup immediately and after a short delay
    cleanupOverlays();
    setTimeout(cleanupOverlays, 100);
  }, []);

  const adminMenuItems = [
    {
      name: "Quản lý người dùng",
      path: "/admin/users",
      icon: Users,
      description: "Quản lý tài khoản người dùng"
    },
    {
      name: "Quản lý đơn hàng",
      path: "/admin/orders",
      icon: Package,
      description: "Xem và xử lý đơn hàng"
    },
    {
      name: "Quản lý thực đơn",
      path: "/admin/menu",
      icon: ChefHat,
      description: "Quản lý món ăn và mâm cỗ"
    },
    {
      name: "Quản lý tin nhắn",
      path: "/admin/messages",
      icon: MessageSquare,
      description: "Quản lý tin nhắn liên hệ"
    },
    {
      name: "Quản lý đánh giá",
      path: "/admin/feedback",
      icon: Star,
      description: "Quản lý đánh giá từ khách hàng"
    },
    {
      name: "Báo cáo & Thống kê",
      path: "/admin/reports",
      icon: BarChart3,
      description: "Xem báo cáo và thống kê"
    }
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Đã đăng xuất",
      description: "Bạn đã đăng xuất khỏi hệ thống quản trị",
    });
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Admin Header - No user navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hoa Nắng - Quản trị</h1>
                <p className="text-sm text-gray-500">Chào mừng quản trị viên</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        {isSidebarOpen && (
          <aside className="w-64 bg-white shadow-sm border-r min-h-[calc(100vh-80px)]">
            <nav className="p-4 space-y-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isSidebarOpen ? '' : 'ml-0'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}