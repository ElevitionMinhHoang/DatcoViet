import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { CartProvider } from "@/contexts/CartContext";
import { DebugRouter } from "@/components/DebugRouter";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import SetDetailPage from "./pages/SetDetailPage";
import DishDetailPage from "./pages/DishDetailPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SpecialSetsPage from "./pages/SpecialSetsPage";
import IndividualDishesPage from "./pages/IndividualDishesPage";
import DrinksPage from "./pages/DrinksPage";
import OrdersPage from "./pages/OrdersPage";
import DeliveryPage from "./pages/DeliveryPage";
import HistoryPage from "./pages/HistoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import MenuManagementPage from "./pages/admin/MenuManagementPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import ComboManagementPage from "./pages/admin/ComboManagementPage";
import MessagesManagementPage from "./pages/admin/MessagesManagementPage";
import ReviewManagementPage from "./pages/admin/ReviewManagementPage";
import ReportsPage from "./pages/admin/ReportsPage";
import { MenuDemo } from "./components/layout/MenuDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <DebugRouter />
              <Routes>
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/auth" element={<AuthPage />} />
            <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
            <Route path="/menu/sets/:id" element={<ProtectedRoute><SetDetailPage /></ProtectedRoute>} />
            <Route path="/menu/dishes/:id" element={<ProtectedRoute><DishDetailPage /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/special-sets" element={<ProtectedRoute><SpecialSetsPage /></ProtectedRoute>} />
            <Route path="/individual-dishes" element={<ProtectedRoute><IndividualDishesPage /></ProtectedRoute>} />
            <Route path="/drinks" element={<ProtectedRoute><DrinksPage /></ProtectedRoute>} />
            {/* Order management routes */}
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/delivery" element={<ProtectedRoute><DeliveryPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            {/* Admin routes */}
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><UsersManagementPage /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><OrderManagementPage /></ProtectedRoute>} />
            <Route path="/admin/menu" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><MenuManagementPage /></ProtectedRoute>} />
            <Route path="/admin/combos" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><ComboManagementPage /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><MessagesManagementPage /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><ReviewManagementPage /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/"><ReportsPage /></ProtectedRoute>} />
            {/* Demo route for testing mega menu */}
            <Route path="/menu-demo" element={<MenuDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ChatProvider>
    </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
