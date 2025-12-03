import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, MessageSquare, Shield, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoReviewReminders, setAutoReviewReminders] = useState(true);
  const [showPublicReviews, setShowPublicReviews] = useState(true);
  const [receiveAdminFeedback, setReceiveAdminFeedback] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);
  const [saveOrderHistory, setSaveOrderHistory] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (!user) return;
    const key = `user_preferences_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setNotificationsEnabled(preferences.notificationsEnabled ?? true);
        setEmailNotifications(preferences.emailNotifications ?? true);
        setAutoReviewReminders(preferences.autoReviewReminders ?? true);
        setShowPublicReviews(preferences.showPublicReviews ?? true);
        setReceiveAdminFeedback(preferences.receiveAdminFeedback ?? true);
        setShowOnlineStatus(preferences.showOnlineStatus ?? true);
        setAllowDirectMessages(preferences.allowDirectMessages ?? true);
        setSaveOrderHistory(preferences.saveOrderHistory ?? true);
      } catch (e) {
        console.error('Failed to parse saved preferences', e);
      }
    }
  }, [user]);

  // Save preferences whenever any of them changes
  useEffect(() => {
    if (!user) return;
    const key = `user_preferences_${user.id}`;
    const preferences = {
      notificationsEnabled,
      emailNotifications,
      autoReviewReminders,
      showPublicReviews,
      receiveAdminFeedback,
      showOnlineStatus,
      allowDirectMessages,
      saveOrderHistory,
    };
    localStorage.setItem(key, JSON.stringify(preferences));
  }, [
    user,
    notificationsEnabled,
    emailNotifications,
    autoReviewReminders,
    showPublicReviews,
    receiveAdminFeedback,
    showOnlineStatus,
    allowDirectMessages,
    saveOrderHistory,
  ]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Cài đặt</h1>
          <div className="bg-card rounded-lg border p-6 text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-muted-foreground">
              Bạn cần đăng nhập để truy cập cài đặt tài khoản
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cài đặt</h1>

          {/* Notification Settings */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Thông báo
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">
                    Bật thông báo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo về đơn hàng và khuyến mãi
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              {notificationsEnabled && (
                <>
                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-base flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Thông báo qua email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Gửi thông báo đến {user.email}
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                </>
              )}
            </div>
          </div>

          {/* Review Settings */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Đánh giá & Nhận xét
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Tự động nhắc đánh giá
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi nhắc nhở đánh giá sau khi đơn hàng hoàn thành
                  </p>
                </div>
                <Switch
                  checked={autoReviewReminders}
                  onCheckedChange={setAutoReviewReminders}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Hiển thị đánh giá công khai
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép hiển thị đánh giá của bạn trên trang web
                  </p>
                </div>
                <Switch
                  checked={showPublicReviews}
                  onCheckedChange={setShowPublicReviews}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Nhận phản hồi từ quản trị viên
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo khi admin phản hồi đánh giá của bạn
                  </p>
                </div>
                <Switch
                  checked={receiveAdminFeedback}
                  onCheckedChange={setReceiveAdminFeedback}
                />
              </div>
            </div>
          </div>


          {/* Privacy & Security */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Bảo mật & Quyền riêng tư
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Hiển thị trạng thái trực tuyến
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người khác thấy khi bạn online
                  </p>
                </div>
                <Switch
                  checked={showOnlineStatus}
                  onCheckedChange={setShowOnlineStatus}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Cho phép nhắn tin trực tiếp
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép nhân viên hỗ trợ nhắn tin với bạn
                  </p>
                </div>
                <Switch
                  checked={allowDirectMessages}
                  onCheckedChange={setAllowDirectMessages}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Lưu lịch sử đơn hàng
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động lưu lịch sử đơn hàng đã hoàn thành
                  </p>
                </div>
                <Switch
                  checked={saveOrderHistory}
                  onCheckedChange={setSaveOrderHistory}
                />
              </div>
            </div>
          </div>

      </div>
    </div>
  );
};

export default SettingsPage;