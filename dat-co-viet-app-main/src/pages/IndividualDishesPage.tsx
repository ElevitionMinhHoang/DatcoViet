import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Grid, List } from "lucide-react";
import { menusAPI } from "@/services/api";
import { Dish } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function IndividualDishesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const dishCategories = ["Tất cả", "Khai vị", "Món chính", "Món phụ", "Tráng miệng"];

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const dishesData = await menusAPI.getAllMenus();
        setDishes(dishesData);
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

    loadDishes();
  }, [toast]);

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || dish.category === selectedCategory;
    return matchesSearch && matchesCategory && dish.isAvailable;
  });
  const { isLoggedIn, user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (id: string) => {
    if (!isLoggedIn) {
      navigate("/auth");
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đặt món ăn",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user is admin - admin cannot place orders
    if (user?.role === 'admin') {
      toast({
        title: "Không thể đặt hàng",
        description: "Tài khoản quản trị viên không thể đặt hàng. Vui lòng sử dụng tài khoản khách hàng.",
        variant: "destructive"
      });
      return;
    }
    
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      // Use CartContext to add to cart
      addToCart(dish, 1);
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${dish.name} đã được thêm vào giỏ hàng`,
      });
      navigate("/checkout");
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/menu/dishes/${id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const DishCard = ({ dish }: { dish: Dish }) => (
    <Card
      className="overflow-hidden hover:shadow-warm transition-smooth cursor-pointer group"
      onClick={() => handleViewDetails(dish.id)}
    >
      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-smooth"
        />
        {dish.isVegetarian && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            Chay
          </Badge>
        )}
        {dish.isSpicy && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            Cay
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
            {dish.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {dish.description}
          </p>
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking button
                handleAddToCart(dish.id);
              }}
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Món Ăn Lẻ
          </h1>
          <p className="text-muted-foreground">
            Lựa chọn các món ăn riêng lẻ theo sở thích của bạn
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
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

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {dishCategories.map((category) => (
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

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 max-w-2xl mx-auto'
        }`}>
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy món ăn nào phù hợp
            </p>
          </div>
        )}
      </div>
  );
}