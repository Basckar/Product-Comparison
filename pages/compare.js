// page/compare.js

document.addEventListener("DOMContentLoaded", () => {
  console.log(" compare.js لود شد");

  // چک کردن محصولات
  if (!window.products) {
    showError("محصولات بارگذاری نشدند!");
    return;
  }

  // رندر جدول مقایسه
  renderComparisonTable();

  // چک کردن تغییرات storage
  window.addEventListener("storage-changed", () => {
    renderComparisonTable();
  });
});

//   رندر جدول مقایسه
function renderComparisonTable() {
  const container = document.getElementById("comparisonContainer");
  if (!container) {
    console.error("❌ comparisonContainer پیدا نشد!");
    return;
  }

  // گرفتن آی‌دی‌های انتخاب شده
  const selectedIds = AppStorage ? AppStorage.getSelectedIds() : [];
  const selectedProducts = window.products.filter((p) =>
    selectedIds.includes(p.id),
  );

  // اگه محصولی انتخاب نشده
  if (selectedProducts.length === 0) {
    container.innerHTML = `
            <div class="empty-comparison">
                <div class="empty-emoji">👈</div>
                <h3>محصولی برای مقایسه انتخاب نشده</h3>
                <p>از صفحه محصولات، حداکثر ۴ محصول را انتخاب کنید</p>
                <a href="products.html" class="btn primary">رفتن به محصولات</a>
            </div>
        `;
    return;
  }

  // ساخت جدول مقایسه
  let html = `
        <div class="comparison-header">
            <h2> مقایسه ${selectedProducts.length} محصول</h2>
            <button class="btn danger" id="clearAllBtn"> پاک کردن همه</button>
        </div>
        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>مشخصات</th>
    `;

  // هدر محصولات
  selectedProducts.forEach((p) => {
    html += `<th class="product-header">
            <img src="${p.image}" alt="${p.name}">
            <h4>${p.name}</h4>
            <div class="price">${p.price.toLocaleString()} تومان</div>
            <button class="remove-btn" data-id="${p.id}">✕ حذف</button>
        </th>`;
  });

  html += `</tr></thead><tbody>`;

  // گرفتن همه کلیدهای مشخصات
  const allSpecs = selectedProducts[0]
    ? Object.keys(selectedProducts[0].specs)
    : [];

  // پیدا کردن تفاوت‌ها
  const diffKeys = findDifferences(selectedProducts);

  // ردیف‌های مشخصات
  allSpecs.forEach((key) => {
    const isDiff = diffKeys.has(key);
    html += `<tr ${isDiff ? 'class="diff-row"' : ""}>`;
    html += `<td class="spec-name">${key}</td>`;

    selectedProducts.forEach((p) => {
      const value = p.specs[key] || "---";
      html += `<td class="${isDiff ? "highlight" : ""}">${value}</td>`;
    });

    html += `</tr>`;
  });

  html += `</tbody></table></div>`;

  container.innerHTML = html;

  // اضافه کردن رویداد به دکمه پاک کردن همه
  document.getElementById("clearAllBtn")?.addEventListener("click", () => {
    if (confirm("همه محصولات از مقایسه حذف شوند؟")) {
      if (AppStorage) {
        AppStorage.selectedItems.clear();
        AppStorage.persistToStorage();
        AppStorage.notify();
      }
    }
  });
}

//   پیدا کردن تفاوت‌ها
function findDifferences(products) {
  if (products.length < 2) return new Set();

  const specsList = products.map((p) => p.specs);
  const allKeys = new Set();

  specsList.forEach((spec) => {
    Object.keys(spec).forEach((key) => allKeys.add(key));
  });

  const diffKeys = new Set();

  for (const key of allKeys) {
    const values = specsList.map((spec) => spec[key]);
    const firstValue = values[0];
    const allSame = values.every((v) => v === firstValue);

    if (!allSame) {
      diffKeys.add(key);
    }
  }

  return diffKeys;
}

//   نمایش خطا
function showError(msg) {
  const container = document.getElementById("comparisonContainer");
  if (container) {
    container.innerHTML = `<div style="color: red; text-align: center; padding: 40px;">${msg}</div>`;
  }
}

//   رویداد حذف (با event delegation)
document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const productId = parseInt(removeBtn.dataset.id);
    if (AppStorage) {
      AppStorage.removeItem(productId);
    }
  }
});
