import { Scale, BookOpen, AlertTriangle, CheckCircle } from "lucide-react";

const TermsAndConditionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Điều khoản & Điều kiện sử dụng
          </h1>
          <p className="text-xl text-muted-foreground">
            Quy định về việc sử dụng dịch vụ đặt cỗ trực tuyến Hoa Nắng
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg border p-8">
            <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-800 text-sm">
                  <strong>Lưu ý quan trọng:</strong> Bằng việc sử dụng dịch vụ của Hoa Nắng, 
                  bạn đồng ý với tất cả các điều khoản và điều kiện được quy định dưới đây.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">1. Định nghĩa</h2>
            <ul className="space-y-3 mb-8">
              <li><strong>"Dịch vụ"</strong>: Dịch vụ đặt cỗ trực tuyến do Hoa Nắng cung cấp</li>
              <li><strong>"Khách hàng"</strong>: Người sử dụng dịch vụ đặt cỗ của Hoa Nắng</li>
              <li><strong>"Đơn hàng"</strong>: Yêu cầu đặt món ăn được gửi qua website/app</li>
              <li><strong>"Mâm cỗ"</strong>: Tập hợp các món ăn được đặt theo yêu cầu</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 text-primary">2. Điều kiện sử dụng</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Độ tuổi sử dụng</h3>
                  <p className="text-muted-foreground">
                    Khách hàng phải từ 18 tuổi trở lên hoặc có sự đồng ý của người giám hộ hợp pháp
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Tài khoản</h3>
                  <p className="text-muted-foreground">
                    Khách hàng phải cung cấp thông tin chính xác khi đăng ký tài khoản
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Trách nhiệm</h3>
                  <p className="text-muted-foreground">
                    Khách hàng chịu trách nhiệm bảo mật thông tin tài khoản
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">3. Quy trình đặt hàng</h2>
            <div className="space-y-6 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">3.1. Lựa chọn món ăn</h3>
                <p className="text-muted-foreground">
                  Khách hàng có thể lựa chọn từ thực đơn đa dạng của Hoa Nắng. 
                  Giá cả được niêm yết rõ ràng và có thể thay đổi theo thời gian.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">3.2. Xác nhận đơn hàng</h3>
                <p className="text-muted-foreground">
                  Đơn hàng chỉ được xác nhận khi khách hàng hoàn tất thanh toán 
                  và nhận được email xác nhận từ Hoa Nắng.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">3.3. Thời gian giao hàng</h3>
                <p className="text-muted-foreground">
                  Thời gian giao hàng phụ thuộc vào khoảng cách và tình trạng giao thông. 
                  Hoa Nắng sẽ thông báo thời gian dự kiến khi xác nhận đơn hàng.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">4. Thanh toán</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
                <p className="text-muted-foreground">
                  Hoa Nắng chấp nhận phương thức thanh toán: Tiền mặt khi nhận hàng (COD).
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Xác nhận thanh toán</h3>
                <p className="text-muted-foreground">
                  Đơn hàng chỉ được xử lý khi thanh toán được xác nhận thành công.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">5. Hủy đơn hàng & Hoàn tiền</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Hủy đơn hàng</h3>
                <p className="text-muted-foreground">
                  Khách hàng có thể hủy đơn hàng trước khi cỗ được chuẩn bị. 
                  Phí hủy có thể áp dụng tùy thuộc vào thời điểm hủy.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Hoàn tiền</h3>
                <p className="text-muted-foreground">
                  Trong trường hợp Hoa Nắng không thể cung cấp dịch vụ như đã cam kết, 
                  khách hàng sẽ được hoàn tiền toàn bộ hoặc một phần tùy thuộc vào tình huống.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">6. Quyền sở hữu trí tuệ</h2>
            <p className="mb-6">
              Tất cả nội dung trên website Hoa Nắng bao gồm logo, hình ảnh, văn bản, 
              thiết kế đều thuộc quyền sở hữu của Hoa Nắng. Khách hàng không được phép 
              sao chép, phân phối mà không có sự cho phép bằng văn bản.
            </p>

            <h2 className="text-2xl font-bold mb-6 text-primary">7. Giới hạn trách nhiệm</h2>
            <p className="mb-6">
              Hoa Nắng không chịu trách nhiệm đối với:
            </p>
            <ul className="space-y-3 mb-8">
              <li>• Sự chậm trễ do điều kiện thời tiết, giao thông bất khả kháng</li>
              <li>• Thay đổi về chất lượng món ăn do nguyên liệu theo mùa</li>
              <li>• Lỗi kỹ thuật từ phía nhà cung cấp dịch vụ internet</li>
              <li>• Hành vi sử dụng trái phép tài khoản của khách hàng</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 text-primary">8. Thay đổi điều khoản</h2>
            <p className="mb-6">
              Hoa Nắng có quyền thay đổi các điều khoản và điều kiện này vào bất kỳ thời điểm nào. 
              Các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên website.
            </p>

            <h2 className="text-2xl font-bold mb-6 text-primary">9. Giải quyết tranh chấp</h2>
            <p className="mb-6">
              Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông qua thương lượng. 
              Nếu không đạt được thỏa thuận, vụ việc sẽ được đưa ra Tòa án có thẩm quyền tại Hà Nội.
            </p>

            <div className="mt-8 p-6 bg-primary/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Liên hệ</h3>
              <p className="mb-4">Nếu có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ:</p>
              <div className="space-y-2">
                <p><strong>CÔNG TY TNHH DỊCH VỤ ẨM THỰC HOA NẮNG</strong></p>
                <p>📍 Địa chỉ: 12 Chùa bộc, Đống đa, Hà Nội</p>
                <p>📞 Hotline: 0586 501 666</p>
                <p>📧 Email: hoanangcatering@gmail.com</p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Phiên bản cập nhật: 29/11/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;