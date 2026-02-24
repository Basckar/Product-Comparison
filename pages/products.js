// page/products.js

document.addEventListener("DOMContentLoaded", () => {
  console.log(" products.js لود شد");

  if (!window.products) {
    showError("محصولات بارگذاری نشدند!");
    return;
  }

  renderProducts(window.products);
  updateAllButtons();
  updateFloatButton();
  setupSearch();
});

// گوش دادن به تغییرات storage
window.addEventListener("storage-changed", () => {
  console.log("📢 storage تغییر کرد");
  updateAllButtons();
  updateFloatButton();
});

//   نمایش لودر سراسری
function showGlobalLoader(show) {
  let loader = document.getElementById("globalLoader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "globalLoader";
    loader.className = "global-loader hidden";
    loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">در حال جستجو...</div>
            </div>
        `;
    document.body.appendChild(loader);
  }

  if (show) {
    loader.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

//   تابع جستجو
function performSearch() {
  const searchInput = document.getElementById("searchInput");
  const term = searchInput.value.trim();

  // اگه خالی بود، همه محصولات رو نشون بده
  if (term === "") {
    renderProducts(window.products);
    return;
  }

  // نمایش لودر
  showGlobalLoader(true);

  // شبیه‌سازی تاخیر پردازش
  setTimeout(() => {
    // فیلتر محصولات
    const filtered = window.products.filter(
      (p) => p.name.includes(term) || (p.brand && p.brand.includes(term)),
    );

    // رندر محصولات فیلتر شده
    renderProducts(filtered);

    // مخفی کردن لودر
    showGlobalLoader(false);

    console.log(`🔍 "${term}" - ${filtered.length} محصول پیدا شد`);
  }, 1500); // ۱.۵ ثانیه لودینگ
}

//   تنظیم جستجو
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  if (!searchInput || !searchBtn) return;

  // جستجو با کلیک دکمه
  searchBtn.addEventListener("click", () => {
    performSearch();
  });

  // جستجو با زدن Enter
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });

  searchInput.addEventListener("input", () => {});
}

//   به‌روزرسانی دکمه شناور
function updateFloatButton() {
  const floatBtn = document.getElementById("floatCompareBtn");
  const floatCount = document.getElementById("floatCount");

  if (!floatBtn || !floatCount || !window.AppStorage) return;

  const count = AppStorage.getCount();

  floatCount.textContent = count;

  if (count > 0) {
    floatBtn.classList.remove("hidden");
    floatBtn.classList.add("pulse");
    setTimeout(() => floatBtn.classList.remove("pulse"), 500);
  } else {
    floatBtn.classList.add("hidden");
  }
}

//   به‌روزرسانی همه دکمه‌ها
function updateAllButtons() {
  if (!window.AppStorage) return;

  const selectedIds = AppStorage.getSelectedIds();
  const canAddMore = AppStorage.canAddMore();

  document.querySelectorAll(".add-btn").forEach((btn) => {
    const productId = parseInt(btn.dataset.id);
    const isSelected = selectedIds.includes(productId);

    if (isSelected) {
      btn.textContent = "  حذف از مقایسه";
      btn.classList.add("remove-mode");
      btn.disabled = false;

      const card = btn.closest(".product-card");
      if (card) card.classList.add("selected");
    } else if (!canAddMore) {
      btn.textContent = "  ظرفیت پر";
      btn.classList.remove("remove-mode");
      btn.disabled = true;

      const card = btn.closest(".product-card");
      if (card) card.classList.remove("selected");
    } else {
      btn.textContent = "  انتخاب";
      btn.classList.remove("remove-mode");
      btn.disabled = false;

      const card = btn.closest(".product-card");
      if (card) card.classList.remove("selected");
    }
  });

  updateNavCounter();
}

//   به‌روزرسانی شمارنده ناوبری
function updateNavCounter() {
  const navCount = document.getElementById("navCompareCount");
  if (navCount && window.AppStorage) {
    navCount.textContent = `${AppStorage.getCount()}/۴`;
  }
}

//   نمایش خطا
function showError(msg) {
  const list = document.getElementById("productList");
  if (list) {
    list.innerHTML = `<li style="color: red; text-align: center; padding: 40px;">${msg}</li>`;
  }
}

//   رندر محصولات
function renderProducts(products) {
  const list = document.getElementById("productList");

  if (!list) {
    console.error("  productList پیدا نشد!");
    return;
  }

  if (!products || products.length === 0) {
    list.innerHTML =
      '<li style="text-align: center; padding: 40px;">محصولی یافت نشد</li>';
    return;
  }

  const selectedIds = window.AppStorage ? AppStorage.getSelectedIds() : [];
  const canAddMore = window.AppStorage ? AppStorage.canAddMore() : true;

  let html = "";
  products.forEach((product) => {
    const isSelected = selectedIds.includes(product.id);
    const finalPrice = product.discount ? product.finalPrice : product.price;

    let btnClass = "add-btn";
    let btnText = "  انتخاب";
    let disabled = false;

    if (isSelected) {
      btnClass += " remove-mode";
      btnText = "  حذف از مقایسه";
    } else if (!canAddMore) {
      disabled = true;
      btnText = "  ظرفیت پر";
    }

    html += `
            <li class="product-card ${isSelected ? "selected" : ""}" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">
                        ${finalPrice.toLocaleString()} تومان
                        ${product.discount ? `<span class="discount-badge">٪${product.discount}</span>` : ""}
                    </div>
                    <div class="rating">${"★".repeat(Math.floor(product.rating))} ${product.rating}</div>
                    <button class="${btnClass}" data-id="${product.id}" ${disabled ? "disabled" : ""}>
                        ${btnText}
                    </button>
                </div>
            </li>
        `;
  });

  list.innerHTML = html;
  setTimeout(updateAllButtons, 50);
}

//   مدیریت کلیک
document.addEventListener("click", (e) => {
  // کلیک روی دکمه انتخاب/حذف
  const btn = e.target.closest(".add-btn");
  if (btn) {
    e.preventDefault();
    const productId = parseInt(btn.dataset.id);

    if (!window.AppStorage) {
      alert("سیستم ذخیره‌سازی کار نمی‌کند!");
      return;
    }

    if (btn.classList.contains("remove-mode")) {
      AppStorage.removeItem(productId);
      console.log("  محصول حذف شد:", productId);
    } else if (!btn.disabled) {
      const added = AppStorage.addItem(productId);
      if (added) {
        console.log("  محصول اضافه شد:", productId);
      }
    }
    return;
  }

  // کلیک روی دکمه شناور
  const floatBtn = e.target.closest("#floatCompareBtn");
  if (floatBtn) {
    e.preventDefault();
    window.location.href = "compare.html";
  }
});

// به‌روزرسانی اولیه
updateNavCounter();
updateFloatButton();
