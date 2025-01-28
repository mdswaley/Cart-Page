document.addEventListener("DOMContentLoaded", async function () {
    const cartTable = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    try {
        const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
        const data = await response.json();

        const cartItems = data.items;
    
        renderCart(cartItems);
        

        document.querySelectorAll(".quantity-input").forEach((input) => {
            input.addEventListener("change", function () {
                updateQuantity(this.dataset.id, this.value, cartItems);
            });
        });


        document.querySelectorAll(".delete-icon").forEach((icon) => {
            icon.addEventListener("click", function () {
                removeItem(this.dataset.id, cartItems);
            });
        });

    } catch (error) {
        console.error("Error fetching cart data:", error);
    }
});

function updateQuantity(productId, newQuantity, cartItems) {
    newQuantity = parseInt(newQuantity);
    const item = cartItems.find(item => item.id == productId);
    if (item) {
        item.quantity = newQuantity;
        renderCart(cartItems);
    }
}

function removeItem(productId, cartItems) {
    const updatedCartItems = cartItems.filter(item => item.id != productId);
    renderCart(updatedCartItems);
}

function renderCart(cartItems) {
    const cartTable = document.getElementById("cart-items");
    let cartHTML = "";
    let totalPrice = 0;

    cartItems.forEach((item) => {
        const itemTotal = item.final_price * item.quantity;
        totalPrice += itemTotal;

        cartHTML += `
            <tr>
                <td><img src="${item.image}" class="product-img"></td>
                <td>${item.product_title}</td>
                <td>₹ ${item.final_price.toLocaleString()}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}"></td>
                <td>₹ ${itemTotal.toLocaleString()}</td>
                <td><i class="fas fa-trash delete-icon" data-id="${item.id}"></i></td>
            </tr>
        `;
    });

    cartTable.innerHTML = cartHTML;


    document.getElementById("subtotal").textContent = `₹ ${totalPrice.toLocaleString()}`;
    document.getElementById("total").textContent = `₹ ${totalPrice.toLocaleString()}`;


    document.querySelectorAll(".delete-icon").forEach((icon) => {
        icon.addEventListener("click", function () {
            removeItem(this.dataset.id, cartItems);
        });
    });

    document.querySelectorAll(".quantity-input").forEach((input) => {
        input.addEventListener("change", function () {
            updateQuantity(this.dataset.id, this.value, cartItems);
        });
    });
}
