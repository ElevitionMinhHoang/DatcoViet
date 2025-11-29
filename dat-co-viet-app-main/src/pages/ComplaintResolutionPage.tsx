import { MessageCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const ComplaintResolutionPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Cơ chế tiếp nhận & giải quyết khiếu nại
          </h1>
          <p className="text-xl text-muted-foreground">
            Quy trình xử lý khiếu nại và đảm bảo quyền lợi khách hàng
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg border p-8">
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-sm">
                  <strong>Cam kết:</strong> Hoa Nắng luôn lắng nghe và giải quyết mọi khiếu nại 
                  của khách hàng một cách nhanh chóng, công bằng và minh bạch.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">1. Nguyên tắc giải quyết khiếu nại</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Nhanh chóng
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tiếp nhận và phản hồi khiếu nại trong thời gian ngắn nhất
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Công bằng
                </h3>
                <p className="text-sm text-muted-foreground">
                  Xem xét khách quan, không thiên vị giữa các bên
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Minh bạch
                </h3>
                <p className="text-sm text-muted-foreground">
                  Thông báo rõ ràng quy trình và kết quả giải quyết
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Bảo mật
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bảo vệ thông tin cá nhân của khách hàng khiếu nại
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">2. Hình thức tiếp nhận khiếu nại</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Hotline</h3>
                <p className="text-muted-foreground">
                  📞 <strong>0586 501 666</strong> (8:00 - 22:00 hàng ngày)
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">
                  📧 <strong>hoanangcatering@gmail.com</strong> (24/7)
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Website/App</h3>
                <p className="text-muted-foreground">
                  🌐 Chat trực tuyến và form khiếu nại trên website
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Trực tiếp</h3>
                <p className="text-muted-foreground">
                  📍 12 Chùa bộc, Đống đa, Hà Nội (8:00 - 17:00 từ Thứ 2 - Thứ 6)
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">3. Quy trình giải quyết khiếu nại</h2>
            <div className="space-y-6 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <h3 className="font-semibold">Tiếp nhận khiếu nại</h3>
                </div>
                <p className="text-muted-foreground">
                  Khiếu nại được ghi nhận và phân loại. Khách hàng nhận được mã số khiếu nại 
                  để theo dõi tiến độ xử lý.
                </p>
                <p className="text-sm text-primary mt-2">
                  <strong>Thời gian:</strong> Trong vòng 2 giờ làm việc
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <h3 className="font-semibold">Xác minh thông tin</h3>
                </div>
                <p className="text-muted-foreground">
                  Đội ngũ chuyên trách tiến hành xác minh thông tin, thu thập chứng cứ 
                  và đánh giá tính hợp lệ của khiếu nại.
                </p>
                <p className="text-sm text-primary mt-2">
                  <strong>Thời gian:</strong> 1-3 ngày làm việc
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <h3 className="font-semibold">Đề xuất giải pháp</h3>
                </div>
                <p className="text-muted-foreground">
                  Dựa trên kết quả xác minh, đề xuất phương án giải quyết phù hợp 
                  và thông báo cho khách hàng.
                </p>
                <p className="text-sm text-primary mt-2">
                  <strong>Thời gian:</strong> Trong vòng 1 ngày làm việc
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <h3 className="font-semibold">Thực hiện giải quyết</h3>
                </div>
                <p className="text-muted-foreground">
                  Triển khai giải pháp đã thống nhất với khách hàng và theo dõi 
                  kết quả thực hiện.
                </p>
                <p className="text-sm text-primary mt-2">
                  <strong>Thời gian:</strong> 1-7 ngày làm việc tùy tính chất
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <h3 className="font-semibold">Đánh giá kết quả</h3>
                </div>
                <p className="text-muted-foreground">
                  Khảo sát mức độ hài lòng của khách hàng và hoàn tất hồ sơ khiếu nại.
                </p>
                <p className="text-sm text-primary mt-2">
                  <strong>Thời gian:</strong> Trong vòng 3 ngày làm việc
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">4. Phân loại khiếu nại & thời gian xử lý</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Loại khiếu nại</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Thời gian xử lý</th>
                    <th className="border border-gray-300 p-3 text-left font-semibold">Giải pháp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">Chất lượng món ăn</td>
                    <td className="border border-gray-300 p-3">24-48 giờ</td>
                    <td className="border border-gray-300 p-3">Đổi món, hoàn tiền, giảm giá</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Giao hàng chậm</td>
                    <td className="border border-gray-300 p-3">4-8 giờ</td>
                    <td className="border border-gray-300 p-3">Giảm phí vận chuyển, voucher</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Thiếu món/sai món</td>
                    <td className="border border-gray-300 p-3">2-4 giờ</td>
                    <td className="border border-gray-300 p-3">Giao bổ sung ngay lập tức</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Thái độ nhân viên</td>
                    <td className="border border-gray-300 p-3">3-5 ngày</td>
                    <td className="border border-gray-300 p-3">Xin lỗi, đào tạo lại, bồi thường</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Vấn đề thanh toán</td>
                    <td className="border border-gray-300 p-3">1-3 ngày</td>
                    <td className="border border-gray-300 p-3">Điều chỉnh, hoàn tiền</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">5. Quyền và nghĩa vụ của khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold mb-2 text-green-800">Quyền của khách hàng</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Được cung cấp thông tin đầy đủ về quy trình</li>
                  <li>• Được bảo mật thông tin cá nhân</li>
                  <li>• Được cập nhật tiến độ xử lý</li>
                  <li>• Được đề xuất giải pháp thay thế</li>
                  <li>• Được khiếu nại lên cấp cao hơn</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-800">Nghĩa vụ của khách hàng</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Cung cấp thông tin chính xác, trung thực</li>
                  <li>• Hợp tác trong quá trình xác minh</li>
                  <li>• Giữ gìn bằng chứng, hóa đơn liên quan</li>
                  <li>• Tuân thủ thời hạn phản hồi</li>
                  <li>• Tôn trọng nhân viên xử lý</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">6. Khiếu nại lên cấp cao hơn</h2>
            <p className="mb-6">
              Nếu không hài lòng với kết quả giải quyết của Hoa Nắng, khách hàng có thể 
              khiếu nại lên các cơ quan chức năng:
            </p>
            <div className="space-y-3 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Cục Quản lý Cạnh tranh</h3>
                <p className="text-sm text-muted-foreground">
                  Bộ Công Thương - Số 54 Hai Bà Trưng, Hoàn Kiếm, Hà Nội
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Hiệp hội Bảo vệ Người tiêu dùng</h3>
                <p className="text-sm text-muted-foreground">
                  49 Hai Bà Trưng, Hoàn Kiếm, Hà Nội
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Thông tin liên hệ bộ phận khiếu nại</h3>
              <div className="space-y-2">
                <p><strong>Bộ phận Chăm sóc Khách hàng & Giải quyết Khiếu nại</strong></p>
                <p>📍 Địa chỉ: 12 Chùa bộc, Đống đa, Hà Nội</p>
                <p>📞 Hotline: 0586 501 666 (Nhánh 2)</p>
                <p>📧 Email: cs@hoanangcatering.vn</p>
                <p>⏰ Thời gian làm việc: 8:00 - 17:00 từ Thứ 2 - Thứ 6</p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Cơ chế có hiệu lực từ ngày: 29/11/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintResolutionPage;