import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { CartProvider } from "@/contexts/CartContext";
import { DebugRouter } from "@/components/DebugRouter";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import SearchResultsPage from "./pages/SearchResultsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import OperatingRegulationsPage from "./pages/OperatingRegulationsPage";
import ComplaintResolutionPage from "./pages/ComplaintResolutionPage";
import MenuManagementPage from "./pages/admin/MenuManagementPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import ComboManagementPage from "./pages/admin/ComboManagementPage";
import MessagesManagementPage from "./pages/admin/MessagesManagementPage";
import ReviewManagementPage from "./pages/admin/ReviewManagementPage";
import FeedbackManagementPage from "./pages/admin/FeedbackManagementPage";
import ReportsPage from "./pages/admin/ReportsPage";
import { MenuDemo } from "./components/layout/MenuDemo";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
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
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/auth" element={<AuthPage />} />
              <Route path="/menu" element={<ProtectedRoute><Layout><MenuPage /></Layout></ProtectedRoute>} />
              <Route path="/menu/sets/:id" element={<ProtectedRoute><Layout><SetDetailPage /></Layout></ProtectedRoute>} />
              <Route path="/menu/dishes/:id" element={<ProtectedRoute><Layout><DishDetailPage /></Layout></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><Layout><AboutPage /></Layout></ProtectedRoute>} />
              <Route path="/contact" element={<ProtectedRoute><Layout><ContactPage /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Layout><CartPage /></Layout></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />
              <Route path="/special-sets" element={<ProtectedRoute><Layout><SpecialSetsPage /></Layout></ProtectedRoute>} />
              <Route path="/individual-dishes" element={<ProtectedRoute><Layout><IndividualDishesPage /></Layout></ProtectedRoute>} />
              <Route path="/drinks" element={<ProtectedRoute><Layout><DrinksPage /></Layout></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Layout><SearchResultsPage /></Layout></ProtectedRoute>} />
              {/* Order management routes */}
              <Route path="/orders" element={<ProtectedRoute><Layout><OrdersPage /></Layout></ProtectedRoute>} />
              <Route path="/delivery" element={<ProtectedRoute><Layout><DeliveryPage /></Layout></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><Layout><HistoryPage /></Layout></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
              {/* Policy pages */}
              <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
              <Route path="/terms-and-conditions" element={<Layout><TermsAndConditionsPage /></Layout>} />
              <Route path="/operating-regulations" element={<Layout><OperatingRegulationsPage /></Layout>} />
              <Route path="/complaint-resolution" element={<Layout><ComplaintResolutionPage /></Layout>} />
              {/* Admin routes - Redirect /admin to /admin/users and use AdminLayout only (no Layout wrapper) */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><Navigate to="/admin/users" replace /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><UsersManagementPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><OrderManagementPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/menu" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><MenuManagementPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/combos" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><ComboManagementPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><MessagesManagementPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><FeedbackManagementPage /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/"><AdminLayout><ReportsPage /></AdminLayout></ProtectedRoute>} />
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
  </ErrorBoundary>
);

export default App;
