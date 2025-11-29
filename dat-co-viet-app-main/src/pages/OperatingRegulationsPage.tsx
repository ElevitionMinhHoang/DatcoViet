import { ClipboardList, Users, Clock, Award } from "lucide-react";

const OperatingRegulationsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Quy chế hoạt động
          </h1>
          <p className="text-xl text-muted-foreground">
            Quy định về hoạt động và tiêu chuẩn dịch vụ của Hoa Nắng
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">1. Nguyên tắc hoạt động</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Chất lượng dịch vụ</h3>
                  <p className="text-muted-foreground">
                    Cam kết cung cấp dịch vụ chất lượng cao, đáp ứng tiêu chuẩn vệ sinh an toàn thực phẩm
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Đạo đức kinh doanh</h3>
                  <p className="text-muted-foreground">
                    Hoạt động minh bạch, trung thực, tôn trọng quyền lợi khách hàng
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Đúng giờ</h3>
                  <p className="text-muted-foreground">
                    Đảm bảo giao hàng đúng thời gian đã cam kết với khách hàng
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">2. Tiêu chuẩn chất lượng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Nguyên liệu</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sử dụng nguyên liệu tươi, có nguồn gốc rõ ràng</li>
                  <li>• Kiểm tra chất lượng đầu vào nghiêm ngặt</li>
                  <li>• Bảo quản đúng tiêu chuẩn vệ sinh</li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Chế biến</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tuân thủ quy trình chế biến an toàn</li>
                  <li>• Đội ngũ đầu bếp có chứng chỉ nghề</li>
                  <li>• Vệ sinh khu vực chế biến định kỳ</li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Đóng gói</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sử dụng bao bì thân thiện môi trường</li>
                  <li>• Đảm bảo vệ sinh trong quá trình đóng gói</li>
                  <li>• Ghi rõ thông tin sản phẩm, hạn sử dụng</li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Vận chuyển</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Phương tiện vận chuyển đảm bảo vệ sinh</li>
                  <li>• Bảo quản nhiệt độ phù hợp với từng loại thực phẩm</li>
                  <li>• Nhân viên giao hàng được đào tạo chuyên nghiệp</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">3. Quy trình xử lý đơn hàng</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tiếp nhận đơn hàng</h3>
                <p className="text-muted-foreground">
                  Đơn hàng được tiếp nhận 24/7 thông qua website và ứng dụng di động. 
                  Thời gian xác nhận đơn hàng trong vòng 30 phút.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Chuẩn bị món ăn</h3>
                <p className="text-muted-foreground">
                  Thời gian chuẩn bị từ 1-3 giờ tùy thuộc vào số lượng và độ phức tạp của món ăn. 
                  Khách hàng sẽ được thông báo thời gian giao hàng dự kiến.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Giao hàng</h3>
                <p className="text-muted-foreground">
                  Đội ngũ giao hàng được trang bị đầy đủ phương tiện bảo quản. 
                  Thời gian giao hàng được tính từ lúc xác nhận đơn đến khi giao tận nơi.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">4. Tiêu chuẩn nhân sự</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Đầu bếp</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Có chứng chỉ nghề nấu ăn</li>
                  <li>• Kinh nghiệm tối thiểu 2 năm trong nghề</li>
                  <li>• Được đào tạo về an toàn vệ sinh thực phẩm</li>
                  <li>• Kiểm tra sức khỏe định kỳ</li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Nhân viên phục vụ</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Được đào tạo kỹ năng giao tiếp</li>
                  <li>• Hiểu biết về sản phẩm và dịch vụ</li>
                  <li>• Tuân thủ quy định về trang phục, vệ sinh</li>
                  <li>• Thái độ phục vụ chuyên nghiệp, nhiệt tình</li>
                </ul>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Nhân viên giao hàng</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Có bằng lái xe hợp lệ</li>
                  <li>• Được đào tạo về an toàn giao thông</li>
                  <li>• Kỹ năng giao tiếp với khách hàng</li>
                  <li>• Tuân thủ quy trình giao hàng</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">5. Quy định về giá cả</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Niêm yết giá</h3>
                <p className="text-muted-foreground">
                  Tất cả giá cả được niêm yết rõ ràng trên website và ứng dụng. 
                  Giá có thể thay đổi theo mùa vụ và chi phí nguyên liệu.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Phí dịch vụ</h3>
                <p className="text-muted-foreground">
                  Phí giao hàng được tính dựa trên khoảng cách và thời điểm giao hàng. 
                  Khách hàng sẽ được thông báo phí cụ thể trước khi xác nhận đơn hàng.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Khuyến mãi</h3>
                <p className="text-muted-foreground">
                  Các chương trình khuyến mãi được áp dụng theo điều kiện cụ thể. 
                  Không áp dụng đồng thời nhiều chương trình khuyến mãi.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">6. Bảo vệ môi trường</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Bao bì thân thiện</h3>
                <p className="text-muted-foreground">
                  Ưu tiên sử dụng bao bì có thể tái chế, phân hủy sinh học. 
                  Hạn chế sử dụng nhựa một lần.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Xử lý chất thải</h3>
                <p className="text-muted-foreground">
                  Tuân thủ quy định về phân loại và xử lý chất thải. 
                  Hợp tác với đơn vị xử lý rác thải chuyên nghiệp.
                </p>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tiết kiệm năng lượng</h3>
                <p className="text-muted-foreground">
                  Sử dụng thiết bị tiết kiệm năng lượng. 
                  Tối ưu hóa quy trình sản xuất để giảm thiểu lãng phí.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-primary">7. Giám sát và đánh giá</h2>
            <p className="mb-6">
              Hoa Nắng thực hiện giám sát chất lượng dịch vụ thông qua:
            </p>
            <ul className="space-y-3 mb-8">
              <li>• Đánh giá định kỳ từ khách hàng</li>
              <li>• Kiểm tra nội bộ hàng tuần</li>
              <li>• Giám sát của cơ quan chức năng</li>
              <li>• Hệ thống quản lý chất lượng ISO 22000</li>
            </ul>

            <div className="mt-8 p-6 bg-primary/5 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Thông tin liên hệ</h3>
              <div className="space-y-2">
                <p><strong>CÔNG TY TNHH DỊCH VỤ ẨM THỰC HOA NẮNG</strong></p>
                <p>📍 Địa chỉ: 12 Chùa bộc, Đống đa, Hà Nội</p>
                <p>📞 Hotline: 0586 501 666</p>
                <p>📧 Email: hoanangcatering@gmail.com</p>
                <p>🌐 Website: www.hoanangcatering.vn</p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>Quy chế có hiệu lực từ ngày: 29/11/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatingRegulationsPage;