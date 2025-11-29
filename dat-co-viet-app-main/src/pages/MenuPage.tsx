import { useState, useEffect } from "react";
import { FeastCard } from "@/components/FeastCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Grid, List, Loader2 } from "lucide-react";
import { menusAPI, feastSetsAPI } from "@/services/api";
import { Dish, FeastSet } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'sets' | 'dishes'>('sets');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [feastSets, setFeastSets] = useState<FeastSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ["Tất cả", "Gia đình", "Tiệc cưới", "Giỗ tổ tiên", "Thôi nôi"];
  const dishCategories = ["Tất cả", "Khai vị", "Món chính", "Món phụ", "Tráng miệng", "Đồ uống"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Always load dishes data from backend API
      const dishesData = await menusAPI.getAllMenus();
      setDishes(dishesData);
      
      // Filter feast sets from the dishes data (IDs 37-41)
      const feastSetsData = dishesData
        .filter(dish => {
          const menuId = Number(dish.id);
          return menuId >= 37 && menuId <= 41;
        })
        .map(dish => ({
          id: dish.id,
          name: dish.name,
          description: dish.description,
          image: dish.image,
          price: dish.price,
          dishes: [],
          servings: 4,
          category: dish.category,
          isPopular: true,
          rating: 4.8,
          reviewCount: 124,
          isActive: dish.isAvailable,
          tags: [],
        }));
      
      setFeastSets(feastSetsData);
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

  const filteredSets = feastSets.filter(set => {
    const matchesSearch = set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || set.category === selectedCategory;
    return matchesSearch && matchesCategory && set.isActive;
  });

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (dish.description && dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Tất cả" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory && dish.isAvailable;
  });

  const handleViewDetails = (id: string, type: 'set' | 'dish') => {
    if (type === 'set') {
      navigate(`/menu/sets/${id}`);
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

  const DishCard = ({ dish }: { dish: Dish }) => (
    <Card className="overflow-hidden hover:shadow-warm transition-smooth cursor-pointer group">
      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-smooth"
        />
        {/* Vegetarian and Spicy badges can be added later when we have this data */}
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
              <span className="text-lg font-bold text-primary">
                {formatPrice(dish.price)}
              </span>
              <span className="text-muted-foreground text-sm ml-1">/ {dish.unit}</span>
            </div>
            <Button 
              size="sm" 
              variant="hero"
              onClick={() => handleViewDetails(dish.id, 'dish')}
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          {(activeTab === 'sets' ? categories : dishCategories).map((category) => (
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
        {activeTab === 'sets' ? (
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
        ) : (
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

        {((activeTab === 'sets' && filteredSets.length === 0) || 
          (activeTab === 'dishes' && filteredDishes.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy {activeTab === 'sets' ? 'mâm cỗ' : 'món ăn'} nào phù hợp
            </p>
          </div>
        )}
      </div>
  );
}