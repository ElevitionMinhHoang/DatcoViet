import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export function Layout({ children, showHeader = true }: LayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  const handleSettingsClick = () => {
    if (user) {
      navigate('/settings');
    } else {
      navigate('/auth');
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header
          onMenuClick={handleMenuClick}
          onProfileClick={handleProfileClick}
          onCartClick={handleCartClick}
          onSettingsClick={handleSettingsClick}
        />
      )}
      
      {isMobileMenuOpen && <MobileNav />}

      <main className={`${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
}