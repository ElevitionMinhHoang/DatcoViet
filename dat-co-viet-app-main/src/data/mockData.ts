import { FeastSet, Dish, Review, Order, Conversation, Message } from '@/types';
import heroFeastImg from '@/assets/hero-feast.jpg';


export const dishes: Dish[] = [
  // Món khai vị
  {
    id: '1',
    name: 'Nem rán',
    description: 'Nem rán giòn rụm, nhân thịt và rau củ thơm ngon',
    image: "/images/dishes/nem_ran.jpg",
    price: 50000,
    category: 'Khai vị',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 20,
    ingredients: ['Thịt heo', 'Tôm', 'Nấm mèo', 'Cà rốt', 'Miến', 'Bánh tráng'],
    tags: ['Truyền thống', 'Giòn ngon']
  },
  {
    id: '2',
    name: 'Gỏi cuốn tôm thịt',
    description: 'Gỏi cuốn tươi mát với tôm, thịt và rau sống',
    image: "/images/dishes/goi_cuon_tom_thit.jpg",
    price: 60000,
    category: 'Khai vị',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 15,
    ingredients: ['Tôm', 'Thịt heo', 'Bánh tráng', 'Rau sống', 'Bún'],
    tags: ['Tươi mát', 'Healthy']
  },
  {
    id: '3',
    name: 'Chả giò chay',
    description: 'Chả giò chay giòn rụm với nhân rau củ thập cẩm',
    image: "/images/dishes/cha_gio_chay.jpg",
    price: 40000,
    category: 'Khai vị',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 25,
    ingredients: ['Rau củ', 'Nấm', 'Đậu phụ', 'Bánh tráng'],
    tags: ['Chay', 'Giòn']
  },
  {
    id: '4',
    name: 'Bò bía',
    description: 'Cuốn bò bía với tôm khô, trứng, củ sắn và rau thơm',
    image: "/images/dishes/bo_bia.jpg",
    price: 45000,
    category: 'Khai vị',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 18,
    ingredients: ['Tôm khô', 'Trứng', 'Củ sắn', 'Rau thơm', 'Bánh tráng'],
    tags: ['Đặc sản', 'Tươi ngon']
  },

  // Món chính
  {
    id: '5',
    name: 'Thịt kho trứng',
    description: 'Thịt ba chỉ kho tàu với trứng gà, đậm đà hương vị',
    image: "/images/dishes/thit_kho_trung.jpg",
    price: 45000,
    category: 'Món chính',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 45,
    ingredients: ['Thịt ba chỉ', 'Trứng gà', 'Nước dừa', 'Nước mắm'],
    tags: ['Truyền thống', 'Đậm đà']
  },
  {
    id: '6',
    name: 'Cá kho tộ',
    description: 'Cá lóc kho tộ với nước màu caramel, thơm ngon đặc trưng',
    image: "/images/dishes/ca_kho_to.jpg",
    price: 55000,
    category: 'Món chính',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 40,
    ingredients: ['Cá lóc', 'Thịt ba chỉ', 'Nước mắm', 'Đường', 'Tiêu'],
    tags: ['Đặc sản', 'Cay nhẹ']
  },
  {
    id: '7',
    name: 'Gà rang muối',
    description: 'Gà rang muối giòn da, thấm vị muối tiêu thơm ngon',
    image: "/images/dishes/ga_rang_muoi.jpg",
    price: 65000,
    category: 'Món chính',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 35,
    ingredients: ['Gà ta', 'Muối', 'Tiêu', 'Tỏi', 'Ớt'],
    tags: ['Giòn da', 'Thơm ngon']
  },
  {
    id: '8',
    name: 'Tôm rim mặn ngọt',
    description: 'Tôm tươi rim với sốt mặn ngọt, đậm đà hương vị',
    image: "/images/dishes/tom_rim_man_ngot.jpg",
    price: 75000,
    category: 'Món chính',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: true,
    preparationTime: 25,
    ingredients: ['Tôm sú', 'Tỏi', 'Ớt', 'Nước mắm', 'Đường'],
    tags: ['Tươi ngon', 'Cay']
  },
  {
    id: '9',
    name: 'Bò xào hành tây',
    description: 'Bò xào hành tây mềm ngon, thấm vị đậm đà',
    image: "/images/dishes/bo_xao_hanh_tay.jpg",
    price: 85000,
    category: 'Món chính',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 20,
    ingredients: ['Thịt bò', 'Hành tây', 'Tỏi', 'Dầu hào'],
    tags: ['Mềm ngon', 'Đậm đà']
  },
  {
    id: '10',
    name: 'Cá chiên xù',
    description: 'Cá phi lê chiên xù giòn rụm, chấm sốt mayonnaise',
    image: "/images/dishes/ca_chien_xu.jpg",
    price: 60000,
    category: 'Món chính',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: false,
    isSpicy: false,
    preparationTime: 30,
    ingredients: ['Cá phi lê', 'Bột chiên xù', 'Trứng', 'Sốt mayonnaise'],
    tags: ['Giòn', 'Hấp dẫn']
  },

  // Món phụ
  {
    id: '11',
    name: 'Xôi ngũ sắc',
    description: 'Xôi nhiều màu sắc từ thiên nhiên, thơm ngon bổ dưỡng',
    image: "/images/dishes/xoi_ngu_sac.jpg",
    price: 100000,
    category: 'Món phụ',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 60,
    ingredients: ['Gạo nếp', 'Lá cẩm', 'Gấc', 'Đậu xanh'],
    tags: ['Truyền thống', 'Màu sắc']
  },
  {
    id: '12',
    name: 'Cơm trắng',
    description: 'Cơm trắng dẻo thơm, nấu từ gạo ST25 thượng hạng',
    image: "/images/dishes/com_trang.jpg",
    price: 20000,
    category: 'Món phụ',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 30,
    ingredients: ['Gạo ST25'],
    tags: ['Dẻo thơm', 'Cơ bản']
  },
  {
    id: '13',
    name: 'Bánh mì',
    description: 'Bánh mì giòn ruột mềm, ăn kèm các món chính',
    image: "/images/dishes/banh_mi.jpg",
    price: 5000,
    category: 'Món phụ',
    unit: 'ổ',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    ingredients: ['Bột mì', 'Men'],
    tags: ['Giòn', 'Tiện lợi']
  },
  {
    id: '14',
    name: 'Rau muống xào tỏi',
    description: 'Rau muống xào tỏi thơm ngon, giòn xanh',
    image: "/images/dishes/rau_muong_xao_toi.jpg",
    price: 20000,
    category: 'Món phụ',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 15,
    ingredients: ['Rau muống', 'Tỏi', 'Dầu ăn'],
    tags: ['Tươi xanh', 'Healthy']
  },

  // Món tráng miệng
  {
    id: '15',
    name: 'Chè đậu đen',
    description: 'Chè đậu đen thơm ngon, nấu với đường thốt nốt',
    image: "/images/dishes/che_dau_den.jpg",
    price: 15000,
    category: 'Tráng miệng',
    unit: 'chén',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 120,
    ingredients: ['Đậu đen', 'Đường thốt nốt', 'Nước cốt dừa'],
    tags: ['Ngọt thanh', 'Truyền thống']
  },
  {
    id: '16',
    name: 'Bánh flan',
    description: 'Bánh flan mềm mịn, thơm vị trứng và caramel',
    image: "/images/dishes/banh_flan.jpg",
    price: 20000,
    category: 'Tráng miệng',
    unit: 'phần',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 180,
    ingredients: ['Trứng', 'Sữa', 'Đường', 'Vanilla'],
    tags: ['Mềm mịn', 'Ngọt ngào']
  },
  {
    id: '17',
    name: 'Trái cây theo mùa',
    description: 'Trái cây tươi theo mùa, cắt tỉa đẹp mắt',
    image: "/images/dishes/trai_cay_theo_mua.jpg",
    price: 40000,
    category: 'Tráng miệng',
    unit: 'đĩa',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    ingredients: ['Trái cây theo mùa'],
    tags: ['Tươi mát', 'Healthy']
  },
  {
    id: '18',
    name: 'Kem dừa',
    description: 'Kem dừa mát lạnh, thơm vị dừa đặc trưng',
    image: "/images/dishes/kem_dua.jpg",
    price: 20000,
    category: 'Tráng miệng',
    unit: 'ly',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    ingredients: ['Kem dừa', 'Cốt dừa'],
    tags: ['Mát lạnh', 'Thơm ngon']
  },

  // Đồ uống
  {
    id: '19',
    name: 'Trà đá',
    description: 'Trà đá mát lạnh, giải khát ngày hè',
    image: "/images/drinks/tra_da.jpg",
    price: 5000,
    category: 'Đồ uống',
    unit: 'ly',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 2,
    ingredients: ['Trà xanh', 'Đá'],
    tags: ['Giải khát', 'Truyền thống']
  },
  {
    id: '20',
    name: 'Trà sen',
    description: 'Trà ướp sen thơm ngát, thanh mát cơ thể',
    image:"/images/drinks/tra_sen.jpg",
    price: 25000,
    category: 'Đồ uống',
    unit: 'ấm',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 10,
    ingredients: ['Trà', 'Hoa sen'],
    tags: ['Thơm ngát', 'Thanh mát']
  },
  {
    id: '21',
    name: 'Nước cam ép',
    description: 'Nước cam tươi ép nguyên chất, giàu vitamin C',
    image: "/images/drinks/nuoc_cam_ep.jpg",
    price: 35000,
    category: 'Đồ uống',
    unit: 'ly',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    ingredients: ['Cam tươi'],
    tags: ['Tươi ngon', 'Bổ dưỡng']
  },
  {
    id: '22',
    name: 'Sinh tố bơ',
    description: 'Sinh tố bơ béo ngậy, thơm ngon bổ dưỡng',
    image: "/images/drinks/sinh_to_bo.jpg",
    price: 40000,
    category: 'Đồ uống',
    unit: 'ly',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 7,
    ingredients: ['Bơ', 'Sữa đặc', 'Đá'],
    tags: ['Béo ngậy', 'Bổ dưỡng']
  },
  {
    id: '23',
    name: 'Bia Tiger',
    description: 'Bia Tiger lạnh, hương vị đậm đà',
    image: "/images/drinks/bia_tiger.jpg",
    price: 30000,
    category: 'Đồ uống',
    unit: 'lon',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 1,
    ingredients: ['Bia'],
    tags: ['Mát lạnh', 'Đậm đà']
  },
  {
    id: '24',
    name: 'Rượu nếp',
    description: 'Rượu nếp cái hoa vàng, thơm nồng đặc trưng',
    image: "/images/drinks/ruou_nep.jpg",
    price: 50000,
    category: 'Đồ uống',
    unit: 'lít',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 1,
    ingredients: ['Rượu nếp'],
    tags: ['Truyền thống', 'Thơm nồng']
  },
  {
    id: '25',
    name: 'Coca Cola',
    description: 'Nước ngọt Coca Cola mát lạnh',
    image: "/images/drinks/coca_cola.jpg",
    price: 15000,
    category: 'Đồ uống',
    unit: 'lon',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 1,
    ingredients: ['Nước ngọt'],
    tags: ['Mát lạnh', 'Giải khát']
  },
  {
    id: '26',
    name: 'Nước dừa tươi',
    description: 'Nước dừa tươi mát, ngọt thanh tự nhiên',
    image: "/images/drinks/nuoc_dua_tuoi.jpg",
    price: 25000,
    category: 'Đồ uống',
    unit: 'trái',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 2,
    ingredients: ['Dừa tươi'],
    tags: ['Tự nhiên', 'Thanh mát']
  },
  {
    id: '27',
    name: 'Cà phê sữa đá',
    description: 'Cà phê phin truyền thống với sữa đặc và đá',
    image: "/images/drinks/ca_phe_sua_da.jpg",
    price: 25000,
    category: 'Đồ uống',
    unit: 'ly',
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    preparationTime: 5,
    ingredients: ['Cà phê', 'Sữa đặc', 'Đá'],
    tags: ['Truyền thống', 'Tỉnh táo']
  }
];

