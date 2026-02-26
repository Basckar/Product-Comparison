// utils/helpers.js

//  = Constants  =
const TOAST_DURATION = 2500;
const TOAST_FADE_TIME = 300;
const LOADER_TEXT = "در حال جستجو...";

//  = فرمت‌کننده قیمت  =
export const formatPrice = (price) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان";

//  = Toast مرکزی  =
export const showNotification = (message, type = "info") => {
  removeExistingToast();

  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), TOAST_FADE_TIME);
  }, TOAST_DURATION);
};

const removeExistingToast = () => {
  const oldToast = document.querySelector(".custom-toast");
  if (oldToast) oldToast.remove();
};

//  = Global Loader  =
export const showGlobalLoader = (show) => {
  const loader = getOrCreateLoader();

  loader.classList.toggle("hidden", !show);
  document.body.style.overflow = show ? "hidden" : "";
};

const getOrCreateLoader = () => {
  let loader = document.getElementById("globalLoader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "globalLoader";
    loader.className = "global-loader hidden";
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">${LOADER_TEXT}</div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  return loader;
};

//  = Debounce  =
export const debounce = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

//  = نمایش خطا امن  =
export const showError = (elementId, message) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const li = document.createElement("li");
  li.style.cssText = "color: red; text-align: center; padding: 40px;";
  li.textContent = message;

  element.innerHTML = "";
  element.appendChild(li);
};

//  = انتخاب تصادفی  =
export const getRandomItem = (array) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
};
