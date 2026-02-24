document.addEventListener("DOMContentLoaded", () => {
  // نمایش تعداد محصولات انتخاب شده
  updateCompareCount();
});

// گوش دادن به تغییرات storage
window.addEventListener("storage-changed", (e) => {
  updateCompareCount();
});

function updateCompareCount() {
  const count = AppStorage.getCount();
  const compareCountEl = document.getElementById("compareCount");
  if (compareCountEl) {
    compareCountEl.textContent = `${count}/۴`;
  }
}
