import { Layout } from "@/components/layout/Layout";
import { Truck, Clock } from "lucide-react";

const DeliveryPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Đơn hàng đang giao</h1>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="text-center py-8">
              <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Không có đơn hàng đang giao</h2>
              <p className="text-muted-foreground">
                Hiện không có đơn hàng nào đang được giao đến bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeliveryPage;