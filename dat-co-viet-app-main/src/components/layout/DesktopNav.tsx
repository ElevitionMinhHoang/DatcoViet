import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Home,
  Utensils,
  Info,
  Phone,
  ChefHat,
  GlassWater,
  Salad,
  Settings,
  Users,
  Package,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = {
  "Thực đơn": [
    {
      title: "Mâm cỗ đặc biệt",
      href: "/special-sets",
      description: "Các mâm cỗ được thiết kế sẵn, phù hợp cho các dịp lễ, tết, hội họp.",
      icon: ChefHat,
    },
    {
      title: "Món ăn lẻ",
      href: "/individual-dishes",
      description: "Lựa chọn từng món ăn riêng lẻ để tự tạo mâm cỗ theo ý thích.",
      icon: Salad,
    },
    {
      title: "Đồ uống",
      href: "/drinks",
      description: "Các loại đồ uống đa dạng từ truyền thống đến hiện đại.",
      icon: GlassWater,
    },
  ],
};

export function DesktopNav() {
  const { user } = useAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink
            to="/"
            className={cn(navigationMenuTriggerStyle(), "navigation-menu-trigger")}
          >
            Trang chủ
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="navigation-menu-trigger">
            Thực đơn
          </NavigationMenuTrigger>
          <NavigationMenuContent className="navigation-menu-content">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {menuItems["Thực đơn"].map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  icon={component.icon}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/about"
            className={cn(navigationMenuTriggerStyle(), "navigation-menu-trigger")}
          >
            Giới thiệu
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/contact"
            className={cn(navigationMenuTriggerStyle(), "navigation-menu-trigger")}
          >
            Liên hệ
          </NavLink>
        </NavigationMenuItem>
        
        {/* Admin Navigation - Only show for admin users */}
        {user?.role === 'admin' && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="navigation-menu-trigger">
              Quản trị
            </NavigationMenuTrigger>
            <NavigationMenuContent className="navigation-menu-content">
              <ul className="grid w-[300px] gap-3 p-4">
                <ListItem
                  title="Quản lý người dùng"
                  href="/admin/users"
                  icon={Users}
                >
                  Quản lý thông tin khách hàng và nhân viên
                </ListItem>
                <ListItem
                  title="Quản lý đơn hàng"
                  href="/admin/orders"
                  icon={Package}
                >
                  Xem và xử lý các đơn hàng
                </ListItem>
                <ListItem
                  title="Quản lý món ăn"
                  href="/admin/menu"
                  icon={Utensils}
                >
                  Quản lý thực đơn và món ăn
                </ListItem>
                <ListItem
                  title="Báo cáo & Thống kê"
                  href="/admin/reports"
                  icon={BarChart3}
                >
                  Xem báo cáo doanh thu và thống kê
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    icon?: React.ComponentType<{ className?: string }>;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors menu-item-hover",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ml-6">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";