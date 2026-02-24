window.products = (function () {
  const products = [];

  // برندها
  const brands = [
    "سامسونگ",
    "اپل",
    "شیائومی",
    "هوآوی",
    "نوکیا",
    "آنر",
    "پوکو",
    "موتورولا",
    "الجی",
    "سونی",
  ];

  // مدل‌ها
  const samsungModels = [
    "گلکسی S24 Ultra",
    "گلکسی S24 Plus",
    "گلکسی S24",
    "گلکسی A55",
    "گلکسی A35",
    "گلکسی A15",
    "گلکسی Z Fold 6",
    "گلکسی Z Flip 6",
    "گلکسی Tab S9",
    "گلکسی A25",
  ];
  const appleModels = [
    "آیفون ۱۵ پرو مکس",
    "آیفون ۱۵ پرو",
    "آیفون ۱۵",
    "آیفون ۱۴ پرو مکس",
    "آیفون ۱۴",
    "آیفون ۱۳",
    "آیفون SE",
    "آیفون ۱۲",
    "آیپد پرو",
    "آیپد ایر",
  ];
  const xiaomiModels = [
    "شیائومی ۱۴ اولترا",
    "شیائومی ۱۴ پرو",
    "شیائومی ۱۳T",
    "ردمی نوت ۱۳ پرو",
    "ردمی نوت ۱۳",
    "پوکو X6 پرو",
    "پوکو F6",
    "پوکو M6",
    "شیائومی میکس فولد ۳",
    "شیائومی ۱۳ لایت",
  ];
  const huaweiModels = [
    "هوآوی P60 پرو",
    "هوآوی میت ۶۰ پرو",
    "هوآوی نوا ۱۲ اولترا",
    "آنر ۲۰۰ پرو",
    "آنر X9b",
    "هوآوی میت X5",
    "هوآوی P50",
    "آنر ۹۰ لایت",
    "هوآوی واچ GT 4",
    "هوآوی میت‌پد پرو",
  ];

  // رنگ‌ها
  const colors = [
    "مشکی",
    "سفید",
    "آبی",
    "طلایی",
    "نقره‌ای",
    "بنفش",
    "قرمز",
    "سبز",
    "صورتی",
    "نارنجی",
  ];

  // رم‌ها
  const rams = ["4GB", "6GB", "8GB", "12GB", "16GB"];

  // حافظه‌ها
  const storages = ["64GB", "128GB", "256GB", "512GB", "1TB"];

  // باتری‌ها
  const batteries = ["3000mAh", "4000mAh", "4500mAh", "5000mAh", "5500mAh"];

  // دوربین‌ها
  const cameras = ["12MP", "48MP", "50MP", "64MP", "108MP", "200MP"];

  // پردازنده‌ها
  const processors = [
    "اسنپدراگون ۸ نسل ۳",
    "اسنپدراگون ۸ نسل ۲",
    "اسنپدراگون ۷ نسل ۳",
    "مدیاتک دایمنسیتی ۹۳۰۰",
    "مدیاتک دایمنسیتی ۸۳۰۰",
    "اپل A17 پرو",
    "اپل A16",
    "اکسینوس ۲۴۰۰",
    "اکسینوس ۱۴۸۰",
    "هلیو G99",
  ];

  // صفحه‌نمایش
  const screens = [
    "6.1 اینچ",
    "6.4 اینچ",
    "6.7 اینچ",
    "6.8 اینچ",
    "6.9 اینچ",
    "7.6 اینچ",
  ];

  // تولید ۱۰۰ محصول
  for (let i = 1; i <= 100; i++) {
    // انتخاب برند
    let brand, model;

    if (i <= 25) {
      brand = "سامسونگ";
      model = samsungModels[(i - 1) % samsungModels.length];
    } else if (i <= 45) {
      brand = "اپل";
      model = appleModels[(i - 26) % appleModels.length];
    } else if (i <= 65) {
      brand = "شیائومی";
      model = xiaomiModels[(i - 46) % xiaomiModels.length];
    } else if (i <= 85) {
      brand = "هوآوی";
      model = huaweiModels[(i - 66) % huaweiModels.length];
    } else {
      brand = brands[i % brands.length];
      model = `مدل ${i}`;
    }

    // قیمت بر اساس برند
    let basePrice;
    if (brand === "اپل") basePrice = 40000000 + i * 200000;
    else if (brand === "سامسونگ") basePrice = 20000000 + i * 150000;
    else if (brand === "شیائومی") basePrice = 15000000 + i * 100000;
    else if (brand === "هوآوی") basePrice = 18000000 + i * 120000;
    else basePrice = 5000000 + i * 50000;

    // امتیاز
    const rating = (3 + (i % 20) / 10).toFixed(1);

    // تخفیف (۲۰٪ محصولات تخفیف دارند)
    const hasDiscount = i % 5 === 0;
    const discount = hasDiscount ? Math.floor(Math.random() * 20) + 5 : 0;
    const finalPrice = hasDiscount
      ? Math.floor(basePrice * (1 - discount / 100))
      : basePrice;

    // انتخاب تصویر مناسب
    let bgColor;
    if (brand === "سامسونگ") bgColor = "2c3e50";
    else if (brand === "اپل") bgColor = "000000";
    else if (brand === "شیائومی") bgColor = "ff6b6b";
    else if (brand === "هوآوی") bgColor = "e67e22";
    else bgColor = "3498db";

    const product = {
      id: i,
      name: `${brand} ${model}`,
      brand: brand,
      price: basePrice,
      finalPrice: finalPrice,
      discount: discount,
      rating: parseFloat(rating),
      image: `https://dummyimage.com/300x200/${bgColor}/ffffff&text=${brand}+${i}`,
      specs: {
        رم: rams[i % rams.length],
        حافظه: storages[i % storages.length],
        باتری: batteries[i % batteries.length],
        دوربین: cameras[i % cameras.length],
        پردازنده: processors[i % processors.length],
        صفحه‌نمایش: screens[i % screens.length],
        سیستمعامل: brand === "اپل" ? "iOS 17" : "اندروید ۱۴",
        وزن: `${Math.floor(Math.random() * 100 + 150)} گرم`,
      },
    };

    products.push(product);
  }

  return products;
})();
