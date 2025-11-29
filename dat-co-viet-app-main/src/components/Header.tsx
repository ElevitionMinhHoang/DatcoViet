import { ShoppingCart, User, Menu, LogOut, Settings, MessageSquare } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DesktopNav } from "./layout/DesktopNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
  onCartClick: () => void;
  onSettingsClick: () => void;
  isAdminRoute?: boolean;
}

export function Header({ onMenuClick, onProfileClick, onCartClick, onSettingsClick, isAdminRoute = false }: HeaderProps) {
  const { user, logout, isLoggedIn } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Menu Button & Logo */}
          <div className="flex items-center gap-3">
            {!isAdminRoute && (
              <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <NavLink to="/" className="flex items-center gap-2">
              <img
                src="/images/Logo.png"
                alt="Hoa Nắng Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-lg text-primary hidden sm:block">
                Hoa Nắng
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          {!isAdminRoute && (
            <div className="hidden md:flex">
              <DesktopNav />
            </div>
          )}

          {/* Search Bar */}
          {!isAdminRoute && (
            <div className="flex-1 max-w-md hidden md:flex">
              <SearchBar variant="compact" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isAdminRoute && (
              <>
                <Button variant="ghost" size="icon" onClick={onCartClick}>
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                
                {isLoggedIn && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    onClick={() => navigate("/profile", { state: { tab: "chat" } })}
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                )}
              </>
            )}
            
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="w-5 h-5" />
                    {user && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      {user?.role && (
                        <p className="text-xs text-primary font-medium">
                          {user.role === 'admin' ? 'Quản trị viên' :
                           user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {!isAdminRoute && (
                    <>
                      <DropdownMenuItem onClick={onProfileClick}>
                        <User className="w-4 h-4 mr-2" />
                        <span>Hồ sơ</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/profile", { state: { tab: "chat" } })}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span>Tin nhắn</span>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {unreadCount}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onSettingsClick}>
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Cài đặt</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={onProfileClick}>
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}