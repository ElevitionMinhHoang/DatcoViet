import { Bell, Info } from "lucide-react";

const NotificationsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Thông báo</h1>
        
        <div className="bg-card rounded-lg border p-6">
          <div className="text-center py-8">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không có thông báo</h2>
            <p className="text-muted-foreground">
              Bạn chưa có thông báo nào. Thông báo về đơn hàng sẽ xuất hiện ở đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;