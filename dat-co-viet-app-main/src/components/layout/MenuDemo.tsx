import { useState } from "react";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { Header } from "../Header";

export function MenuDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={handleMenuClick}
        onProfileClick={handleProfileClick}
        onCartClick={handleCartClick}
        onSettingsClick={handleSettingsClick}
      />
      
      {isMobileMenuOpen && <MobileNav />}

      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Demo Mega Menu - Hoa Nắng
          </h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Desktop Navigation</h2>
              <p className="text-muted-foreground mb-4">
                Menu lớn với nhiều cấp, hiển thị trên màn hình desktop
              </p>
              <div className="border p-4 rounded-md">
                <DesktopNav />
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Mobile Navigation</h2>
              <p className="text-muted-foreground mb-4">
                Menu di động đơn giản, hiển thị trên thiết bị di động
              </p>
              <div className="border p-4 rounded-md">
                <MobileNav />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Hướng dẫn sử dụng</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Trên desktop: Di chuột vào "Thực đơn" để xem mega menu</li>
              <li>Trên mobile: Nhấn nút menu để mở navigation</li>
              <li>Các mục menu có submenu sẽ hiển thị mũi tên ›</li>
              <li>Di chuột vào các mục có submenu để xem thêm tùy chọn</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}