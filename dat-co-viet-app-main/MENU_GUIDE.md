# Hướng dẫn Mega Menu - Hoa Nắng

## Tổng quan

Mega menu đã được triển khai với các tính năng sau:

### 1. Desktop Navigation (`DesktopNav.tsx`)
- **Menu lớn đa cấp**: Hiển thị trên màn hình desktop
- **Dropdown menu**: Di chuột vào "Thực đơn" để xem các tùy chọn
- **Submenu**: Mỗi mục có thể có submenu con (hiển thị khi di chuột)
- **Icon**: Mỗi mục menu có icon riêng biệt
- **Hiệu ứng hover**: Animation mượt mà với shadow và transition

### 2. Mobile Navigation (`MobileNav.tsx`)
- **Menu đơn giản**: Hiển thị trên thiết bị di động
- **Mô tả ngắn**: Mỗi mục có mô tả ngắn gọn
- **Icon**: Đồng bộ với desktop navigation

## Cấu trúc Menu

### Menu chính
- **Trang chủ**: Liên kết đến trang chủ
- **Thực đơn**: Menu dropdown với 3 mục chính
- **Giới thiệu**: Liên kết đến trang giới thiệu
- **Liên hệ**: Liên kết đến trang liên hệ

### Submenu "Thực đơn"
1. **Mâm cỗ đặc biệt** (ChefHat icon)
   - Mâm cỗ gia đình
   - Mâm cỗ tiệc tùng
   - Mâm cỗ lễ tết

2. **Món ăn lẻ** (Salad icon)
   - Món khai vị
   - Món chính
   - Món tráng miệng

3. **Đồ uống** (GlassWater icon)
   - Trà các loại
   - Nước ép trái cây
   - Rượu & Bia

## Cách sử dụng

### Trên Desktop
1. Di chuột vào "Thực đơn" để mở mega menu
2. Di chuột vào các mục có mũi tên › để xem submenu
3. Click vào bất kỳ mục nào để điều hướng

### Trên Mobile
1. Nhấn nút menu (☰) trên header
2. Chọn mục menu từ danh sách
3. Menu sẽ tự động đóng sau khi chọn

## Demo

Truy cập `/menu-demo` để xem demo đầy đủ:
- Hiển thị cả desktop và mobile navigation
- Hướng dẫn sử dụng chi tiết
- Preview trực quan

## Tùy chỉnh

### Thêm mục menu mới
1. Mở file `DesktopNav.tsx`
2. Thêm vào object `menuItems`
3. Thêm vào array `navItems` trong `MobileNav.tsx`

### Thay đổi icon
Sử dụng các icon từ Lucide React:
```typescript
import { Home, Utensils, Info, Phone, ChefHat, GlassWater, Salad } from "lucide-react";
```

### Tùy chỉnh style
Các class CSS tùy chỉnh trong `index.css`:
- `.navigation-menu-trigger`: Style cho trigger
- `.navigation-menu-content`: Style cho dropdown
- `.menu-item-hover`: Hiệu ứng hover

## Technical Details

- **Framework**: React + TypeScript
- **UI Library**: shadcn/ui với Radix UI
- **Navigation**: React Router
- **Icons**: Lucide React
- **Styling**: Tailwind CSS với custom design system

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support  
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support