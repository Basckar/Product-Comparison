const DOMHelper = {
  createFragment(elements) {
    const fragment = document.createDocumentFragment();
    elements.forEach((el) => fragment.appendChild(el));
    return fragment;
  },

  showLoader() {
    document.getElementById("loader")?.classList.remove("hidden");
  },

  hideLoader() {
    document.getElementById("loader")?.classList.add("hidden");
  },
};

window.DOMHelper = DOMHelper;
