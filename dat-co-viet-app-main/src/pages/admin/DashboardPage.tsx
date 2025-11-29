import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Package, DollarSign, CreditCard } from "lucide-react";
import api from '@/services/api';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: number;
  ordersByStatus: Record<string, number>;
  usersByRole: Record<string, number>;
  paymentStats?: {
    totalPayments: number;
    totalRevenue: number;
    recentPayments: number;
    paymentsByStatus: Record<string, number>;
  };
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [userStats, orderStats, paymentStats] = await Promise.all([
          api.admin.getUserStats(),
          api.admin.getOrderStats(),
          api.admin.getPaymentStats()
        ]);

        setStats({
          totalUsers: userStats.totalUsers,
          totalOrders: orderStats.totalOrders,
          totalRevenue: orderStats.totalRevenue,
          recentUsers: userStats.recentUsers,
          ordersByStatus: orderStats.ordersByStatus,
          usersByRole: userStats.usersByRole,
          paymentStats: paymentStats
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusLabel = (status: string): string => {
    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      CANCELLED: 'Đã hủy',
      COMPLETED: 'Hoàn thành'
    };
    return statusLabels[status] || status;
  };

  const getRoleLabel = (role: string): string => {
    const roleLabels: Record<string, string> = {
      USER: 'Người dùng',
      ADMIN: 'Quản trị viên',
      CSKH: 'Chăm sóc khách hàng',
      SHIPPER: 'Người giao hàng',
      MANAGER: 'Quản lý'
    };
    return roleLabels[role] || role;
  };

  const getPaymentStatusLabel = (status: string): string => {
    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ xử lý',
      SUCCESS: 'Thành công',
      FAILED: 'Thất bại',
      REFUNDED: 'Đã hoàn tiền'
    };
    return statusLabels[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats?.paymentStats?.totalRevenue || stats?.totalRevenue || 0),
      description: "Tổng doanh thu từ thanh toán thành công",
      icon: DollarSign,
    },
    {
      title: "Tổng đơn hàng",
      value: stats?.totalOrders?.toString() || "0",
      description: "Tổng số đơn hàng trong hệ thống",
      icon: Package,
    },
    {
      title: "Tổng thanh toán",
      value: stats?.paymentStats?.totalPayments?.toString() || "0",
      description: "Tổng số giao dịch thanh toán",
      icon: CreditCard,
    },
    {
      title: "Người dùng mới (7 ngày)",
      value: stats?.recentUsers?.toString() || "0",
      description: "Người dùng đăng ký trong 7 ngày qua",
      icon: BarChart3,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Quản trị</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan về hoạt động của hệ thống
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê đơn hàng theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{getStatusLabel(status)}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê người dùng theo vai trò</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.usersByRole && Object.entries(stats.usersByRole).map(([role, count]) => (
                <div key={role} className="flex justify-between">
                  <span>{getRoleLabel(role)}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.paymentStats?.paymentsByStatus && Object.entries(stats.paymentStats.paymentsByStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{getPaymentStatusLabel(status)}:</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {stats?.paymentStats && (
                <>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Tổng thanh toán:</span>
                    <span className="font-medium">{stats.paymentStats.totalPayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Doanh thu:</span>
                    <span className="font-medium">{formatCurrency(stats.paymentStats.totalRevenue)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;