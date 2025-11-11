import AdminLayout from "@/components/layout/AdminLayout";
import { BarChart3, TrendingUp, Users, Package, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReportsPage = () => {
  return (
    <AdminLayout title="Báo cáo & Thống kê">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Tháng 9/2024
          </Button>
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
              <div className="text-2xl font-bold">25.450.000đ</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> so với tháng trước
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
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.3%</span> so với tháng trước
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
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.6%</span> so với tháng trước
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
              <div className="text-2xl font-bold">163.000đ</div>
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
              <div className="h-80 bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>Biểu đồ doanh thu sẽ hiển thị tại đây</p>
                  <p className="text-sm">(Dữ liệu demo)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Đơn hàng theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-2" />
                  <p>Biểu đồ đơn hàng sẽ hiển thị tại đây</p>
                  <p className="text-sm">(Dữ liệu demo)</p>
                </div>
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
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Phở bò</div>
                    <div className="text-sm text-muted-foreground">Món chính</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">45 đơn</div>
                  <div className="text-sm text-muted-foreground">12.450.000đ</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-primary font-semibold">2</span>
                  </div>
                  <div>
                    <div className="font-medium">Bún chả</div>
                    <div className="text-sm text-muted-foreground">Món chính</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">38 đơn</div>
                  <div className="text-sm text-muted-foreground">10.260.000đ</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-primary font-semibold">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Gà rang muối</div>
                    <div className="text-sm text-muted-foreground">Món chính</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">32 đơn</div>
                  <div className="text-sm text-muted-foreground">9.280.000đ</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-primary font-semibold">4</span>
                  </div>
                  <div>
                    <div className="font-medium">Nem rán</div>
                    <div className="text-sm text-muted-foreground">Khai vị</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">28 đơn</div>
                  <div className="text-sm text-muted-foreground">5.880.000đ</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-primary font-semibold">5</span>
                  </div>
                  <div>
                    <div className="font-medium">Canh chua cá lóc</div>
                    <div className="text-sm text-muted-foreground">Món canh</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">25 đơn</div>
                  <div className="text-sm text-muted-foreground">6.250.000đ</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Xuất báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                Xuất Excel
              </Button>
              <Button variant="outline" className="flex-1">
                Xuất PDF
              </Button>
              <Button variant="outline" className="flex-1">
                In báo cáo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;