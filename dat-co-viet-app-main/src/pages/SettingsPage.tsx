import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, MessageSquare, Shield, Globe, Moon, Sun, Mail, Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("vi");

  if (!user) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  const handleSaveChanges = () => {
    // In a real app, you'd send this data to an API
    console.log({
      notificationsEnabled,
      emailNotifications,
      smsNotifications,
      darkMode,
      language,
    });
    toast({
      title: "Đã lưu cài đặt",
      description: "Các thay đổi của bạn đã được lưu thành công.",
    });
  };

  return (
    <Layout>
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

                  <div className="flex items-center justify-between pl-6">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications" className="text-base flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Thông báo qua SMS
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Gửi tin nhắn đến {user.phone || 'số điện thoại của bạn'}
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              {darkMode ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              Giao diện
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Chế độ tối
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Chuyển đổi giữa chế độ sáng và tối
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Ngôn ngữ
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Chọn ngôn ngữ hiển thị
                  </p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Hành động</h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Xuất dữ liệu cá nhân
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Xóa tài khoản
              </Button>
              <Button className="w-full" onClick={handleSaveChanges}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;