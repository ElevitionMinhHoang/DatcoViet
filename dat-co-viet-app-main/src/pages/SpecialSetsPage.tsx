import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { FeastCard } from "@/components/FeastCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid, List } from "lucide-react";
import { feastSets } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function SpecialSetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const categories = ["Tất cả", "Gia đình", "Tiệc cưới", "Giỗ tổ tiên", "Thôi nôi", "Lễ Tết", "Doanh nghiệp", "Món chay"];

  const filteredSets = feastSets.filter(set => {
    const matchesSearch = set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         set.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || set.category === selectedCategory;
    return matchesSearch && matchesCategory && set.isActive;
  });

  const handleViewDetails = (id: string) => {
    navigate(`/menu/sets/${id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mâm Cỗ Đặc Biệt
          </h1>
          <p className="text-muted-foreground">
            Những mâm cỗ được thiết kế riêng cho những dịp trọng đại
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm mâm cỗ..."
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

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 max-w-2xl mx-auto'
        }`}>
          {filteredSets.map((feastSet) => (
            <FeastCard
              key={feastSet.id}
              feastSet={feastSet}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredSets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy mâm cỗ nào phù hợp
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}