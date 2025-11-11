import AdminLayout from "@/components/layout/AdminLayout";
import { Package, Search, Filter, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const OrderManagementPage = () => {
  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        </div>
          
          {/* Filters and Search */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc
              </Button>
            </div>
            
            <div className="flex gap-2 mt-4 overflow-x-auto">
              <Button variant="outline" size="sm">Tất cả</Button>
              <Button variant="outline" size="sm">Chờ xác nhận</Button>
              <Button variant="outline" size="sm">Đang chuẩn bị</Button>
              <Button variant="outline" size="sm">Đang giao</Button>
              <Button variant="outline" size="sm">Hoàn thành</Button>
              <Button variant="outline" size="sm">Đã hủy</Button>
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
                  <tr className="border-b">
                    <td className="py-3 px-4 font-mono">#DH001</td>
                    <td className="py-3 px-4">Nguyễn Văn An</td>
                    <td className="py-3 px-4">450.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" />
                        Chờ xác nhận
                      </span>
                    </td>
                    <td className="py-3 px-4">15/09/2024</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b">
                    <td className="py-3 px-4 font-mono">#DH002</td>
                    <td className="py-3 px-4">Trần Thị Bình</td>
                    <td className="py-3 px-4">320.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1 w-fit">
                        <Package className="w-3 h-3" />
                        Đang chuẩn bị
                      </span>
                    </td>
                    <td className="py-3 px-4">14/09/2024</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                  
                  <tr className="border-b">
                    <td className="py-3 px-4 font-mono">#DH003</td>
                    <td className="py-3 px-4">Lê Văn Cường</td>
                    <td className="py-3 px-4">280.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        Hoàn thành
                      </span>
                    </td>
                    <td className="py-3 px-4">13/09/2024</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị 3 trên 45 đơn hàng
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Trước</Button>
                <Button variant="outline" size="sm">Sau</Button>
              </div>
            </div>
          </div>
      </div>
    </AdminLayout>
  );
};

export default OrderManagementPage;