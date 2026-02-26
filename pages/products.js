// pages/products.js
import { products } from "../data/mockData.js";
import { AppStorage } from "../utils/storage.js";

const TEXTS = {
  select: " انتخاب",
  remove: " حذف از مقایسه",
  full: " ظرفیت پر",
  notFound: "محصولی یافت نشد",
  loadError: "محصولات بارگذاری نشدند!",
  searching: "در حال جستجو...",
  added: "محصول با موفقیت اضافه شد",
  removed: "محصول از مقایسه حذف شد",
  limit: "حداکثر ۴ محصول می‌توانید انتخاب کنید",
  maxLimit: 4,
};

const DOM = {};

// ----------------- Notification -----------------
const Notification = {
  show(message, type = "info") {
    const oldToast = document.querySelector(".custom-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },
};

// ----------------- Loader -----------------
const Loader = {
  show() {
    let loader = document.getElementById("globalLoader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "globalLoader";
      loader.className = "global-loader hidden";
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <div class="loader-text">${TEXTS.searching}</div>
        </div>
      `;
      document.body.appendChild(loader);
    }
    loader.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  hide() {
    const loader = document.getElementById("globalLoader");
    if (loader) {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
    }
  },
};

// ----------------- DOM Caching -----------------
function cacheDOM() {
  DOM.list = document.getElementById("productList");
  DOM.searchInput = document.getElementById("searchInput");
  DOM.searchBtn = document.getElementById("searchBtn");
  DOM.floatBtn = document.getElementById("floatCompareBtn");
  DOM.floatCount = document.getElementById("floatCount");
  DOM.navCount = document.getElementById("navCompareCount");
}

// ----------------- Helper Functions -----------------
function showMessage(message, target = "list", type = "info") {
  if (target === "list") {
    if (DOM.list)
      DOM.list.innerHTML = `<li style="text-align:center;padding:40px;">${message}</li>`;
  } else {
    Notification.show(message, type);
  }
}

function filterProducts(term) {
  return products.filter(
    (p) => p.name.includes(term) || (p.brand && p.brand.includes(term)),
  );
}

function getButtonState(productId) {
  const selectedIds = AppStorage.getSelectedIds();
  const canAddMore = AppStorage.canAddMore();
  const isSelected = selectedIds.includes(productId);

  if (isSelected)
    return {
      isSelected: true,
      disabled: false,
      btnText: TEXTS.remove,
      btnClass: "remove-mode",
    };
  if (!canAddMore)
    return {
      isSelected: false,
      disabled: true,
      btnText: TEXTS.full,
      btnClass: "",
    };
  return {
    isSelected: false,
    disabled: false,
    btnText: TEXTS.select,
    btnClass: "",
  };
}

// ----------------- Rendering -----------------
function createProductCard(product) {
  const { isSelected, disabled, btnText, btnClass } = getButtonState(
    product.id,
  );
  const finalPrice = product.discount ? product.finalPrice : product.price;

  return `
    <li class="product-card ${isSelected ? "selected" : ""}" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="price">
          ${(finalPrice || 0).toLocaleString()} تومان
          ${product.discount ? `<span class="discount-badge">٪${product.discount}</span>` : ""}
        </div>
        <div class="rating">
          ${"★".repeat(Math.floor(product.rating || 0))} ${product.rating || 0}
        </div>
        <button class="add-btn ${btnClass}" data-id="${product.id}" ${disabled ? "disabled" : ""}>
          ${btnText}
        </button>
      </div>
    </li>
  `;
}

function renderProducts(productsToRender) {
  if (!DOM.list) return;
  if (!productsToRender || productsToRender.length === 0)
    return showMessage(TEXTS.notFound);

  DOM.list.innerHTML = productsToRender.map(createProductCard).join("");
  updateAllButtons();
}

// ----------------- Button & Counter Updates -----------------
function updateAllButtons() {
  document.querySelectorAll(".add-btn").forEach((btn) => {
    const { btnText, disabled, isSelected } = getButtonState(+btn.dataset.id);
    const card = btn.closest(".product-card");

    btn.textContent = btnText;
    btn.disabled = disabled;
    btn.className = `add-btn ${isSelected ? "remove-mode" : ""}`;

    if (card) card.classList.toggle("selected", isSelected);
  });
}

function updateFloatButton() {
  if (!DOM.floatBtn || !DOM.floatCount) return;
  const count = AppStorage.getCount();
  DOM.floatCount.textContent = count;
  DOM.floatBtn.classList.toggle("hidden", count === 0);
}

function updateNavCounter() {
  if (!DOM.navCount) return;
  DOM.navCount.textContent = `${AppStorage.getCount()}/${TEXTS.maxLimit}`;
}

function refreshUI() {
  updateAllButtons();
  updateFloatButton();
  updateNavCounter();
}

// ----------------- Search Setup -----------------
function setupSearch() {
  if (!DOM.searchInput || !DOM.searchBtn) return;

  let searchTimeout;

  const performSearch = () => {
    const term = DOM.searchInput.value.trim();
    if (!term) {
      renderProducts(products);
      return;
    }

    Loader.show(); // نمایش لودر قبل از setTimeout

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const filtered = filterProducts(term);
      renderProducts(filtered);
      Loader.hide(); // مخفی کردن لودر بعد از رندر
    }, 1500);
  };

  DOM.searchBtn.addEventListener("click", performSearch);
  DOM.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });
}

// ----------------- Event Listeners -----------------
document.addEventListener("DOMContentLoaded", () => {
  cacheDOM();

  if (!products || products.length === 0) {
    showMessage(TEXTS.loadError);
    return;
  }

  renderProducts(products);
  setupSearch();
  refreshUI();
});

window.addEventListener("storage-changed", refreshUI);

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-btn");
  if (btn) {
    e.preventDefault();
    const id = +btn.dataset.id;

    if (btn.classList.contains("remove-mode")) {
      AppStorage.removeItem(id);
      Notification.show(TEXTS.removed, "info");
    } else if (!btn.disabled) {
      const success = AppStorage.addItem(id);
      Notification.show(
        success ? TEXTS.added : TEXTS.limit,
        success ? "success" : "error",
      );
    }
    return;
  }

  const floatBtn = e.target.closest("#floatCompareBtn");
  if (floatBtn) {
    e.preventDefault();
    window.location.href = "compare.html";
  }
});
