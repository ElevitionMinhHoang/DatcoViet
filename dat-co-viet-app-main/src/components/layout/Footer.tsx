import { MapPin, Phone, Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary to-primary/60 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Về chúng tôi */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
            <p className="text-white/90 leading-relaxed mb-4">
              Với mong muốn mang những bữa tiệc ngon – gọn – trọn vẹn cảm xúc đến từng gia đình,
              Hoa Nắng ra đời để đồng hành cùng bạn trong mọi khoảnh khắc đáng nhớ.
            </p>
            <p className="text-white/90 leading-relaxed">
              Từ tiệc gia đình ấm cúng đến liên hoan, sinh nhật, tất niên, chúng tôi cam kết
              nguyên liệu tươi sạch – thực đơn đa dạng – phục vụ tận tâm, giúp bạn thảnh thơi
              tận hưởng trọn vẹn niềm vui bên người thân.
            </p>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <div className="space-y-3">
              <p className="font-semibold text-orange-50">
                CÔNG TY TNHH DỊCH VỤ ẨM THỰC HOA NẮNG
              </p>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-200 mt-0.5 flex-shrink-0" />
                <span className="text-orange-100">
                   Địa chỉ: 12 Chùa bộc, Đống đa, Hà Nội
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-200 flex-shrink-0" />
                <span className="text-orange-100">
                  Hotline: 0586 501 666
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-200 flex-shrink-0" />
                <span className="text-orange-100">
                   Email: hoanangcatering@gmail.com
                </span>
              </div>
              
             
            </div>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="text-xl font-bold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy-policy" className="text-white/90 hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className="text-white/90 hover:text-white transition-colors">
                  Điều khoản & điều kiện sử dụng
                </a>
              </li>
              <li>
                <a href="/operating-regulations" className="text-white/90 hover:text-white transition-colors">
                  Quy chế hoạt động
                </a>
              </li>
              <li>
                <a href="/complaint-resolution" className="text-white/90 hover:text-white transition-colors">
                  Cơ chế tiếp nhận & giải quyết khiếu nại
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-white/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © 2024 Hoa Nắng Catering. Tất cả các quyền được bảo lưu.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}