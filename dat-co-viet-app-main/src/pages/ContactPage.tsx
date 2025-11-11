import { Layout } from "@/components/layout/Layout";

const ContactPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Thông tin liên hệ</h2>
            <p className="mt-2">
              <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, Thành phố Hà Nội
            </p>
            <p className="mt-2">
              <strong>Điện thoại:</strong> (024) 1234 5678
            </p>
            <p className="mt-2">
              <strong>Email:</strong> support@datcoviet.vn
            </p>
            <p className="mt-2">
              <strong>Giờ làm việc:</strong> 8:00 - 21:00, Thứ Hai - Chủ Nhật
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Gửi tin nhắn cho chúng tôi</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input type="text" id="name" name="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600">Gửi</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;