export const feastSets: FeastSet[] = [
  // Mâm cỗ gia đình
  {
    id: '1',
    name: 'Mâm cỗ gia đình truyền thống',
    description: 'Mâm cỗ đầy đủ các món ăn truyền thống Việt Nam, thích hợp cho bữa cơm gia đình ấm cúng',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[0], quantity: 1 }, // Nem rán
        { dish: dishes[1], quantity: 1 }, // Gỏi cuốn tôm thịt
        { dish: dishes[4], quantity: 1 }, // Thịt kho trứng
        { dish: dishes[5], quantity: 1 }, // Cá kho tộ
        { dish: dishes[9], quantity: 1 }, // Cá chiên xù
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
        { dish: dishes[11], quantity: 1 }, // Cơm trắng
        { dish: dishes[13], quantity: 1 }  // Rau muống xào tỏi
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[0], quantity: 1 }, // Nem rán
      { dish: dishes[1], quantity: 1 }, // Gỏi cuốn tôm thịt
      { dish: dishes[4], quantity: 1 }, // Thịt kho trứng
      { dish: dishes[5], quantity: 1 }, // Cá kho tộ
      { dish: dishes[9], quantity: 1 }, // Cá chiên xù
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
      { dish: dishes[11], quantity: 1 }, // Cơm trắng
      { dish: dishes[13], quantity: 1 }  // Rau muống xào tỏi
    ],
    servings: 4,
    category: 'Gia đình',
    isPopular: true,
    rating: 4.8,
    reviewCount: 124,
    isActive: true,
    tags: ['Truyền thống', 'Ấm cúng']
  },

  // Mâm cỗ tiệc cưới
  {
    id: '2',
    name: 'Mâm cỗ tiệc cưới sang trọng',
    description: 'Mâm cỗ cao cấp dành cho đám cưới với các món ăn hảo hạng và trình bày tinh tế',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[0], quantity: 2 }, // Nem rán
        { dish: dishes[1], quantity: 2 }, // Gỏi cuốn tôm thịt
        { dish: dishes[5], quantity: 2 }, // Cá kho tộ
        { dish: dishes[6], quantity: 2 }, // Gà rang muối
        { dish: dishes[7], quantity: 2 }, // Tôm rim mặn ngọt
        { dish: dishes[8], quantity: 2 }, // Bò xào hành tây
        { dish: dishes[9], quantity: 2 }, // Cá chiên xù
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
        { dish: dishes[11], quantity: 2 }, // Cơm trắng
        { dish: dishes[14], quantity: 8 }  // Chè đậu đen
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[0], quantity: 2 }, // Nem rán
      { dish: dishes[1], quantity: 2 }, // Gỏi cuốn tôm thịt
      { dish: dishes[5], quantity: 2 }, // Cá kho tộ
      { dish: dishes[6], quantity: 2 }, // Gà rang muối
      { dish: dishes[7], quantity: 2 }, // Tôm rim mặn ngọt
      { dish: dishes[8], quantity: 2 }, // Bò xào hành tây
      { dish: dishes[9], quantity: 2 }, // Cá chiên xù
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
      { dish: dishes[11], quantity: 2 }, // Cơm trắng
      { dish: dishes[14], quantity: 8 }  // Chè đậu đen
    ],
    servings: 8,
    category: 'Tiệc cưới',
    isPopular: true,
    rating: 4.9,
    reviewCount: 89,
    isActive: true,
    tags: ['Sang trọng', 'Cao cấp']
  },

  // Mâm cỗ giỗ tổ tiên
  {
    id: '3',
    name: 'Mâm cỗ giỗ tổ tiên trang trọng',
    description: 'Mâm cỗ truyền thống đầy đủ các món để cúng giỗ tổ tiên, thể hiện lòng thành kính',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[0], quantity: 1 }, // Nem rán
        { dish: dishes[3], quantity: 1 }, // Bò bía
        { dish: dishes[4], quantity: 1 }, // Thịt kho trứng
        { dish: dishes[5], quantity: 1 }, // Cá kho tộ
        { dish: dishes[6], quantity: 1 }, // Gà rang muối
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
        { dish: dishes[11], quantity: 1 }, // Cơm trắng
        { dish: dishes[14], quantity: 6 }  // Chè đậu đen
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[0], quantity: 1 }, // Nem rán
      { dish: dishes[3], quantity: 1 }, // Bò bía
      { dish: dishes[4], quantity: 1 }, // Thịt kho trứng
      { dish: dishes[5], quantity: 1 }, // Cá kho tộ
      { dish: dishes[6], quantity: 1 }, // Gà rang muối
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
      { dish: dishes[11], quantity: 1 }, // Cơm trắng
      { dish: dishes[14], quantity: 6 }  // Chè đậu đen
    ],
    servings: 6,
    category: 'Giỗ tổ tiên',
    isPopular: true,
    rating: 4.7,
    reviewCount: 67,
    isActive: true,
    tags: ['Trang trọng', 'Truyền thống']
  },

  // Mâm cỗ thôi nôi
  {
    id: '4',
    name: 'Mâm cỗ thôi nôi đầy đủ',
    description: 'Mâm cỗ đặc biệt cho lễ thôi nôi em bé với các món ăn bổ dưỡng và may mắn',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[0], quantity: 1 }, // Nem rán
        { dish: dishes[1], quantity: 1 }, // Gỏi cuốn tôm thịt
        { dish: dishes[4], quantity: 1 }, // Thịt kho trứng
        { dish: dishes[6], quantity: 1 }, // Gà rang muối (trọn vẹn)
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc (ngũ phúc)
        { dish: dishes[11], quantity: 1 }, // Cơm trắng
        { dish: dishes[15], quantity: 4 }  // Bánh flan (ngọt ngào)
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[0], quantity: 1 }, // Nem rán
      { dish: dishes[1], quantity: 1 }, // Gỏi cuốn tôm thịt
      { dish: dishes[4], quantity: 1 }, // Thịt kho trứng
      { dish: dishes[6], quantity: 1 }, // Gà rang muối (trọn vẹn)
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc (ngũ phúc)
      { dish: dishes[11], quantity: 1 }, // Cơm trắng
      { dish: dishes[15], quantity: 4 }  // Bánh flan (ngọt ngào)
    ],
    servings: 4,
    category: 'Thôi nôi',
    isPopular: false,
    rating: 4.6,
    reviewCount: 43,
    isActive: true,
    tags: ['May mắn', 'Bổ dưỡng']
  },

  // Mâm cỗ Tết Nguyên Đán
  {
    id: '5',
    name: 'Mâm cỗ Tết cổ truyền',
    description: 'Mâm cỗ Tết đầy đủ các món ăn truyền thống, mang đậm hương vị ngày Tết Việt Nam',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[0], quantity: 2 }, // Nem rán (cỗ Tết)
        { dish: dishes[3], quantity: 2 }, // Bò bía
        { dish: dishes[4], quantity: 1 }, // Thịt kho trứng (món Tết)
        { dish: dishes[5], quantity: 1 }, // Cá kho tộ (cá đầy đủ)
        { dish: dishes[6], quantity: 1 }, // Gà rang muối (gà trống thiến)
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc (ngũ phúc lâm môn)
        { dish: dishes[11], quantity: 2 }, // Cơm trắng
        { dish: dishes[14], quantity: 8 }, // Chè đậu đen (đậu đen may mắn)
        { dish: dishes[16], quantity: 1 }  // Trái cây mâm ngũ quả
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[0], quantity: 2 }, // Nem rán (cỗ Tết)
      { dish: dishes[3], quantity: 2 }, // Bò bía
      { dish: dishes[4], quantity: 1 }, // Thịt kho trứng (món Tết)
      { dish: dishes[5], quantity: 1 }, // Cá kho tộ (cá đầy đủ)
      { dish: dishes[6], quantity: 1 }, // Gà rang muối (gà trống thiến)
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc (ngũ phúc lâm môn)
      { dish: dishes[11], quantity: 2 }, // Cơm trắng
      { dish: dishes[14], quantity: 8 }, // Chè đậu đen (đậu đen may mắn)
      { dish: dishes[16], quantity: 1 }  // Trái cây mâm ngũ quả
    ],
    servings: 8,
    category: 'Lễ Tết',
    isPopular: true,
    rating: 4.9,
    reviewCount: 156,
    isActive: true,
    tags: ['Tết cổ truyền', 'May mắn']
  },

  // Mâm cỗ tiệc doanh nghiệp
  {
    id: '6',
    name: 'Mâm cỗ tiệc doanh nghiệp',
    description: 'Mâm cỗ sang trọng phù hợp cho các buổi tiệc doanh nghiệp, hội nghị quan trọng',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[1], quantity: 2 }, // Gỏi cuốn tôm thịt
        { dish: dishes[2], quantity: 2 }, // Chả giò chay
        { dish: dishes[7], quantity: 2 }, // Tôm rim mặn ngọt
        { dish: dishes[8], quantity: 2 }, // Bò xào hành tây
        { dish: dishes[9], quantity: 2 }, // Cá chiên xù
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
        { dish: dishes[11], quantity: 2 }, // Cơm trắng
        { dish: dishes[12], quantity: 10 }, // Bánh mì
        { dish: dishes[15], quantity: 10 } // Bánh flan
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[1], quantity: 2 }, // Gỏi cuốn tôm thịt
      { dish: dishes[2], quantity: 2 }, // Chả giò chay
      { dish: dishes[7], quantity: 2 }, // Tôm rim mặn ngọt
      { dish: dishes[8], quantity: 2 }, // Bò xào hành tây
      { dish: dishes[9], quantity: 2 }, // Cá chiên xù
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
      { dish: dishes[11], quantity: 2 }, // Cơm trắng
      { dish: dishes[12], quantity: 10 }, // Bánh mì
      { dish: dishes[15], quantity: 10 } // Bánh flan
    ],
    servings: 10,
    category: 'Doanh nghiệp',
    isPopular: true,
    rating: 4.8,
    reviewCount: 78,
    isActive: true,
    tags: ['Sang trọng', 'Chuyên nghiệp']
  },

  // Mâm cỗ chay
  {
    id: '7',
    name: 'Mâm cỗ chay thanh tịnh',
    description: 'Mâm cỗ chay đầy đủ dinh dưỡng, phù hợp cho những ngày ăn chay và tĩnh tâm',
    image: heroFeastImg,
    price: (() => {
      let totalPrice = 0;
      [
        { dish: dishes[2], quantity: 1 }, // Chả giò chay
        { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
        { dish: dishes[11], quantity: 1 }, // Cơm trắng
        { dish: dishes[13], quantity: 1 }, // Rau muống xào tỏi
        { dish: dishes[14], quantity: 4 }, // Chè đậu đen
        { dish: dishes[16], quantity: 1 }  // Trái cây
      ].forEach(item => {
        totalPrice += item.dish.price * item.quantity;
      });
      return totalPrice;
    })(),
    dishes: [
      { dish: dishes[2], quantity: 1 }, // Chả giò chay
      { dish: dishes[10], quantity: 1 }, // Xôi ngũ sắc
      { dish: dishes[11], quantity: 1 }, // Cơm trắng
      { dish: dishes[13], quantity: 1 }, // Rau muống xào tỏi
      { dish: dishes[14], quantity: 4 }, // Chè đậu đen
      { dish: dishes[16], quantity: 1 }  // Trái cây
    ],
    servings: 4,
    category: 'Món chay',
    isPopular: false,
    rating: 4.5,
    reviewCount: 32,
    isActive: true,
    tags: ['Thanh tịnh', 'Healthy']
  }
];

