// utils/comparison.js
export function findDifferences(products) {
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
