const ComparisonTable = {
  // ایجاد جدول مقایسه
  create(products) {
    if (!products || products.length === 0) {
      return this.createEmptyState();
    }

    const container = document.createElement("div");
    container.className = "comparison-wrapper";

    // هدر مقایسه
    const header = this.createHeader(products);
    container.appendChild(header);

    // پیدا کردن تفاوت‌ها
    const diffKeys = ComparisonEngine.findDifferences(products);

    // گرفتن همه کلیدهای مشخصات
    const allSpecs = products[0] ? Object.keys(products[0].specs) : [];

    // ساخت جدول
    const table = document.createElement("div");
    table.className = "comparison-table";

    // سطر عنوان محصولات
    table.appendChild(this.createProductRow(products));

    // سطرهای مشخصات
    allSpecs.forEach((key) => {
      const isDiff = diffKeys.has(key);
      table.appendChild(this.createSpecRow(key, products, isDiff));
    });

    container.appendChild(table);
    return container;
  },

  //ایجاد هدر با شمارنده
  createHeader(products) {
    const header = document.createElement("div");
    header.className = "comparison-header";
    header.innerHTML = `
      <h3> مقایسه محصولات</h3>
      <span class="comparison-badge">${products.length} از ۴</span>
    `;
    return header;
  },

  //ایجاد سطر محصولات (تصویر و نام)
  createProductRow(products) {
    const row = document.createElement("div");
    row.className = "comparison-row product-row";

    // سلول عنوان
    const titleCell = document.createElement("div");
    titleCell.className = "comparison-cell title-cell";
    titleCell.textContent = "محصول";
    row.appendChild(titleCell);

    // سلول‌های محصولات
    products.forEach((product) => {
      const cell = document.createElement("div");
      cell.className = "comparison-cell product-cell";
      cell.innerHTML = `
        <div class="comparison-product">
          <img src="${product.image}" alt="${product.name}" class="comparison-product-img">
          <div class="comparison-product-name">${product.name}</div>
          <div class="comparison-product-price">${product.price.toLocaleString()} تومان</div>
          <div class="comparison-product-rating">${"★".repeat(Math.floor(product.rating))} ${product.rating}</div>
          <button class="remove-compare-btn" data-id="${product.id}">🗑️ حذف</button>
        </div>
      `;
      row.appendChild(cell);
    });

    return row;
  },

  // ایجاد سطر مشخصات

  createSpecRow(key, products, isDiff) {
    const row = document.createElement("div");
    row.className = `comparison-row spec-row ${isDiff ? "diff-row" : ""}`;

    // سلول عنوان مشخصه
    const titleCell = document.createElement("div");
    titleCell.className = "comparison-cell spec-title";
    titleCell.textContent = key;
    row.appendChild(titleCell);

    // سلول‌های مقادیر
    products.forEach((product) => {
      const cell = document.createElement("div");
      cell.className = `comparison-cell spec-value ${isDiff ? "highlight" : ""}`;
      cell.textContent = product.specs[key] || "---";
      row.appendChild(cell);
    });

    return row;
  },

  // ایجاد حالت خالی

  createEmptyState() {
    const empty = document.createElement("div");
    empty.className = "empty-comparison";
    empty.innerHTML = `
      <div class="empty-emoji">👈</div>
      <h3>محصولی برای مقایسه انتخاب نشده</h3>
      <p>از لیست بالا محصول مورد نظر را انتخاب کنید</p>
      <p class="empty-hint">حداکثر ۴ محصول می‌توانید مقایسه کنید</p>
    `;
    return empty;
  },
};

window.ComparisonTable = ComparisonTable;
