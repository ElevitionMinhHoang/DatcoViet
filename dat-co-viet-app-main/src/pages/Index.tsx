import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FeastCard } from "@/components/FeastCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, Star, Award, Clock, Menu, ArrowRight, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { menusAPI, feastSetsAPI, feedbackAPI } from "@/services/api";
import { Dish, FeastSet } from "@/types";
import heroFeastImg from "@/assets/hero-feast.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [feastSets, setFeastSets] = useState<FeastSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["Tất cả", "Mâm Cỗ", "Món Ăn"];

  useEffect(() => {
    loadDishes();
  }, []);

  // Listen for review submissions to refresh rating data
  useEffect(() => {
    const handleReviewSubmitted = () => {
      loadDishes();
    };
    window.addEventListener('reviewSubmitted', handleReviewSubmitted);
    return () => window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
  }, []);

  const loadDishes = async () => {
    try {
      // Fetch dishes and feast sets in parallel
      const [dishesData, feastSetsData] = await Promise.all([
        menusAPI.getAllMenus(),
        feastSetsAPI.getAllFeastSets(),
      ]);
      setDishes(dishesData);
      setFeastSets(feastSetsData);

      // Create a map of feast set ratings for quick lookup
      const feastSetRatingMap: Record<string, { rating: number; reviewCount: number }> = {};
      feastSetsData.forEach(fs => {
        feastSetRatingMap[fs.id] = { rating: fs.rating, reviewCount: fs.reviewCount };
      });

      // For each dish, determine its rating
      const dishesWithRatings = await Promise.all(
        dishesData.map(async (dish) => {
          // If dish is a feast set, use rating from feastSetRatingMap
          if (feastSetRatingMap[dish.id]) {
            return {
              ...dish,
              rating: feastSetRatingMap[dish.id].rating,
              reviewCount: feastSetRatingMap[dish.id].reviewCount,
            };
          }
          // Otherwise, fetch reviews for this individual dish
          try {
            const reviews = await feedbackAPI.getFeedbackByMenu(dish.id);
            const reviewCount = reviews.length;
            const rating = reviewCount > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
              : 0;
            return {
              ...dish,
              rating: parseFloat(rating.toFixed(1)),
              reviewCount,
            };
          } catch (error) {
            console.error(`Failed to fetch reviews for dish ${dish.id}:`, error);
            return {
              ...dish,
              rating: 0,
              reviewCount: 0,
            };
          }
        })
      );
      // Update dishes with ratings (we'll store in a separate state or extend dishes)
      // For now, we can store in dishes state but we need to keep the original type.
      // We'll create a new state `dishesWithRatings` or modify dishes to include rating.
      // Since we already have `dishes` and `feastSets`, we can keep them separate.
      // However, the UI uses `feastSets` for matching; we can update `feastSets` with the new ratings.
      // Actually we already have feastSetsData with ratings, but we need to update `dishes` with ratings for individual dishes.
      // Let's create a new state `dishesWithRatings` and use it in filteredDishes.
      // For simplicity, we'll update `dishes` to include rating and reviewCount as optional fields.
      // We'll extend Dish type locally.
      setDishes(dishesWithRatings as Dish[]);
    } catch (error) {
      console.error('Failed to load dishes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu món ăn từ server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDishes = selectedCategory === "Tất cả"
    ? dishes.filter(dish => dish.isAvailable).slice(0, 6) // Show only 6 popular dishes on homepage
    : dishes.filter(dish => dish.category === selectedCategory && dish.isAvailable);

  const handleViewDetails = (id: string, category: string) => {
    // Check if it's a feast set (IDs 37-41) or individual dish
    const menuId = Number(id);
    if (menuId >= 37 && menuId <= 41) {
      navigate(`/menu/sets/${id}`);
    } else {
      navigate(`/menu/dishes/${id}`);
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div>
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

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 transition-smooth ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-primary hover:text-primary-foreground"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Feast Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDishes.map((dish) => {
              // Use rating and reviewCount from dish (already populated in loadDishes)
              const rating = dish.rating ?? 0;
              const reviewCount = dish.reviewCount ?? 0;
              return (
                <FeastCard
                  key={dish.id}
                  feastSet={{
                    id: dish.id,
                    name: dish.name,
                    description: dish.description,
                    image: dish.image,
                    price: dish.price,
                    category: dish.category,
                    dishes: [],
                    servings: 4,
                    isPopular: true,
                    rating,
                    reviewCount,
                    isActive: dish.isAvailable,
                    tags: [],
                  }}
                  onViewDetails={() => handleViewDetails(dish.id, dish.category)}
                />
              );
            })}
          </div>

          {filteredDishes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Không tìm thấy món ăn nào phù hợp
              </p>
            </div>
          )}

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
    </div>
  );
};

export default Index;
