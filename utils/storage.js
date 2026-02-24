// utils/storage.js

const AppStorage = {
  selectedItems: new Set(),

  addItem(id) {
    if (this.selectedItems.size >= 4) {
      this.showNotification("حداکثر ۴ آیتم می‌توانید انتخاب کنید", "error");
      return false;
    }

    if (this.selectedItems.has(id)) {
      return false;
    }

    this.selectedItems.add(id);
    this.persistToStorage();
    this.notify();
    this.showNotification("محصول با موفقیت اضافه شد", "success");
    return true;
  },

  removeItem(id) {
    if (this.selectedItems.delete(id)) {
      this.persistToStorage();
      this.notify();
      this.showNotification("محصول از مقایسه حذف شد", "info");
    }
  },

  isSelected(id) {
    return this.selectedItems.has(id);
  },

  getSelectedIds() {
    return Array.from(this.selectedItems);
  },

  getCount() {
    return this.selectedItems.size;
  },

  canAddMore() {
    return this.selectedItems.size < 4;
  },

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
  },

  persistToStorage() {
    try {
      localStorage.setItem(
        "selectedItems",
        JSON.stringify(this.getSelectedIds()),
      );
    } catch (e) {
      console.warn("خطا در ذخیره‌سازی:", e);
    }
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("selectedItems");
      if (saved) {
        const ids = JSON.parse(saved);
        this.selectedItems = new Set(ids.slice(0, 4));
      }
    } catch (e) {
      console.warn("خطا در بازیابی:", e);
    }
  },

  showNotification(message, type = "info") {
    // حذف نوتیفیکیشن قبلی
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

// بارگذاری از localStorage
AppStorage.loadFromStorage();

window.AppStorage = AppStorage;
