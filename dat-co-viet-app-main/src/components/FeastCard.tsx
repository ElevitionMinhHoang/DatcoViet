import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock } from "lucide-react";
import { FeastSet } from "@/types";

interface FeastCardProps {
  feastSet: FeastSet;
  onViewDetails: (id: string) => void;
}

export function FeastCard({ feastSet, onViewDetails }: FeastCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderRating = () => {
    if (feastSet.reviewCount === 0) {
      return (
        <>
          <Star className="w-4 h-4 text-gray-300" />
          <span className="font-medium">0.0</span>
          <span className="text-muted-foreground text-sm">Chưa có đánh giá</span>
        </>
      );
    }
    return (
      <>
        <Star className="w-4 h-4 fill-secondary text-secondary" />
        <span className="font-medium">{feastSet.rating}</span>
        <span className="text-muted-foreground">({feastSet.reviewCount})</span>
      </>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-warm transition-smooth cursor-pointer group">
      <div className="relative">
        <img
          src={feastSet.image}
          alt={feastSet.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        {feastSet.isPopular && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Phổ biến
          </Badge>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 px-2 py-1 rounded-full text-sm">
          {renderRating()}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-smooth">
            {feastSet.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {feastSet.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{feastSet.servings} người</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>2-3 giờ</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(feastSet.price)}
              </span>
              <span className="text-muted-foreground text-sm ml-1">/ mâm</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          variant="hero"
          className="w-full"
          onClick={() => onViewDetails(feastSet.id)}
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}