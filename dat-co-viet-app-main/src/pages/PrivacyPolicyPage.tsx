import { Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-xl text-muted-foreground">
            Cam kết bảo vệ thông tin cá nhân của khách hàng
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">1. Mục đích thu thập thông tin</h2>
            <p className="mb-6">
              Hoa Nắng thu thập thông tin cá nhân của khách hàng nhằm mục đích:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Xác thực và quản lý tài khoản khách hàng</span>
              </li>
              <li className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Xử lý đơn hàng và giao dịch</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Cung cấp dịch vụ hỗ trợ khách hàng</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Cải thiện chất lượng dịch vụ</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 text-primary">2. Thông tin thu thập</h2>
            <p className="mb-4">Chúng tôi có thể thu thập các thông tin sau:</p>
            <ul className="space-y-2 mb-8">
              <li>• Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ</li>
              <li>• Thông tin đơn hàng: Món ăn đã đặt, thời gian, địa điểm giao hàng</li>
              <li>• Thông tin thanh toán: Phương thức thanh toán, lịch sử giao dịch</li>
              <li>• Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt, thiết bị truy cập</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 text-primary">3. Bảo mật thông tin</h2>
            <p className="mb-6">
              Hoa Nắng cam kết bảo vệ thông tin cá nhân của khách hàng bằng các biện pháp bảo mật tiên tiến:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Mã hóa dữ liệu</h3>
                <p className="text-sm text-muted-foreground">
                  Tất cả thông tin nhạy cảm được mã hóa bằng công nghệ SSL 256-bit
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Truy cập hạn chế</h3>
                <p className="text-sm text-muted-foreground">
                  Chỉ nhân viên được ủy quyền mới có quyền truy cập thông tin khách hàng
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Lưu trữ an toàn</h3>
                <p className="text-sm text-muted-foreground">
                  Dữ liệu được lưu trữ trên hệ thống máy chủ bảo mật cao
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Kiểm tra định kỳ</h3>
                <p className="text-sm text-muted-foreground">
                  Hệ thống được kiểm tra bảo mật định kỳ để phát hiện lỗ hổng
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">4. Chia sẻ thông tin</h2>
            <p className="mb-6">
              Hoa Nắng cam kết không bán, cho thuê hoặc trao đổi thông tin cá nhân của khách hàng 
              cho bên thứ ba mà không có sự đồng ý trước, trừ các trường hợp:
            </p>
            <ul className="space-y-3 mb-8">
              <li>• Theo yêu cầu của cơ quan pháp luật có thẩm quyền</li>
              <li>• Đối tác vận chuyển để thực hiện giao hàng</li>
              <li>• Nhà cung cấp dịch vụ thanh toán để xử lý giao dịch</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 text-primary">5. Quyền của khách hàng</h2>
            <p className="mb-4">Khách hàng có quyền:</p>
            <ul className="space-y-3 mb-8">
              <li>• Truy cập và chỉnh sửa thông tin cá nhân</li>
              <li>• Yêu cầu xóa tài khoản và dữ liệu cá nhân</li>
              <li>• Từ chối nhận thông tin quảng cáo, khuyến mãi</li>
              <li>• Khiếu nại về việc xử lý thông tin cá nhân</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 text-primary">6. Liên hệ</h2>
            <p className="mb-4">
              Nếu có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ:
            </p>
            <div className="bg-primary/5 rounded-lg p-6">
              <p className="font-semibold">CÔNG TY TNHH DỊCH VỤ ẨM THỰC HOA NẮNG</p>
              <p className="mt-2">📍 Địa chỉ: 12 Chùa bộc, Đống đa, Hà Nội</p>
              <p>📞 Hotline: 0586 501 666</p>
              <p>📧 Email: hoanangcatering@gmail.com</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Lưu ý:</strong> Chính sách bảo mật này có thể được cập nhật định kỳ. 
                Chúng tôi sẽ thông báo trên website về bất kỳ thay đổi quan trọng nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;