const brands = ["سامسونگ", "اپل", "شیائومی", "هوآوی"];

export function generateProducts(count = 100) {
  const products = [];

  for (let i = 1; i <= count; i++) {
    const brand = brands[i % brands.length];

    products.push({
      id: i,
      name: `${brand} مدل ${i}`,
      brand,
      price: 5000000 + i * 100000,
      rating: Number((3 + (i % 20) / 10).toFixed(1)),
      image: `https://dummyimage.com/300x200/2c3e50/ffffff&text=${brand}+${i}`,
      specs: {
        رم: ["4GB", "8GB", "12GB"][i % 3],
        حافظه: ["64GB", "128GB", "256GB"][i % 3],
        باتری: "4000mAh",
        دوربین: "48MP",
        پردازنده: "اسنپدراگون",
        صفحه‌نمایش: "6.5 اینچ",
      },
    });
  }

  return products;
}

export const products = generateProducts();
