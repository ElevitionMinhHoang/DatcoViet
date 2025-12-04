import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, ChefHat } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/services/api";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'login';
  
  const [loginForm, setLoginForm] = useState({ 
    email: "", 
    password: "" 
  });
  
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    confirmPassword: ""
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ""
  });

  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Lỗi đăng nhập",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await login(loginForm.email, loginForm.password);
    
    if (success) {
      // Get user data from localStorage to check role
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // If user is admin, redirect to admin users management
        if (userData.role === 'ADMIN') {
          toast({
            title: "Đăng nhập thành công!",
            description: "Chào mừng quản trị viên.",
          });
          navigate('/admin/users');
        } else {
          toast({
            title: "Đăng nhập thành công!",
            description: "Chào mừng bạn quay trở lại.",
          });
          navigate('/');
        }
      } else {
        // Fallback to home if user data not found
        toast({
          title: "Đăng nhập thành công!",
          description: "Chào mừng bạn quay trở lại.",
        });
        navigate('/');
      }
    } else {
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không chính xác",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.email || !registerForm.password || !registerForm.name || !registerForm.phone) {
      toast({
        title: "Lỗi đăng ký",
        description: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!nameRegex.test(registerForm.name.trim())) {
      toast({
        title: "Lỗi đăng ký",
        description: "Họ và tên không hợp lệ — không được chứa số hoặc ký tự đặc biệt",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Lỗi đăng ký",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      });
      return;
    }

    if (registerForm.password.length < 8) {
      toast({
        title: "Lỗi đăng ký",
        description: "Mật khẩu phải có ít nhất 8 ký tự",
        variant: "destructive",
      });
      return;
    }
    
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(registerForm.phone)) {
      toast({
        title: "Lỗi đăng ký",
        description: "Số điện thoại không hợp lệ — phải bắt đầu bằng 0 và gồm 10 hoặc 11 chữ số",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(registerForm.email, registerForm.password, registerForm.name, registerForm.phone);
      
      if (success) {
        // Get user data from localStorage to check role
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // If user is admin, redirect to admin users management
          if (userData.role === 'ADMIN') {
            toast({
              title: "Đăng ký thành công!",
              description: "Tài khoản quản trị viên đã được tạo.",
            });
            navigate('/admin/users');
          } else {
            toast({
              title: "Đăng ký thành công!",
              description: "Tài khoản của bạn đã được tạo.",
            });
            navigate('/');
          }
        } else {
          // Fallback to home if user data not found
          toast({
            title: "Đăng ký thành công!",
            description: "Tài khoản của bạn đã được tạo.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordForm.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword(forgotPasswordForm.email);
      toast({
        title: "Email đã được gửi",
        description: "Vui lòng kiểm tra hộp thư của bạn để reset mật khẩu",
      });
      setForgotPasswordForm({ email: "" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
      toast({
        title: "Gửi email thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-primary">
            Hoa Nắng
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="text-center">
                <Tabs defaultValue="login">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="forgot" className="text-sm">
                      Quên mật khẩu?
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="forgot" className="mt-4">
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Nhập email để reset mật khẩu"
                          value={forgotPasswordForm.email}
                          onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" variant="outline" className="w-full">
                        Gửi email reset
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </div>

            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Họ và tên *</Label>
                  <Input
                    id="register-name"
                    placeholder="Nhập họ và tên đầy đủ"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone">Số điện thoại *</Label>
                  <Input
                    id="register-phone"
                    placeholder="Nhập số điện thoại (10 chữ số)"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Mật khẩu *</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}