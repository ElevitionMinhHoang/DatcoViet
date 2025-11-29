import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from '@/services/api';

interface Combo {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  servings: number;
  category: string;
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
  tags?: string[];
  dishes?: any[];
}

const ComboManagementPage = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        setLoading(true);
        const data = await api.feastSets.getAllFeastSets();
        setCombos(data);
      } catch (error) {
        console.error('Failed to fetch combos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const filteredCombos = combos.filter(combo =>
    combo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDeleteCombo = async (comboId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa combo này?')) {
      try {
        // TODO: Add delete API endpoint
        // await api.feastSets.deleteFeastSet(comboId);
        setCombos(prev => prev.filter(combo => combo.id !== comboId));
      } catch (error) {
        console.error('Failed to delete combo:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý combo & gói cỗ</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm combo mới
          </Button>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm combo theo tên, mô tả hoặc tag..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm ? 'Không tìm thấy combo nào phù hợp' : 'Chưa có combo nào'}
              </div>
            </div>
          ) : (
            filteredCombos.map((combo) => (
              <div key={combo.id} className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    {combo.image ? (
                      <img 
                        src={combo.image} 
                        alt={combo.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <ChefHat className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{combo.name}</h3>
                    <p className="text-sm text-muted-foreground">{combo.servings} người</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Giá:</span>
                    <span className="font-semibold text-primary">{formatCurrency(combo.price)}</span>
                  </div>
                  {combo.originalPrice && combo.originalPrice > combo.price && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Giá gốc:</span>
                      <span className="text-sm line-through">{formatCurrency(combo.originalPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Danh mục:</span>
                    <span className="text-sm">{combo.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Đánh giá:</span>
                    <span className="text-sm">
                      ⭐ {combo.rating} ({combo.reviewCount} đánh giá)
                    </span>
                  </div>
                  {combo.tags && combo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {combo.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {combo.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +{combo.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeleteCombo(combo.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredCombos.length > 0 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Trước</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Sau</Button>
            </div>
          </div>
        )}
      </div>
  );
};

export default ComboManagementPage;