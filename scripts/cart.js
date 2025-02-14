let cart = JSON.parse(localStorage.getItem("cart")) || {};

export function getCart() {
    return cart;
}

export function addToCart(meal) {
    const { idMeal, strMeal, strMealThumb } = meal;

    if (!strMealThumb) {
        console.error("Meal image is missing:", meal);
        return;
    }

    if (cart[idMeal]) {
        cart[idMeal].quantity += 1;
    } else {
        cart[idMeal] = { idMeal, strMeal, strMealThumb, quantity: 1 };
    }

    saveCart();
    updateCartDisplay();
}

export function updateCart(mealId, change) {
    if (cart[mealId]) {
        cart[mealId].quantity += change;
        if (cart[mealId].quantity <= 0) {
            delete cart[mealId];
        }
    }
    
    saveCart();
    updateCartDisplay();
}

function removeFromCart(mealId) {
    delete cart[mealId];
    saveCart();
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; 

    const cartEntries = Object.values(cart);

    if (cartEntries.length === 0) {
        cartItemsContainer.innerHTML = "<p>Cart is empty</p>";
        return;
    }

    cartEntries.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";

        const img = document.createElement("img");
        img.src = item.strMealThumb || 'default-image.jpg';
        img.alt = item.strMeal;

        const name = document.createElement("span");
        name.textContent = `${item.strMeal} (${item.quantity})`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.className = "remove-btn";
        removeBtn.onclick = () => removeFromCart(item.idMeal);

        cartItemDiv.appendChild(img);
        cartItemDiv.appendChild(name);
        cartItemDiv.appendChild(removeBtn);

        cartItemsContainer.appendChild(cartItemDiv);
    });

    if (cartEntries.length > 0) {
        const checkoutBtn = document.createElement("button");
        checkoutBtn.textContent = "Checkout";
        checkoutBtn.className = "checkout-btn";
        checkoutBtn.onclick = () => window.location.href = "payments.html";

        cartItemsContainer.appendChild(checkoutBtn);
    }
}

document.addEventListener("DOMContentLoaded", updateCartDisplay);
