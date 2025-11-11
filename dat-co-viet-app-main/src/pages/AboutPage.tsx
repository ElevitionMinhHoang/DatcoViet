import { Layout } from "@/components/layout/Layout";
import { ChefHat, Users, Truck, Star, Heart, Award } from "lucide-react";

const AboutPage = () => {
  const features = [
    {
      icon: ChefHat,
      title: "Đầu bếp chuyên nghiệp",
      description: "Đội ngũ đầu bếp giàu kinh nghiệm với tay nghề cao"
    },
    {
      icon: Users,
      title: "Phục vụ tận tâm",
      description: "Đội ngũ nhân viên nhiệt tình, chuyên nghiệp"
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh chóng",
      description: "Giao cỗ tận nơi đúng giờ, đảm bảo chất lượng"
    },
    {
      icon: Star,
      title: "Chất lượng 5 sao",
      description: "Nguyên liệu tươi ngon, hương vị đặc trưng"
    },
    {
      icon: Heart,
      title: "Tận tâm với khách hàng",
      description: "Luôn lắng nghe và cải thiện dịch vụ"
    },
    {
      icon: Award,
      title: "Uy tín hàng đầu",
      description: "Được hàng nghìn khách hàng tin tưởng"
    }
  ];

  const stats = [
    { number: "5000+", label: "Khách hàng hài lòng" },
    { number: "1000+", label: "Mâm cỗ đã phục vụ" },
    { number: "50+", label: "Món ăn đặc sắc" },
    { number: "98%", label: "Tỷ lệ hài lòng" }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            Giới thiệu về Hoa Nắng
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Nơi gìn giữ và phát huy những giá trị ẩm thực truyền thống Việt Nam
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="prose prose-lg mx-auto">
            <p className="text-lg leading-relaxed mb-6">
              <strong className="text-primary">Hoa Nắng</strong> là dịch vụ đặt cỗ trực tuyến hàng đầu, chuyên cung cấp các món ăn truyền thống và hiện đại cho mọi dịp đặc biệt của bạn. Chúng tôi tự hào mang đến những mâm cỗ chất lượng, được chế biến từ nguyên liệu tươi ngon và đội ngũ đầu bếp giàu kinh nghiệm.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Sứ mệnh của chúng tôi là gìn giữ và phát huy những giá trị ẩm thực truyền thống của Việt Nam, đồng thời mang đến sự tiện lợi và trải nghiệm tuyệt vời cho khách hàng. Với Hoa Nắng, bạn có thể dễ dàng lựa chọn thực đơn, đặt hàng và nhận cỗ tận nơi một cách nhanh chóng và chuyên nghiệp.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Hãy để chúng tôi đồng hành cùng bạn trong những khoảnh khắc đáng nhớ của cuộc sống - từ những bữa cơm gia đình ấm cúng đến những dịp lễ trọng đại!
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-lg border">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Tại sao chọn Hoa Nắng?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-lg border p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">Sứ mệnh</h3>
            <p className="text-muted-foreground">
              Mang đến những mâm cỗ chất lượng cao, giữ trọn hương vị truyền thống Việt Nam,
              đồng thời mang lại sự tiện lợi và trải nghiệm tuyệt vời cho mọi khách hàng.
            </p>
          </div>
          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">Tầm nhìn</h3>
            <p className="text-muted-foreground">
              Trở thành đơn vị cung cấp dịch vụ đặt cỗ trực tuyến hàng đầu Việt Nam,
              góp phần quảng bá ẩm thực Việt đến với cộng đồng trong và ngoài nước.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary to-primary/60 rounded-lg p-8 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Sẵn sàng trải nghiệm dịch vụ?
          </h2>
          <p className="mb-6 opacity-90">
            Hãy đặt mâm cỗ ngay hôm nay để tận hưởng hương vị truyền thống đích thực!
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Đặt cỗ ngay
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;