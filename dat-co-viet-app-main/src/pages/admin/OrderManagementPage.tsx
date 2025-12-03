import React, { useState, useEffect } from 'react';
import { Package, Search, CheckCircle, Clock, XCircle, Truck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import api from '@/services/api';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
}

interface OrderItem {
  id: number;
  menu: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('Fetching orders from API...');
        const data = await api.admin.getOrders();
        console.log('API response data:', data);
        
        // Ensure data is an array
        const ordersArray = Array.isArray(data) ? data : [];
        
        // Transform data from backend to frontend format
        const transformedOrders = ordersArray.map((order: any) => ({
          id: order.id,
          orderNumber: `ORD${order.id.toString().padStart(4, '0')}`,
          customerName: order.user?.name || 'Khách hàng',
          totalAmount: order.total,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items || [],
          user: order.user
        }));
        
        console.log('Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusInfo = (status: string) => {
    const statusInfo: Record<string, { label: string; icon: React.ElementType; bgColor: string; textColor: string }> = {
      PENDING: {
        label: 'Chờ xác nhận',
        icon: Clock,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      },
      CONFIRMED: {
        label: 'Đã xác nhận',
        icon: CheckCircle,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      },
      PREPARING: {
        label: 'Đang chuẩn bị',
        icon: Package,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800'
      },
      DELIVERING: {
        label: 'Đang giao',
        icon: Truck,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800'
      },
      COMPLETED: {
        label: 'Hoàn thành',
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      },
      CANCELLED: {
        label: 'Đã hủy',
        icon: XCircle,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      }
    };

    return statusInfo[status] || {
      label: status,
      icon: Clock,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      // Update order status via API
      await api.admin.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <div className="text-sm text-muted-foreground">
            Tổng cộng: {orders.length} đơn hàng
          </div>
        </div>
          
        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng theo mã hoặc tên khách hàng..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Tất cả
            </Button>
            <Button 
              variant={statusFilter === 'PENDING' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('PENDING')}
            >
              Chờ xác nhận
            </Button>
             <Button 
               variant={statusFilter === 'CONFIRMED' ? 'default' : 'outline'} 
               size="sm"
               onClick={() => setStatusFilter('CONFIRMED')}
             >
               Đã xác nhận
             </Button>
            <Button 
              variant={statusFilter === 'PREPARING' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('PREPARING')}
            >
              Đang chuẩn bị
            </Button>
            <Button 
              variant={statusFilter === 'DELIVERING' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('DELIVERING')}
            >
              Đang giao
            </Button>
            <Button 
              variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('COMPLETED')}
            >
              Hoàn thành
            </Button>
            <Button 
              variant={statusFilter === 'CANCELLED' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('CANCELLED')}
            >
              Đã hủy
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-lg border p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Mã đơn</th>
                  <th className="text-left py-3 px-4">Khách hàng</th>
                  <th className="text-left py-3 px-4">Tổng tiền</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Ngày đặt</th>
                  <th className="text-right py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy đơn hàng nào phù hợp' : 'Chưa có đơn hàng nào'}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={order.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono">#{order.orderNumber}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">{formatCurrency(order.totalAmount)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs rounded-full flex items-center gap-1 w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDetailModal(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Chi tiết
                            </Button>
                            {order.status === 'PENDING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                              >
                                Xác nhận
                              </Button>
                            )}
                            {order.status === 'CONFIRMED' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'PREPARING')}
                              >
                                Bắt đầu chuẩn bị
                              </Button>
                            )}
                            {order.status === 'PREPARING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'DELIVERING')}
                              >
                                Giao hàng
                              </Button>
                            )}
                            {order.status === 'DELIVERING' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                              >
                                Hoàn thành
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredOrders.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredOrders.length)} trên {filteredOrders.length} đơn hàng (tổng {orders.length})
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Sau
              </Button>
            </div>
          </div>
        </div>

        {/* Order Detail Dialog */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết đơn hàng</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về đơn hàng và các món đã đặt.
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Mã đơn hàng</h3>
                    <p className="text-lg font-mono">#{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Ngày đặt</h3>
                    <p className="text-lg">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Khách hàng</h3>
                    <p className="text-lg">{selectedOrder.customerName}</p>
                    {selectedOrder.user?.email && (
                      <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Trạng thái</h3>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const statusInfo = getStatusInfo(selectedOrder.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <span className={`px-2 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs rounded-full flex items-center gap-1 w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Tổng tiền</h3>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Danh sách món đã đặt</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4">Món</th>
                          <th className="text-left py-3 px-4">Đơn giá</th>
                          <th className="text-left py-3 px-4">Số lượng</th>
                          <th className="text-left py-3 px-4">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-muted-foreground">
                              Không có món nào trong đơn hàng này.
                            </td>
                          </tr>
                        ) : (
                          selectedOrder.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-3 px-4">
                                <div className="font-medium">{item.menu?.name || 'Không xác định'}</div>
                              </td>
                              <td className="py-3 px-4">{formatCurrency(item.price)}</td>
                              <td className="py-3 px-4">{item.quantity}</td>
                              <td className="py-3 px-4 font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot className="bg-muted">
                        <tr>
                          <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                            Tổng cộng:
                          </td>
                          <td className="py-3 px-4 font-bold text-lg">
                            {formatCurrency(selectedOrder.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                    Đóng
                  </Button>
                  {selectedOrder.status === 'PENDING' && (
                    <Button onClick={() => {
                      handleStatusChange(selectedOrder.id, 'CONFIRMED');
                      setIsDetailModalOpen(false);
                    }}>
                      Xác nhận đơn hàng
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default OrderManagementPage;