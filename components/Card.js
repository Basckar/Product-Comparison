const Card = {
  create(product, isSelected) {
    const card = document.createElement("li");
    card.className = "product-card";
    card.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border: 2px solid ${isSelected ? "#10b981" : "transparent"};
        `;
    card.dataset.id = product.id;

    card.innerHTML = `
            <img src="${product.image}" style="width:100%; height:150px; object-fit:cover; border-radius:8px;">
            <h3 style="margin:10px 0;">${product.name}</h3>
            <div style="color:#3b82f6; font-weight:bold;">${product.price.toLocaleString()} تومان</div>
            <div style="color:#fbbf24;">${"★".repeat(Math.floor(product.rating))}</div>
            <button class="compare-btn" data-id="${product.id}" style="
                width:100%; padding:8px; margin-top:10px; 
                background: ${isSelected ? "#10b981" : "#3b82f6"}; 
                color:white; border:none; border-radius:6px; cursor:pointer;
                ${isSelected ? "opacity:0.7" : ""}
            " ${isSelected ? "disabled" : ""}>
                ${isSelected ? "انتخاب شده" : "اضافه به مقایسه"}
            </button>
        `;

    return card;
  },
};

window.Card = Card;
