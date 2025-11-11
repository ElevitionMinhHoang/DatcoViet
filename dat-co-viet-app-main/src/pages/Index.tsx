import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FeastCard } from "@/components/FeastCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { feastSets } from "@/data/mockData";
import { ChefHat, Star, Award, Clock, Menu, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import heroFeastImg from "@/assets/hero-feast.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Gia đình", "Tiệc cưới", "Giỗ tổ tiên", "Thôi nôi"];

  const filteredFeastSets = selectedCategory === "Tất cả" 
    ? feastSets.filter(set => set.isActive).slice(0, 6) // Show only 6 popular sets on homepage
    : feastSets.filter(feast => feast.category === selectedCategory && feast.isActive);

  const handleViewDetails = (id: string) => {
    navigate(`/menu/sets/${id}`);
  };

  const handleViewMenu = () => {
    navigate('/menu');
  };

  const handleAuth = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <Layout showBottomNav={!!user}>
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src={heroFeastImg}
          alt="Vietnamese Feast"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Hoa Nắng<br />
                <span className="text-secondary">Mâm Cỗ Truyền Thống</span>
              </h1>
              <p className="text-xl text-white/90">
                Mâm cỗ ngon, phục vụ tận nơi, giá cả hợp lý cho mọi dịp đặc biệt
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button variant="hero" size="lg" onClick={handleViewMenu}>
                  <Menu className="w-5 h-5 mr-2" />
                  XEM THỰC ĐƠN
                </Button>
                {!user && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-white border-white hover:bg-white hover:text-primary"
                    onClick={handleAuth}
                  >
                    Đăng nhập
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Mâm cỗ đã phục vụ</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Star className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Đánh giá trung bình</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Khách hàng hài lòng</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">2-3h</div>
              <div className="text-sm text-muted-foreground">Thời gian chuẩn bị</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions - Prominent Menu Button */}
      <section className="py-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Khám phá thực đơn phong phú
          </h2>
          <p className="text-muted-foreground mb-6">
            Hơn 50+ mâm cỗ và món ăn truyền thống đang chờ bạn
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-4 h-auto"
            onClick={handleViewMenu}
          >
            <Menu className="w-6 h-6 mr-3" />
            XEM THỰC ĐƠN NGAY
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Popular Sets Preview */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Mâm Cỗ Phổ Biến
            </h2>
            <p className="text-muted-foreground">
              Những mâm cỗ được yêu thích nhất
            </p>
          </div>

          {/* Feast Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredFeastSets.map((feastSet) => (
              <FeastCard
                key={feastSet.id}
                feastSet={feastSet}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewMenu}
            >
              Xem tất cả mâm cỗ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
