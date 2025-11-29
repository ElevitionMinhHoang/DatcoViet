import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  isAdminRoute?: boolean;
}

export function Layout({ children, showHeader = true, showBottomNav = false, isAdminRoute = false }: LayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset mobile menu state when route changes - ALWAYS reset for admin routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Force close mobile menu when entering admin routes - more aggressive approach
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setIsMobileMenuOpen(false);
      // Force cleanup of any remaining overlays
      const overlays = document.querySelectorAll('.fixed.inset-0.z-40, .fixed.inset-0.z-50');
      overlays.forEach(overlay => {
        if (overlay instanceof HTMLElement) {
          overlay.remove();
        }
      });
    }
  }, [location.pathname]);

  // Prevent mobile menu from opening on admin routes
  const handleMenuClick = () => {
    if (isAdminRoute || location.pathname.startsWith('/admin')) return;
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

  // Don't render MobileNav at all on admin routes
  const shouldShowMobileNav = isMobileMenuOpen && !isAdminRoute && !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header
          onMenuClick={handleMenuClick}
          onProfileClick={handleProfileClick}
          onCartClick={handleCartClick}
          onSettingsClick={handleSettingsClick}
          isAdminRoute={isAdminRoute || location.pathname.startsWith('/admin')}
        />
      )}
      
      {/* Only show MobileNav on non-admin routes */}
      {shouldShowMobileNav && <MobileNav onClose={() => setIsMobileMenuOpen(false)} />}

      <main className={`${showHeader ? 'pt-16' : ''} ${showBottomNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      
      {/* Footer - Only show on non-admin routes */}
      {!isAdminRoute && !location.pathname.startsWith('/admin') && <Footer />}
    </div>
  );
}