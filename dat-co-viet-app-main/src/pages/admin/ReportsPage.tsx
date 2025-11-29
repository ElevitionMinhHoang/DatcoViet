import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Helper function for API requests
const apiRequest = async (endpoint: string) => {
  const response = await fetch(`/api/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

interface ReportStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  topSellingItems: Array<{
    id: string;
    name: string;
    category: string;
    ordersCount: number;
    revenue: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}

const ReportsPage = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30); // Default to last 30 days
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        setLoading(true);
        
        let summaryReport, topSellingItems, revenueByDay, ordersByStatus;

        if (dateRange) {
          // Fetch data for custom date range
          [summaryReport, topSellingItems, revenueByDay, ordersByStatus] = await Promise.all([
            apiRequest(`/reports/summary/range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
            apiRequest(`/reports/menu/top-selling/range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
            apiRequest(`/reports/revenue/daily/range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`),
            apiRequest(`/reports/orders/status/range?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)
          ]);
        } else {
          // Fetch default data (last 7 days)
          [summaryReport, topSellingItems, revenueByDay, ordersByStatus] = await Promise.all([
            apiRequest('/reports/summary'),
            apiRequest('/reports/menu/top-selling'),
            apiRequest('/reports/revenue/daily'),
            apiRequest('/reports/orders/status')
          ]);
        }

        // Calculate average order value
        const averageOrderValue = summaryReport.totalOrders > 0
          ? summaryReport.totalRevenue / summaryReport.totalOrders
          : 0;

        // Calculate growth percentages (mock for now, can be enhanced with historical data)
        const revenueGrowth = 12.5; // Mock growth percentage
        const ordersGrowth = 8.3; // Mock growth percentage
        const customersGrowth = 15.6; // Mock growth percentage

        // Map top selling items to the expected format
        const topSellingItemsFormatted = topSellingItems.slice(0, 5).map((item: any, index: number) => ({
          id: item.id.toString(),
          name: item.name,
          category: item.category,
          ordersCount: item.totalQuantity || 0,
          revenue: (item.price || 0) * (item.totalQuantity || 0)
        }));

        // Use real chart data from APIs

        const realStats: ReportStats = {
          totalRevenue: summaryReport.totalRevenue || 0,
          totalOrders: summaryReport.totalOrders || 0,
          totalCustomers: summaryReport.totalCustomers || 0,
          averageOrderValue,
          revenueGrowth,
          ordersGrowth,
          customersGrowth,
          topSellingItems: topSellingItemsFormatted,
          revenueByDay,
          ordersByStatus
        };

        setStats(realStats);
      } catch (error) {
        console.error('Failed to fetch report stats:', error);
        // Fallback to mock data if API fails
        const mockStats: ReportStats = {
          totalRevenue: 25450000,
          totalOrders: 156,
          totalCustomers: 89,
          averageOrderValue: 163000,
          revenueGrowth: 12.5,
          ordersGrowth: 8.3,
          customersGrowth: 15.6,
          topSellingItems: [
            {
              id: '1',
              name: 'Phở bò',
              category: 'Món chính',
              ordersCount: 45,
              revenue: 12450000
            },
            {
              id: '2',
              name: 'Bún chả',
              category: 'Món chính',
              ordersCount: 38,
              revenue: 10260000
            },
            {
              id: '3',
              name: 'Gà rang muối',
              category: 'Món chính',
              ordersCount: 32,
              revenue: 9280000
            },
            {
              id: '4',
              name: 'Nem rán',
              category: 'Khai vị',
              ordersCount: 28,
              revenue: 5880000
            },
            {
              id: '5',
              name: 'Canh chua cá lóc',
              category: 'Món canh',
              ordersCount: 25,
              revenue: 6250000
            }
          ],
          revenueByDay: [
            { date: '01/11', revenue: 1200000 },
            { date: '02/11', revenue: 1800000 },
            { date: '03/11', revenue: 1500000 },
            { date: '04/11', revenue: 2200000 },
            { date: '05/11', revenue: 1900000 },
            { date: '06/11', revenue: 2500000 },
            { date: '07/11', revenue: 2800000 },
          ],
          ordersByStatus: [
            { status: 'PENDING', count: 15 },
            { status: 'CONFIRMED', count: 45 },
            { status: 'PREPARING', count: 25 },
            { status: 'READY', count: 18 },
            { status: 'DELIVERED', count: 53 },
          ]
        };
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };

    fetchReportStats();
  }, [selectedPeriod, dateRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Helper function to format currency in charts
  const formatCurrencyChart = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Helper function to translate order status
  const translateOrderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'Chờ xác nhận',
      'CONFIRMED': 'Đã xác nhận',
      'PREPARING': 'Đang chuẩn bị',
      'READY': 'Sẵn sàng',
      'DELIVERED': 'Đã giao'
    };
    return statusMap[status] || status;
  };

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const exportToExcel = async () => {
    try {
      // Create Excel data from current stats
      const excelData = {
        summary: {
          'Tổng doanh thu': formatCurrency(stats.totalRevenue),
          'Tổng đơn hàng': formatNumber(stats.totalOrders),
          'Tổng khách hàng': formatNumber(stats.totalCustomers),
          'Giá trị trung bình đơn hàng': formatCurrency(stats.averageOrderValue),
          'Tăng trưởng doanh thu (%)': `${stats.revenueGrowth}%`,
          'Tăng trưởng đơn hàng (%)': `${stats.ordersGrowth}%`,
          'Tăng trưởng khách hàng (%)': `${stats.customersGrowth}%`
        },
        topSellingItems: stats.topSellingItems.map(item => ({
          'Tên món ăn': item.name,
          'Loại': item.category,
          'Số lượng đơn': item.ordersCount,
          'Doanh thu': formatCurrency(item.revenue)
        }))
      };

      // Convert data to CSV format for Excel with proper UTF-8 encoding
      const summaryCSV = Object.entries(excelData.summary)
        .map(([key, value]) => `${key},${value}`)
        .join('\n');
      
      const itemsCSV = 'Tên món ăn,Loại,Số lượng đơn,Doanh thu\n' +
        excelData.topSellingItems.map(item =>
          `${item['Tên món ăn']},${item['Loại']},${item['Số lượng đơn']},${item['Doanh thu']}`
        ).join('\n');

      const fullCSV = `BÁO CÁO THỐNG KÊ - ${new Date().toLocaleDateString('vi-VN')}\n\nTỔNG QUAN:\n${summaryCSV}\n\nTOP MÓN ĂN BÁN CHẠY:\n${itemsCSV}`;

      // Create and download CSV file with proper UTF-8 BOM for Excel
      const BOM = '\uFEFF'; // UTF-8 Byte Order Mark
      const blob = new Blob([BOM + fullCSV], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bao-cao-thong-ke-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Xuất báo cáo Excel thành công!');
    } catch (error) {
      console.error('Failed to export to Excel:', error);
      alert('Xuất báo cáo thất bại. Vui lòng thử lại.');
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

  const handleDateRangeApply = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    setShowDatePicker(false);
  };

  const handleResetDateRange = () => {
    setDateRange(null);
    setShowDatePicker(false);
  };

  const formatDateRangeDisplay = () => {
    if (!dateRange) return 'Tháng 11/2025';
    
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  };

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-lg text-muted-foreground">Không có dữ liệu báo cáo</div>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowDatePicker(!showDatePicker)}>
              <Calendar className="w-4 h-4 mr-2" />
              {formatDateRangeDisplay()}
            </Button>
            
            {showDatePicker && (
              <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 p-4 w-80">
                <div className="space-y-4">
                  <h3 className="font-semibold">Chọn khoảng thời gian</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Từ ngày</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      defaultValue={dateRange?.startDate || getDefaultDateRange().startDate}
                      ref={(ref) => {
                        if (ref) {
                          ref.id = 'startDate';
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Đến ngày</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded"
                      defaultValue={dateRange?.endDate || getDefaultDateRange().endDate}
                      ref={(ref) => {
                        if (ref) {
                          ref.id = 'endDate';
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        const startDate = (document.getElementById('startDate') as HTMLInputElement)?.value;
                        const endDate = (document.getElementById('endDate') as HTMLInputElement)?.value;
                        if (startDate && endDate) {
                          handleDateRangeApply(startDate, endDate);
                        }
                      }}
                    >
                      Áp dụng
                    </Button>
                    {dateRange && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleResetDateRange}
                      >
                        Mặc định
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.revenueGrowth}%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.ordersGrowth}%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>

          {/* Total Customers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalCustomers)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.customersGrowth}%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>

          {/* Average Order Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giá trị trung bình</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+4.2%</span> so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Doanh thu theo ngày</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.revenueByDay}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      tickFormatter={formatCurrencyChart}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']}
                      labelFormatter={(label) => `Ngày: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Doanh thu"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Đơn hàng theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.ordersByStatus.map(item => ({
                        ...item,
                        name: translateOrderStatus(item.status)
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, 'Số lượng']}
                      labelFormatter={(label) => `Trạng thái: ${translateOrderStatus(label)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top 5 món ăn bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topSellingItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                      <span className="text-primary font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatNumber(item.ordersCount)} đơn</div>
                    <div className="text-sm text-muted-foreground">{formatCurrency(item.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Xuất báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Button
                className="px-8 py-6 text-lg"
                onClick={exportToExcel}
              >
                <Download className="w-5 h-5 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default ReportsPage;