// Sample reviews
export const reviews: Review[] = [
  // Reviews for feast sets
  {
    id: '1',
    orderId: 'DH001',
    customerId: 'user1',
    customerName: 'Nguyễn Văn An',
    rating: 5,
    comment: 'Mâm cỗ gia đình truyền thống rất ngon, đầy đủ các món truyền thống. Nem rán giòn, thịt kho trứng đậm đà. Gia đình tôi rất hài lòng!',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-15'),
    approvedAt: new Date('2024-09-15')
  },
  {
    id: '2',
    orderId: 'DH002',
    customerId: 'user2',
    customerName: 'Trần Thị Bình',
    rating: 4,
    comment: 'Mâm cỗ tiệc cưới sang trọng rất đẹp mắt. Gà rang muối thơm ngon, tôm rim mặn ngọt vừa miệng. Giao hơi trễ một chút nhưng nhân viên rất nhiệt tình!',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-14'),
    approvedAt: new Date('2024-09-14')
  },
  {
    id: '3',
    orderId: 'DH003',
    customerId: 'user3',
    customerName: 'Lê Văn Cường',
    rating: 5,
    comment: 'Mâm cỗ giỗ tổ tiên trang trọng tuyệt vời! Mâm cỗ đẹp mắt, hương vị chuẩn vị truyền thống. Xôi ngũ sắc rất đẹp và ngon. Sẽ đặt lại!',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-13'),
    approvedAt: new Date('2024-09-13')
  },
  
  // Reviews for individual dishes
  {
    id: '4',
    orderId: 'DH004',
    customerId: 'user4',
    customerName: 'Phạm Thị Dung',
    rating: 5,
    comment: 'Nem rán giòn rụm, nhân thịt và rau củ thơm ngon. Rất đáng để thử!',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-12'),
    approvedAt: new Date('2024-09-12')
  },
  {
    id: '5',
    orderId: 'DH005',
    customerId: 'user5',
    customerName: 'Hoàng Văn Em',
    rating: 4,
    comment: 'Thịt kho trứng đậm đà hương vị, trứng thấm vị rất ngon. Chỉ hơi mặn một chút nhưng vẫn rất ngon.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-11'),
    approvedAt: new Date('2024-09-11')
  },
  {
    id: '6',
    orderId: 'DH006',
    customerId: 'user6',
    customerName: 'Vũ Thị Phương',
    rating: 5,
    comment: 'Cá kho tộ thơm ngon đặc trưng, nước màu caramel đẹp mắt. Cá tươi, thịt chắc. Rất hài lòng!',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-10'),
    approvedAt: new Date('2024-09-10')
  },
  {
    id: '7',
    orderId: 'DH007',
    customerId: 'user7',
    customerName: 'Đặng Văn Hùng',
    rating: 4,
    comment: 'Gà rang muối giòn da, thấm vị muối tiêu thơm ngon. Da giòn, thịt mềm. Rất ngon!',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-09'),
    approvedAt: new Date('2024-09-09')
  },
  {
    id: '8',
    orderId: 'DH008',
    customerId: 'user8',
    customerName: 'Bùi Thị Lan',
    rating: 5,
    comment: 'Xôi ngũ sắc nhiều màu sắc từ thiên nhiên, thơm ngon bổ dưỡng. Màu sắc đẹp, xôi dẻo thơm.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-08'),
    approvedAt: new Date('2024-09-08')
  },
  {
    id: '9',
    orderId: 'DH009',
    customerId: 'user9',
    customerName: 'Ngô Văn Tú',
    rating: 3,
    comment: 'Chè đậu đen ngọt thanh nhưng hơi loãng. Hy vọng lần sau đặc hơn một chút.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-07'),
    approvedAt: new Date('2024-09-07')
  },
  {
    id: '10',
    orderId: 'DH010',
    customerId: 'user10',
    customerName: 'Lý Thị Mai',
    rating: 5,
    comment: 'Bánh flan mềm mịn, thơm vị trứng và caramel. Rất ngon và hợp khẩu vị gia đình tôi.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-06'),
    approvedAt: new Date('2024-09-06')
  },
  {
    id: '11',
    orderId: 'DH011',
    customerId: 'user11',
    customerName: 'Trịnh Văn Long',
    rating: 4,
    comment: 'Gỏi cuốn tôm thịt tươi mát với tôm, thịt và rau sống. Rau tươi, nước chấm ngon.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-05'),
    approvedAt: new Date('2024-09-05')
  },
  {
    id: '12',
    orderId: 'DH012',
    customerId: 'user12',
    customerName: 'Phan Thị Hoa',
    rating: 2,
    comment: 'Rau muống xào tỏi không được tươi như mong đợi, hơi dai.',
    images: [],
    status: 'pending',
    createdAt: new Date('2024-09-04')
  },
  
  // Reviews for drinks
  {
    id: '13',
    orderId: 'DH013',
    customerId: 'user13',
    customerName: 'Nguyễn Văn Minh',
    rating: 5,
    comment: 'Trà sen thơm ngát, thanh mát cơ thể. Hương sen tự nhiên, rất dễ chịu.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-03'),
    approvedAt: new Date('2024-09-03')
  },
  {
    id: '14',
    orderId: 'DH014',
    customerId: 'user14',
    customerName: 'Trần Thị Hương',
    rating: 4,
    comment: 'Nước cam ép tươi ngon, giàu vitamin C. Cam ngọt tự nhiên, không đường thêm.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-02'),
    approvedAt: new Date('2024-09-02')
  },
  {
    id: '15',
    orderId: 'DH015',
    customerId: 'user15',
    customerName: 'Lê Văn Tài',
    rating: 5,
    comment: 'Sinh tố bơ béo ngậy, thơm ngon bổ dưỡng. Bơ chín tự nhiên, sữa đặc vừa phải.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-09-01'),
    approvedAt: new Date('2024-09-01')
  },
  {
    id: '16',
    orderId: 'DH016',
    customerId: 'user16',
    customerName: 'Phạm Thị Lan',
    rating: 4,
    comment: 'Bia Tiger lạnh, hương vị đậm đà. Phù hợp cho các buổi tiệc.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-08-31'),
    approvedAt: new Date('2024-08-31')
  },
  {
    id: '17',
    orderId: 'DH017',
    customerId: 'user17',
    customerName: 'Hoàng Văn Dũng',
    rating: 5,
    comment: 'Rượu nếp cái hoa vàng thơm nồng đặc trưng. Chất lượng tốt, hương vị truyền thống.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-08-30'),
    approvedAt: new Date('2024-08-30')
  },
  {
    id: '18',
    orderId: 'DH018',
    customerId: 'user18',
    customerName: 'Vũ Thị Mai',
    rating: 3,
    comment: 'Coca Cola mát lạnh nhưng hơi ngọt. Vẫn là lựa chọn giải khát tốt.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-08-29'),
    approvedAt: new Date('2024-08-29')
  },
  {
    id: '19',
    orderId: 'DH019',
    customerId: 'user19',
    customerName: 'Đặng Văn Hải',
    rating: 5,
    comment: 'Nước dừa tươi mát, ngọt thanh tự nhiên. Dừa tươi, nước ngọt mát.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-08-28'),
    approvedAt: new Date('2024-08-28')
  },
  {
    id: '20',
    orderId: 'DH020',
    customerId: 'user20',
    customerName: 'Bùi Thị Thảo',
    rating: 4,
    comment: 'Cà phê sữa đá phin truyền thống thơm ngon. Đậm đà hương vị Việt.',
    images: [],
    status: 'approved',
    createdAt: new Date('2024-08-27'),
    approvedAt: new Date('2024-08-27')
  }
];

