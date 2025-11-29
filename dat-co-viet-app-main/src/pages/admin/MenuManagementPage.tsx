import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Utensils, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from '@/services/api';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
  image: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  preparationTime?: number;
  tags?: string[];
  unit: string;
}

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    category: 'Món Ăn',
    price: 0,
    image: '',
    isAvailable: true,
    unit: 'phần',
    preparationTime: 30,
    isVegetarian: false,
    isSpicy: false,
    tags: [] as string[]
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await api.menus.getAllMenus();
        // Map Dish[] to MenuItem[]
        const menuItemsData = data.map(dish => ({
          ...dish,
          status: dish.isAvailable ? 'ACTIVE' : 'INACTIVE'
        }));
        setMenuItems(menuItemsData);
        setFilteredItems(menuItemsData);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, categoryFilter, menuItems]);

  const getStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
      OUT_OF_STOCK: 'destructive'
    };
    return variants[status] || 'outline';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Hiển thị',
      INACTIVE: 'Ẩn',
      OUT_OF_STOCK: 'Hết hàng'
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getCategories = () => {
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories;
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      try {
        // TODO: Add delete API endpoint
        // await api.menus.deleteMenuItem(itemId);
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      // TODO: Add update status API endpoint
      // await api.menus.updateMenuItemStatus(itemId, newStatus);
      setMenuItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Failed to update menu item status:', error);
    }
  };

  const handleAddMenuItem = async () => {
    try {
      // Create menu item data matching backend CreateMenuDto
      const menuData = {
        name: newMenuItem.name,
        price: newMenuItem.price,
        category: newMenuItem.category,
        image: newMenuItem.image || 'https://example.com/placeholder.jpg',
        isActive: newMenuItem.isAvailable
      };

      const createdItem = await api.menus.createMenuItem(menuData);
      
      // Add the new item to the list
      const newItem: MenuItem = {
        id: createdItem.id.toString(),
        name: createdItem.name,
        description: newMenuItem.description || `${createdItem.name} - Món ăn truyền thống Việt Nam`,
        category: createdItem.category,
        price: createdItem.price,
        isAvailable: createdItem.isActive,
        image: createdItem.image,
        unit: newMenuItem.unit,
        preparationTime: newMenuItem.preparationTime,
        isVegetarian: newMenuItem.isVegetarian,
        isSpicy: newMenuItem.isSpicy,
        tags: newMenuItem.tags
      };

      setMenuItems(prev => [...prev, newItem]);
      setShowAddModal(false);
      
      // Reset form
      setNewMenuItem({
        name: '',
        description: '',
        category: 'Món Ăn',
        price: 0,
        image: '',
        isAvailable: true,
        unit: 'phần',
        preparationTime: 30,
        isVegetarian: false,
        isSpicy: false,
        tags: []
      });
    } catch (error) {
      console.error('Failed to add menu item:', error);
      alert('Thêm món mới thất bại. Vui lòng thử lại.');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;

    try {
      // Create update data matching backend UpdateMenuDto
      const updateData = {
        name: editingItem.name,
        price: editingItem.price,
        category: editingItem.category,
        image: editingItem.image || 'https://example.com/placeholder.jpg',
        isActive: editingItem.isAvailable
      };

      await api.menus.updateMenuItem(editingItem.id, updateData);
      
      // Update the item in the list
      setMenuItems(prev =>
        prev.map(item =>
          item.id === editingItem.id ? editingItem : item
        )
      );
      setShowEditModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update menu item:', error);
      alert('Cập nhật món ăn thất bại. Vui lòng thử lại.');
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
        <h1 className="text-3xl font-bold">Quản lý thực đơn</h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm món mới
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm món ăn theo tên, mô tả hoặc tag..."
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
        
        <div className="flex gap-2 mt-4 overflow-x-auto">
          <Button 
            variant={categoryFilter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setCategoryFilter('all')}
          >
            Tất cả
          </Button>
          {getCategories().map(category => (
            <Button 
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
        
      <div className="bg-card rounded-lg border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Món ăn</th>
                <th className="text-left py-3 px-4">Loại</th>
                <th className="text-left py-3 px-4">Giá</th>
                <th className="text-left py-3 px-4">Thời gian chuẩn bị</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-right py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' ? 'Không tìm thấy món ăn nào phù hợp' : 'Chưa có món ăn nào'}
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <Utensils className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {item.isVegetarian && (
                              <Badge variant="outline" className="text-xs">
                                Chay
                              </Badge>
                            )}
                            {item.isSpicy && (
                              <Badge variant="outline" className="text-xs">
                                Cay
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-4">{item.preparationTime} phút</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusVariant(item.isAvailable ? 'ACTIVE' : 'INACTIVE')}>
                        {getStatusLabel(item.isAvailable ? 'ACTIVE' : 'INACTIVE')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filteredItems.length} trên {menuItems.length} món ăn
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Trước</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Thêm món ăn mới</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên món ăn *</label>
                <Input
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên món ăn"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả món ăn"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Loại món ăn *</label>
                <select
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="Món Ăn">Món Ăn</option>
                  <option value="Món Chay">Món Chay</option>
                  <option value="Món Nước">Món Nước</option>
                  <option value="Món Tráng Miệng">Món Tráng Miệng</option>
                  <option value="Đồ Uống">Đồ Uống</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Giá (VND) *</label>
                <Input
                  type="number"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="Nhập giá món ăn"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL hình ảnh</label>
                <Input
                  value={newMenuItem.image}
                  onChange={(e) => setNewMenuItem(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newMenuItem.isAvailable}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm">Hiển thị</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newMenuItem.isVegetarian}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm">Chay</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newMenuItem.isSpicy}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, isSpicy: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm">Cay</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddMenuItem}
                disabled={!newMenuItem.name || !newMenuItem.price}
              >
                Thêm món
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa món ăn</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên món ăn *</label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                  placeholder="Nhập tên món ăn"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  value={editingItem.description}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Nhập mô tả món ăn"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Loại món ăn *</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="Món Ăn">Món Ăn</option>
                  <option value="Món Chay">Món Chay</option>
                  <option value="Món Nước">Món Nước</option>
                  <option value="Món Tráng Miệng">Món Tráng Miệng</option>
                  <option value="Đồ Uống">Đồ Uống</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Giá (VND) *</label>
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                  placeholder="Nhập giá món ăn"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL hình ảnh</label>
                <Input
                  value={editingItem.image}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, image: e.target.value } : null)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, isAvailable: e.target.checked } : null)}
                    className="mr-2"
                  />
                  <label className="text-sm">Hiển thị</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingItem.isVegetarian || false}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, isVegetarian: e.target.checked } : null)}
                    className="mr-2"
                  />
                  <label className="text-sm">Chay</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingItem.isSpicy || false}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, isSpicy: e.target.checked } : null)}
                    className="mr-2"
                  />
                  <label className="text-sm">Cay</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                Hủy
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpdateMenuItem}
                disabled={!editingItem.name || !editingItem.price}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;