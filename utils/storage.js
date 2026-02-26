// utils/storage.js
export const STORAGE_KEY = "selectedItems";
export const MAX_ITEMS = 4;

class AppStorageClass {
  constructor() {
    this.selectedItems = new Set();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved);
        this.selectedItems = new Set(ids.slice(0, MAX_ITEMS));
      }
    } catch (e) {
      console.warn("خطا در بازیابی:", e);
    }
  }

  persistToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getSelectedIds()));
    } catch (e) {
      console.warn("خطا در ذخیره‌سازی:", e);
    }
  }

  notify() {
    window.dispatchEvent(
      new CustomEvent("storage-changed", {
        detail: {
          selected: this.getSelectedIds(),
          count: this.getCount(),
          canAddMore: this.canAddMore(),
        },
      }),
    );
  }

  addItem(id) {
    if (this.selectedItems.size >= MAX_ITEMS) return false;
    if (this.selectedItems.has(id)) return false;

    this.selectedItems.add(id);
    this.persistToStorage();
    this.notify();
    return true;
  }

  removeItem(id) {
    if (this.selectedItems.delete(id)) {
      this.persistToStorage();
      this.notify();
      return true;
    }
    return false;
  }

  getSelectedIds() {
    return Array.from(this.selectedItems);
  }

  getCount() {
    return this.selectedItems.size;
  }

  canAddMore() {
    return this.selectedItems.size < MAX_ITEMS;
  }

  clearAll() {
    this.selectedItems.clear();
    this.persistToStorage();
    this.notify();
  }
}

export const AppStorage = new AppStorageClass();
