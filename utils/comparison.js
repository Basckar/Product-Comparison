// utils/comparison.js - موتور مقایسه محصولات

const ComparisonEngine = {
  /**
   * پیدا کردن تفاوت‌ها بین محصولات
   * @param {Array} products - آرایه محصولات انتخاب شده
   * @returns {Set} - مجموعه کلیدهایی که متفاوت هستند
   */
  findDifferences(products) {
    if (products.length < 2) return new Set();

    const specsList = products.map((p) => p.specs);
    const allKeys = new Set();

    // جمع‌آوری همه کلیدها
    specsList.forEach((spec) => {
      Object.keys(spec).forEach((key) => allKeys.add(key));
    });

    const diffKeys = new Set();

    // بررسی هر کلید
    for (const key of allKeys) {
      const values = specsList.map((spec) => spec[key]);
      const firstValue = values[0];

      const allSame = values.every((v) => v === firstValue);
      if (!allSame) {
        diffKeys.add(key);
      }
    }

    return diffKeys;
  },

  /**
   * دریافت تمام مشخصات به صورت آرایه
   * @param {Object} product
   * @returns {Array} - آرایه‌ای از [key, value]
   */
  getSpecsArray(product) {
    return Object.entries(product.specs || {});
  },

  /**
   * مقایسه دو محصول خاص
   * @param {Object} p1
   * @param {Object} p2
   * @returns {Object} - نتیجه مقایسه
   */
  compareTwo(p1, p2) {
    const diffKeys = this.findDifferences([p1, p2]);
    return {
      different: Array.from(diffKeys),
      same: Object.keys(p1.specs).filter((k) => !diffKeys.has(k)),
    };
  },
};

window.ComparisonEngine = ComparisonEngine;
