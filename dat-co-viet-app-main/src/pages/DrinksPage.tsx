import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Grid, List, Loader2 } from "lucide-react";
import { menusAPI } from "@/services/api";
import { Dish } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function DrinksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [drinks, setDrinks] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();

  const drinkCategories = ["Tất cả", "Trà", "Nước ép", "Sinh tố", "Bia", "Rượu", "Nước ngọt", "Cà phê"];

  useEffect(() => {
    loadDrinks();
  }, []);

  const loadDrinks = async () => {
    setIsLoading(true);
    try {
      const dishesData = await menusAPI.getAllMenus();
      // Filter drinks by category "Đồ uống" or "Đồ Uống"
      const drinksData = dishesData.filter(dish =>
        dish.category === "Đồ uống" || dish.category === "Đồ Uống"
      );
      setDrinks(drinksData);
    } catch (error) {
      console.error('Failed to load drinks:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu đồ uống từ server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrinks = drinks.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (drink.description && drink.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory = selectedCategory === "Tất cả";
    if (selectedCategory === "Trà") {
      matchesCategory = drink.name.toLowerCase().includes('trà') ||
                       (drink.description && drink.description.toLowerCase().includes('trà'));
    } else if (selectedCategory === "Nước ép") {
      matchesCategory = drink.name.toLowerCase().includes('ép') ||
                       (drink.description && drink.description.toLowerCase().includes('ép'));
    } else if (selectedCategory === "Sinh tố") {
      matchesCategory = drink.name.toLowerCase().includes('sinh tố') ||
                       (drink.description && drink.description.toLowerCase().includes('sinh tố'));
    } else if (selectedCategory === "Bia") {
      matchesCategory = drink.name.toLowerCase().includes('bia') ||
                       (drink.description && drink.description.toLowerCase().includes('bia'));
    } else if (selectedCategory === "Rượu") {
      matchesCategory = drink.name.toLowerCase().includes('rượu') ||
                       (drink.description && drink.description.toLowerCase().includes('rượu'));
    } else if (selectedCategory === "Nước ngọt") {
      matchesCategory = drink.name.toLowerCase().includes('coca') ||
                       drink.name.toLowerCase().includes('fanta') ||
                       (drink.description && drink.description.toLowerCase().includes('nước ngọt'));
    } else if (selectedCategory === "Cà phê") {
      matchesCategory = drink.name.toLowerCase().includes('cà phê') ||
                       (drink.description && drink.description.toLowerCase().includes('cà phê'));
    }
    
    return matchesSearch && matchesCategory && drink.isAvailable;
  });

  const handleAddToCart = (id: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    
    // Check if user is admin
    if (user?.role === 'admin') {
      toast({
        title: "Không thể đặt hàng",
        description: "Tài khoản admin không thể đặt hàng. Vui lòng đăng nhập bằng tài khoản khách hàng.",
        variant: "destructive"
      });
      return;
    }
    
    const dish = drinks.find(d => d.id === id);
    if (dish) {
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

  const DrinkCard = ({ drink }: { drink: Dish }) => (
    <Card
      className="overflow-hidden hover:shadow-warm transition-smooth cursor-pointer group"
      onClick={() => handleViewDetails(drink.id)}
    >
      <div className="relative">
        <img
          src={drink.image}
          alt={drink.name}
          className="w-full h-40 object-cover group-hover:scale-105 transition-smooth"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
            {drink.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {drink.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-lg font-bold text-primary">
                {formatPrice(drink.price)}
              </span>
              <span className="text-muted-foreground text-sm ml-1">/ {drink.unit}</span>
            </div>
            <Button
              size="sm"
              variant="hero"
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking button
                handleAddToCart(drink.id);
              }}
              disabled={user?.role === 'admin'}
            >
              {user?.role === 'admin' ? 'Không thể đặt' : 'Thêm vào giỏ hàng'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Đồ Uống
          </h1>
          <p className="text-muted-foreground">
            Giải khát cùng các loại đồ uống đa dạng
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm đồ uống..."
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
          {drinkCategories.map((category) => (
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
          {filteredDrinks.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>

        {filteredDrinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy đồ uống nào phù hợp
            </p>
          </div>
        )}
      </div>
  );
}