// Sample orders with completed status for review functionality
export const orders: Order[] = [
  {
    id: 'DH001',
    customerId: 'user1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0912345678',
    customerEmail: 'nguyen.van.an@email.com',
    items: [
      {
        id: 'item1',
        type: 'set',
        item: feastSets[0],
        quantity: 1,
        notes: 'Thêm chút ớt cho món cá kho tộ'
      }
    ],
    deliveryDate: new Date('2024-09-15'),
    deliveryAddress: '123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
    totalAmount: 450000,
    depositAmount: 225000,
    status: 'completed',
    notes: 'Giao hàng trước 11h trưa',
    statusHistory: [
      {
        status: 'pending',
        updatedBy: 'system',
        updatedAt: new Date('2024-09-14T10:00:00'),
        notes: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        updatedBy: 'admin1',
        updatedAt: new Date('2024-09-14T11:30:00'),
        notes: 'Đã xác nhận đơn hàng'
      },
      {
        status: 'completed',
        updatedBy: 'admin1',
        updatedAt: new Date('2024-09-15T12:00:00'),
        notes: 'Đã giao hàng thành công'
      }
    ],
    createdAt: new Date('2024-09-14T10:00:00'),
    updatedAt: new Date('2024-09-15T12:00:00'),
    invoiceId: 'INV001'
  },
  {
    id: 'DH002',
    customerId: 'user2',
    customerName: 'Trần Thị Bình',
    customerPhone: '0923456789',
    customerEmail: 'tran.thi.binh@email.com',
    items: [
      {
        id: 'item2',
        type: 'set',
        item: feastSets[1],
        quantity: 1
      }
    ],
    deliveryDate: new Date('2024-09-14'),
    deliveryAddress: '456 Đường Lê Văn Việt, Quận 9, TP.HCM',
    totalAmount: 320000,
    depositAmount: 160000,
    status: 'completed',
    notes: '',
    statusHistory: [
      {
        status: 'pending',
        updatedBy: 'system',
        updatedAt: new Date('2024-09-13T14:00:00'),
        notes: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        updatedBy: 'admin1',
        updatedAt: new Date('2024-09-13T15:30:00'),
        notes: 'Đã xác nhận đơn hàng'
      },
      {
        status: 'completed',
        updatedBy: 'admin1',
        updatedAt: new Date('2024-09-14T13:30:00'),
        notes: 'Đã giao hàng thành công'
      }
    ],
    createdAt: new Date('2024-09-13T14:00:00'),
    updatedAt: new Date('2024-09-14T13:30:00'),
    invoiceId: 'INV002'
  },
  {
    id: 'DH003',
    customerId: 'user3',
    customerName: 'Lê Văn Cường',
    customerPhone: '0934567890',
    customerEmail: 'le.van.cuong@email.com',
    items: [
      {
        id: 'item3',
        type: 'set',
        item: feastSets[2],
        quantity: 1
      }
    ],
    deliveryDate: new Date('2024-09-13'),
    deliveryAddress: '789 Đường Nguyễn Duy Trinh, Quận 2, TP.HCM',
    totalAmount: 280000,
    depositAmount: 140000,
    status: 'completed',
    notes: 'Giao hàng buổi chiều',
    statusHistory: [
      {
        status: 'pending',
        updatedBy: 'system',
        updatedAt: new Date('2024-09-12T09:00:00'),
        notes: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        updatedBy: 'admin1',
        updatedAt: new Date('2024-09-12T10:30:00'),
        notes: 'Đã xác nhận đơn hàng'
      },
      {
        status: 'completed',
        updatedBy: 'admin1',
        updatedAt: new Date('2024-09-13T16:00:00'),
        notes: 'Đã giao hàng thành công'
      }
    ],
    createdAt: new Date('2024-09-12T09:00:00'),
    updatedAt: new Date('2024-09-13T16:00:00'),
    invoiceId: 'INV003'
  }
];

