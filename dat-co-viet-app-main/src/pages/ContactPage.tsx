import { useState } from "react";
import { contactAPI } from "@/services/api";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await contactAPI.submitContact(formData);
      toast.success("Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.");
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Liên hệ với chúng tôi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Thông tin liên hệ</h2>
            <p className="mt-2">
              <strong>Địa chỉ:</strong>12 Chùa bộc, Quận Đống đa, Hà Nội
            </p>
            <p className="mt-2">
              <strong>Điện thoại:</strong> 0586 501 666
            </p>
            <p className="mt-2">
              <strong>Email:</strong> hoanangcatering@gmail.com
            </p>
            <p className="mt-2">
              <strong>Giờ làm việc:</strong> 8:00 - 21:00, Thứ Hai - Chủ Nhật
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Gửi tin nhắn cho chúng tôi</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi"}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default ContactPage;