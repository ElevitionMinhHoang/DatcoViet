import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FeastCard } from "@/components/FeastCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import { menusAPI } from "@/services/api";
import { Dish } from "@/types";
import { useToast } from "@/hooks/use-toast";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const navigate = useNavigate();
  const { toast } = useToast();

  const categories = ["Tất cả", "Mâm Cỗ", "Món Ăn"];

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const allMenus = await menusAPI.getAllMenus();
      
      // Filter results based on search query
      const filteredResults = allMenus.filter(menu => {
        const matchesSearch = 
          menu.name.toLowerCase().includes(query.toLowerCase()) ||
          (menu.description && menu.description.toLowerCase().includes(query.toLowerCase())) ||
          menu.category.toLowerCase().includes(query.toLowerCase());
        
        return matchesSearch && menu.isAvailable;
      });

      setResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải kết quả tìm kiếm",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = selectedCategory === "Tất cả" 
    ? results
    : results.filter(item => {
        if (selectedCategory === "Mâm Cỗ") {
          const menuId = Number(item.id);
          return menuId >= 37 && menuId <= 41;
        } else if (selectedCategory === "Món Ăn") {
          const menuId = Number(item.id);
          return menuId < 37 || menuId > 41;
        }
        return true;
      });

  const handleViewDetails = (id: string) => {
    const menuId = Number(id);
    if (menuId >= 37 && menuId <= 41) {
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
              onClick={() => handleViewDetails(dish.id)}
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Đang tìm kiếm...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">
            Kết quả tìm kiếm cho "{query}"
          </h1>
        </div>
        
        <p className="text-muted-foreground">
          Tìm thấy {filteredResults.length} kết quả
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
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

      {/* Results */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => {
            const menuId = Number(item.id);
            const isFeastSet = menuId >= 37 && menuId <= 41;
            
            if (isFeastSet) {
              return (
                <FeastCard
                  key={item.id}
                  feastSet={{
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    price: item.price,
                    category: item.category,
                    dishes: [],
                    servings: 4,
                    isPopular: true,
                    rating: 4.8,
                    reviewCount: 124,
                    isActive: item.isAvailable,
                    tags: [],
                  }}
                  onViewDetails={() => handleViewDetails(item.id)}
                />
              );
            } else {
              return <DishCard key={item.id} dish={item} />;
            }
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Không tìm thấy kết quả nào
          </h3>
          <p className="text-muted-foreground mb-6">
            Hãy thử tìm kiếm với từ khóa khác hoặc duyệt thực đơn của chúng tôi
          </p>
          <Button 
            variant="hero"
            onClick={() => navigate('/menu')}
          >
            Xem thực đơn
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