// Mock chat data
export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participantIds: ['1', '3'], // Admin and User
    participants: [
      {
        userId: '1',
        userName: 'Quản trị viên',
        userRole: 'admin',
        lastReadAt: new Date('2024-09-24T07:00:00')
      },
      {
        userId: '3',
        userName: 'Nguyễn Văn An',
        userRole: 'customer',
        lastReadAt: new Date('2024-09-24T07:15:00')
      }
    ],
    lastMessage: {
      id: 'msg3',
      conversationId: 'conv1',
      fromUserId: '3',
      fromUserName: 'Nguyễn Văn An',
      fromUserRole: 'customer',
      toUserId: '1',
      toUserName: 'Quản trị viên',
      toUserRole: 'admin',
      content: 'Xin chào, tôi muốn hỏi về thời gian giao hàng cho đơn #DH001. Có thể giao sớm hơn được không?',
      messageType: 'text',
      isRead: false,
      createdAt: new Date('2024-09-24T07:15:00')
    },
    unreadCount: 1,
    createdAt: new Date('2024-09-24T06:30:00'),
    updatedAt: new Date('2024-09-24T07:15:00'),
    orderId: 'DH001',
    status: 'active',
    tags: ['hỗ trợ đơn hàng']
  },
  {
    id: 'conv2',
    participantIds: ['1', 'user2'], // Admin and another user
    participants: [
      {
        userId: '1',
        userName: 'Quản trị viên',
        userRole: 'admin',
        lastReadAt: new Date('2024-09-24T05:00:00')
      },
      {
        userId: 'user2',
        userName: 'Trần Thị Bình',
        userRole: 'customer',
        lastReadAt: new Date('2024-09-24T05:30:00')
      }
    ],
    lastMessage: {
      id: 'msg5',
      conversationId: 'conv2',
      fromUserId: '1',
      fromUserName: 'Quản trị viên',
      fromUserRole: 'admin',
      toUserId: 'user2',
      toUserName: 'Trần Thị Bình',
      toUserRole: 'customer',
      content: 'Cảm ơn bạn đã phản hồi tích cực. Chúng tôi rất vui khi được phục vụ bạn!',
      messageType: 'text',
      isRead: true,
      createdAt: new Date('2024-09-24T05:30:00')
    },
    unreadCount: 0,
    createdAt: new Date('2024-09-24T05:00:00'),
    updatedAt: new Date('2024-09-24T05:30:00'),
    status: 'resolved',
    tags: ['phản hồi tích cực']
  }
];

