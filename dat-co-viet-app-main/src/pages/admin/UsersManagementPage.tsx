import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, Calendar, Package, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  orderCount: number;
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  passwordChangedAt: string | null;
  passwordChangeCount: number;
  orderCount: number;
  totalSpent: number;
  orders: Array<{
    id: number;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{
      id: number;
      quantity: number;
      price: number;
      menu: {
        id: number;
        name: string;
        price: number;
        category: string;
      };
    }>;
  }>;
}

const UsersManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api.admin.getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      USER: 'Người dùng',
      ADMIN: 'Quản trị viên',
      CSKH: 'Chăm sóc khách hàng',
      SHIPPER: 'Người giao hàng',
      MANAGER: 'Quản lý'
    };
    return roleLabels[role] || role;
  };

  const getRoleVariant = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ADMIN: 'destructive',
      MANAGER: 'default',
      CSKH: 'secondary',
      SHIPPER: 'outline',
      USER: 'outline'
    };
    return variants[role] || 'outline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PREPARING: 'Đang chuẩn bị',
      READY: 'Sẵn sàng',
      DELIVERING: 'Đang giao hàng',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy'
    };
    return statusLabels[status] || status;
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PENDING: 'outline',
      CONFIRMED: 'secondary',
      PREPARING: 'secondary',
      READY: 'default',
      DELIVERING: 'default',
      COMPLETED: 'outline',
      CANCELLED: 'destructive'
    };
    return variants[status] || 'outline';
  };

  const handleViewDetails = async (userId: number) => {
    try {
      setDetailLoading(true);
      const userDetail = await api.admin.getUserDetails(userId);
      setSelectedUser(userDetail);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    } finally {
      setDetailLoading(false);
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
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <div className="text-sm text-muted-foreground">
          Tổng cộng: {users.length} người dùng
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Tìm kiếm người dùng theo tên, email hoặc số điện thoại..."
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

      {/* Users Table */}
      <div className="bg-card rounded-lg border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Khách hàng</th>
                <th className="text-left py-3 px-4">Liên hệ</th>
                <th className="text-left py-3 px-4">Vai trò</th>
                <th className="text-left py-3 px-4">Ngày tham gia</th>
                <th className="text-left py-3 px-4">Tổng đơn hàng</th>
                <th className="text-right py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {searchTerm ? 'Không tìm thấy người dùng nào phù hợp' : 'Chưa có người dùng nào'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name || 'Chưa có tên'}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRoleVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{user.orderCount} đơn</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(user.id)}
                          disabled={detailLoading}
                        >
                          {detailLoading ? 'Đang tải...' : 'Xem chi tiết'}
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
            Hiển thị {filteredUsers.length} trên {users.length} người dùng
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Trước</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Chi tiết người dùng
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-medium">{selectedUser.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tên:</span>
                      <span className="font-medium">{selectedUser.name || 'Chưa có tên'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedUser.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số điện thoại:</span>
                      <span className="font-medium">{selectedUser.phone || 'Chưa có'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vai trò:</span>
                      <Badge variant={getRoleVariant(selectedUser.role)}>
                        {getRoleLabel(selectedUser.role)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tham gia:</span>
                      <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{selectedUser.orderCount}</div>
                  <div className="text-sm text-muted-foreground">Tổng đơn hàng</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{formatCurrency(selectedUser.totalSpent)}</div>
                  <div className="text-sm text-muted-foreground">Tổng chi tiêu</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-sm font-medium">{formatDate(selectedUser.createdAt)}</div>
                  <div className="text-sm text-muted-foreground">Ngày tham gia</div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
                {selectedUser.orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedUser.orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">Đơn hàng #{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDateTime(order.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(order.status)}>
                              {getStatusLabel(order.status)}
                            </Badge>
                            <div className="font-medium">{formatCurrency(order.total)}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.menu.name} × {item.quantity}
                              </span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagementPage;