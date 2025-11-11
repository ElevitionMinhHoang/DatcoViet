import AdminLayout from "@/components/layout/AdminLayout";
import { ChefHat, Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ComboManagementPage = () => {
  return (
    <AdminLayout title="Quản lý combo">
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
                placeholder="Tìm kiếm combo..."
                className="pl-10"
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
          {/* Combo Card 1 */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Mâm cỗ gia đình</h3>
                <p className="text-sm text-muted-foreground">4-6 người</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giá gốc:</span>
                <span className="text-sm line-through">800.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giá khuyến mãi:</span>
                <span className="font-semibold text-primary">650.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Số món:</span>
                <span className="text-sm">8 món</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Sửa
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>
            </div>
          </div>

          {/* Combo Card 2 */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Mâm cỗ tiệc</h3>
                <p className="text-sm text-muted-foreground">8-10 người</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giá gốc:</span>
                <span className="text-sm line-through">1.200.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giá khuyến mãi:</span>
                <span className="font-semibold text-primary">950.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Số món:</span>
                <span className="text-sm">12 món</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Sửa
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>
            </div>
          </div>

          {/* Combo Card 3 */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Mâm cỗ đặc biệt</h3>
                <p className="text-sm text-muted-foreground">12-15 người</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giá gốc:</span>
                <span className="text-sm line-through">1.800.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Giá khuyến mãi:</span>
                <span className="font-semibold text-primary">1.450.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Số món:</span>
                <span className="text-sm">15 món</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Sửa
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa
              </Button>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Trước</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Sau</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ComboManagementPage;