export const messages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'conv1',
    fromUserId: '3',
    fromUserName: 'Nguyễn Văn An',
    fromUserRole: 'customer',
    toUserId: '1',
    toUserName: 'Quản trị viên',
    toUserRole: 'admin',
    content: 'Xin chào, tôi có đơn hàng #DH001 đặt hôm qua.',
    messageType: 'text',
    isRead: true,
    createdAt: new Date('2024-09-24T06:30:00'),
    readAt: new Date('2024-09-24T06:35:00')
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    fromUserId: '1',
    fromUserName: 'Quản trị viên',
    fromUserRole: 'admin',
    toUserId: '3',
    toUserName: 'Nguyễn Văn An',
    toUserRole: 'customer',
    content: 'Chào bạn! Tôi có thể giúp gì cho bạn về đơn hàng #DH001?',
    messageType: 'text',
    isRead: true,
    createdAt: new Date('2024-09-24T06:35:00'),
    readAt: new Date('2024-09-24T06:40:00')
  },
  {
    id: 'msg3',
    conversationId: 'conv1',
    fromUserId: '3',
    fromUserName: 'Nguyễn Văn An',
    fromUserRole: 'customer',
    toUserId: '1',
    toUserName: 'Quản trị viên',
    toUserRole: 'admin',
    content: 'Xin chào, tôi muốn hỏi về thời gian giao hàng cho đơn #DH001. Có thể giao sớm hơn được không?',
    messageType: 'text',
    isRead: false,
    createdAt: new Date('2024-09-24T07:15:00')
  },
  {
    id: 'msg4',
    conversationId: 'conv2',
    fromUserId: 'user2',
    fromUserName: 'Trần Thị Bình',
    fromUserRole: 'customer',
    toUserId: '1',
    toUserName: 'Quản trị viên',
    toUserRole: 'admin',
    content: 'Cảm ơn nhà hàng đã hỗ trợ tôi rất nhiều. Đồ ăn rất ngon và giao hàng đúng giờ.',
    messageType: 'text',
    isRead: true,
    createdAt: new Date('2024-09-24T05:00:00'),
    readAt: new Date('2024-09-24T05:15:00')
  },
  {
    id: 'msg5',
    conversationId: 'conv2',
    fromUserId: '1',
    fromUserName: 'Quản trị viên',
    fromUserRole: 'admin',
    toUserId: 'user2',
    toUserName: 'Trần Thị Bình',
    toUserRole: 'customer',
    content: 'Cảm ơn bạn đã phản hồi tích cực. Chúng tôi rất vui khi được phục vụ bạn!',
    messageType: 'text',
    isRead: true,
    createdAt: new Date('2024-09-24T05:30:00'),
    readAt: new Date('2024-09-24T05:35:00')
  }
];