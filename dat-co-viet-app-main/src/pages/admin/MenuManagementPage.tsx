import AdminLayout from "@/components/layout/AdminLayout";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const MenuManagementPage = () => {
  return (
    <AdminLayout title="Quản lý thực đơn">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quản lý thực đơn</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm món mới
          </Button>
        </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Món ăn</th>
                    <th className="text-left py-3 px-4">Loại</th>
                    <th className="text-left py-3 px-4">Giá</th>
                    <th className="text-left py-3 px-4">Trạng thái</th>
                    <th className="text-right py-3 px-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">Phở bò</div>
                          <div className="text-sm text-muted-foreground">Truyền thống</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">Món chính</td>
                    <td className="py-3 px-4">45.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Hiển thị
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">Bún chả</div>
                          <div className="text-sm text-muted-foreground">Đặc sản Hà Nội</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">Món chính</td>
                    <td className="py-3 px-4">40.000đ</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Hiển thị
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Hiển thị 2 trên 25 món ăn
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

export default MenuManagementPage;