import { useState, useEffect } from "react";
import { FeastCard } from "@/components/FeastCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Filter, Grid, List, Loader2, Star } from "lucide-react";
import { menusAPI, feastSetsAPI, feedbackAPI } from "@/services/api";
import { Dish, FeastSet } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'sets' | 'dishes' | 'drinks'>('all');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [feastSets, setFeastSets] = useState<FeastSet[]>([]);
  const [drinks, setDrinks] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ["Tất cả"];
  const dishCategories = ["Tất cả", "Khai vị", "Món chính", "Món phụ", "Tráng miệng"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load all menu items from backend API
      const allMenuItems = await menusAPI.getAllMenus();
      
      // Use real feast sets with real rating data
      const feastSetsData = await feastSetsAPI.getAllFeastSets();
      
      const individualDishes = allMenuItems.filter(item =>
        item.category !== "Mâm Cỗ" && item.category !== "Đồ uống" && item.category !== "Đồ Uống"
      );
      
      const drinksData = allMenuItems.filter(item =>
        item.category === "Đồ uống" || item.category === "Đồ Uống"
      );

      // Enrich individual dishes with ratings
      const dishesWithRatings = await Promise.all(
        individualDishes.map(async (dish) => {
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

      // Enrich drinks with ratings (optional, likely zero)
      const drinksWithRatings = await Promise.all(
        drinksData.map(async (drink) => {
          try {
            const reviews = await feedbackAPI.getFeedbackByMenu(drink.id);
            const reviewCount = reviews.length;
            const rating = reviewCount > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
              : 0;
            return {
              ...drink,
              rating: parseFloat(rating.toFixed(1)),
              reviewCount,
            };
          } catch (error) {
            console.error(`Failed to fetch reviews for drink ${drink.id}:`, error);
            return {
              ...drink,
              rating: 0,
              reviewCount: 0,
            };
          }
        })
      );
      
      setFeastSets(feastSetsData);
      setDishes(dishesWithRatings);
      setDrinks(drinksWithRatings);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu từ server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for review submissions to refresh rating data
  useEffect(() => {
    const handleReviewSubmitted = () => {
      loadData();
    };
    window.addEventListener('reviewSubmitted', handleReviewSubmitted);
    return () => window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
  }, [loadData]);

  const matchesCategory = (set: FeastSet, category: string): boolean => {
    if (category === "Tất cả") return true;
    const lowerCategory = category.toLowerCase();
    // Check name, description, category field, tags
    if (set.name.toLowerCase().includes(lowerCategory) ||
        set.description.toLowerCase().includes(lowerCategory) ||
        set.category.toLowerCase().includes(lowerCategory)) {
      return true;
    }
    // Check tags if present
    if (set.tags && set.tags.some(tag => tag.toLowerCase().includes(lowerCategory))) {
      return true;
    }
    return false;
  };

  const filteredSets = feastSets.filter(set => {
    const matchesSearch = set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = matchesCategory(set, selectedCategory);
    return matchesSearch && matchesCat && set.isActive;
  });

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Tất cả" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory && dish.isAvailable;
  });

  const filteredDrinks = drinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (drink.description && drink.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Tất cả" || drink.category === selectedCategory;
    return matchesSearch && matchesCategory && drink.isAvailable;
  });

  // Combine all items for "Tất cả" tab with mâm cỗ first
  const allItems = [
    ...filteredSets.map(set => ({ ...set, type: 'set' as const })),
    ...filteredDishes.map(dish => ({ ...dish, type: 'dish' as const })),
    ...filteredDrinks.map(drink => ({ ...drink, type: 'drink' as const }))
  ];

  const handleViewDetails = (id: string, type: 'set' | 'dish' | 'drink') => {
    if (type === 'set') {
      navigate(`/menu/sets/${id}`);
    } else if (type === 'drink') {
      navigate(`/menu/dishes/${id}`);
    } else {
      navigate(`/menu/dishes/${id}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const DishCard = ({ dish }: { dish: Dish }) => {
    const rating = dish.rating ?? 0;
    const reviewCount = dish.reviewCount ?? 0;
    const hasReviews = rating > 0 && reviewCount > 0;
    return (
      <Card className="overflow-hidden hover:shadow-warm transition-smooth cursor-pointer group">
        <div className="relative">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-smooth"
          />
          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 px-2 py-1 rounded-full text-sm">
            <Star className={`w-4 h-4 ${hasReviews ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            <span className="font-medium">{rating.toFixed(1)}</span>
            {hasReviews ? (
              <span className="text-muted-foreground text-sm">({reviewCount} đánh giá)</span>
            ) : (
              <span className="text-muted-foreground text-sm">Chưa có đánh giá</span>
            )}
          </div>
        </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {dish.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(dish.price)}
              </span>
              <span className="text-muted-foreground text-sm ml-1">/ {dish.unit}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          variant="hero"
          className="w-full"
          onClick={() => handleViewDetails(dish.id, 'dish')}
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thực Đơn Đặt Cỗ
          </h1>
          <p className="text-muted-foreground">
            Khám phá các mâm cỗ và món ăn truyền thống Việt Nam
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm mâm cỗ, món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('all');
                  setSelectedCategory('Tất cả');
                }}
              >
                Tất cả
              </Button>
              <Button
                variant={activeTab === 'sets' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('sets');
                  setSelectedCategory('Tất cả');
                }}
              >
                Mâm cỗ
              </Button>
              <Button
                variant={activeTab === 'dishes' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('dishes');
                  setSelectedCategory('Tất cả');
                }}
              >
                Món lẻ
              </Button>
              <Button
                variant={activeTab === 'drinks' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTab('drinks');
                  setSelectedCategory('Tất cả');
                }}
              >
                Đồ uống
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {(activeTab === 'sets' ? categories :
            activeTab === 'dishes' ? dishCategories :
            activeTab === 'drinks' ? ["Tất cả"] : ["Tất cả"]).map((category) => (
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

        {/* Content */}
        {activeTab === 'all' && (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-2xl mx-auto'
          }`}>
            {allItems.map((item) => (
              item.type === 'set' ? (
                <FeastCard
                  key={item.id}
                  feastSet={item}
                  onViewDetails={(id) => handleViewDetails(id, 'set')}
                />
              ) : (
                <DishCard key={item.id} dish={item} />
              )
            ))}
          </div>
        )}

        {activeTab === 'sets' && (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-2xl mx-auto'
          }`}>
            {filteredSets.map((feastSet) => (
              <FeastCard
                key={feastSet.id}
                feastSet={feastSet}
                onViewDetails={(id) => handleViewDetails(id, 'set')}
              />
            ))}
          </div>
        )}

        {activeTab === 'dishes' && (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-2xl mx-auto'
          }`}>
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}

        {activeTab === 'drinks' && (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-2xl mx-auto'
          }`}>
            {filteredDrinks.map((drink) => (
              <DishCard key={drink.id} dish={drink} />
            ))}
          </div>
        )}

        {(activeTab === 'all' && allItems.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy món ăn nào phù hợp
            </p>
          </div>
        )}

        {(activeTab === 'sets' && filteredSets.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy mâm cỗ nào phù hợp
            </p>
          </div>
        )}

        {(activeTab === 'dishes' && filteredDishes.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy món ăn nào phù hợp
            </p>
          </div>
        )}

        {(activeTab === 'drinks' && filteredDrinks.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy đồ uống nào phù hợp
            </p>
          </div>
        )}
      </div>
  );
}