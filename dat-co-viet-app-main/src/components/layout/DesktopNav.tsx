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
  BarChart3,
  LayoutDashboard,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";


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
          <NavLink
            to="/menu"
            className={cn(navigationMenuTriggerStyle(), "navigation-menu-trigger")}
          >
            Thực đơn
          </NavLink>
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
        
        {/* Chat Navigation - Only show for logged in users */}
        {user && (
          <NavigationMenuItem>
            <NavLink
              to="/chat"
              className={cn(navigationMenuTriggerStyle(), "navigation-menu-trigger")}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Hỗ trợ
            </NavLink>
          </NavigationMenuItem>
        )}
        
        {/* Admin Navigation - Only show for admin users */}
        {user?.role === 'ADMIN' && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="navigation-menu-trigger">
              Quản trị
            </NavigationMenuTrigger>
            <NavigationMenuContent className="navigation-menu-content">
              <ul className="grid w-[300px] gap-3 p-4">
                <ListItem
                  title="Dashboard"
                  to="/admin"
                  icon={LayoutDashboard}
                >
                  Tổng quan hệ thống và thống kê
                </ListItem>
                <ListItem
                  title="Quản lý người dùng"
                  to="/admin/users"
                  icon={Users}
                >
                  Quản lý thông tin khách hàng và nhân viên
                </ListItem>
                <ListItem
                  title="Quản lý đơn hàng"
                  to="/admin/orders"
                  icon={Package}
                >
                  Xem và xử lý các đơn hàng
                </ListItem>
                <ListItem
                  title="Quản lý món ăn"
                  to="/admin/menu"
                  icon={Utensils}
                >
                  Quản lý thực đơn và món ăn
                </ListItem>
                <ListItem
                  title="Báo cáo & Thống kê"
                  to="/admin/reports"
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
  React.ElementRef<typeof NavLink>,
  React.ComponentPropsWithoutRef<typeof NavLink> & {
    icon?: React.ComponentType<{ className?: string }>;
    title?: string;
  }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <NavLink
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors menu-item-hover",
            className
          )}
          {...props}
        >
          {({ isActive, isPending, isTransitioning }) => (
            <>
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-primary" />}
                <div className="text-sm font-medium leading-none">{title}</div>
              </div>
              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ml-6">
                {typeof children === 'function' ? children({ isActive, isPending, isTransitioning }) : children}
              </p>
            </>
          )}
        </NavLink>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";