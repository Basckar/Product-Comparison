import { products } from "../data/mockData.js";
import { AppStorage } from "../utils/storage.js";
import { findDifferences } from "../utils/comparison.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log(" compare.js لود شد");

  if (!products || products.length === 0) {
    showError("محصولات بارگذاری نشدند!");
    return;
  }

  renderComparisonTable();
  window.addEventListener("storage-changed", renderComparisonTable);
});

function renderComparisonTable() {
  const container = document.getElementById("comparisonContainer");
  if (!container) return;

  const selectedIds = AppStorage.getSelectedIds();
  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));

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

  const allSpecs = selectedProducts[0]
    ? Object.keys(selectedProducts[0].specs)
    : [];
  const diffKeys = findDifferences(selectedProducts);

  let html = `
    <div class="comparison-header">
      <h2> مقایسه ${selectedProducts.length} محصول</h2>
      <button class="btn danger" id="clearAllBtn"> پاک کردن همه</button>
    </div>
    <div class="comparison-table-wrapper">
      <table class="comparison-table">
        <thead><tr><th>مشخصات</th>
  `;

  selectedProducts.forEach((p) => {
    html += `<th class="product-header">
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="price">${p.price.toLocaleString()} تومان</div>
      <button class="remove-btn" data-id="${p.id}">✕ حذف</button>
    </th>`;
  });

  html += `</tr></thead><tbody>`;

  allSpecs.forEach((key) => {
    const isDiff = diffKeys.has(key);
    html += `<tr ${isDiff ? 'class="diff-row"' : ""}>`;
    html += `<td class="spec-name">${key}</td>`;

    selectedProducts.forEach((p) => {
      html += `<td class="${isDiff ? "highlight" : ""}">${p.specs[key] || "---"}</td>`;
    });

    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;

  document.getElementById("clearAllBtn")?.addEventListener("click", () => {
    if (confirm("همه محصولات از مقایسه حذف شوند؟")) {
      AppStorage.clearAll();
    }
  });
}

function showError(msg) {
  const container = document.getElementById("comparisonContainer");
  if (container) {
    container.innerHTML = `<div style="color: red; text-align: center; padding: 40px;">${msg}</div>`;
  }
}

document.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    AppStorage.removeItem(parseInt(removeBtn.dataset.id));
  }
});
