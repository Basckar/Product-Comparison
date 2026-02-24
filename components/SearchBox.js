const SearchBox = {
  create() {
    const div = document.createElement("div");
    div.innerHTML =
      '<input type="text" id="search-input" placeholder="جستجو...">';
    return div;
  },
};

window.SearchBox = SearchBox;
