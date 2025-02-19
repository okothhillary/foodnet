document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
  
    const orderDetails = document.getElementById('order-details');
  
    if (Object.keys(cart).length === 0) {
      orderDetails.innerHTML = "<p>No items in your order.</p>";
      return;
    }
  
    let totalPrice = 0;
  
    for (let mealId in cart) {
      const item = cart[mealId];
      const price = item.price ? parseFloat(item.price) : 0;
      const lineSubtotal = price * item.quantity;
      totalPrice += lineSubtotal;
  
      // container for each ordered item
      const itemDiv = document.createElement('div');
      itemDiv.className = 'order-item';
      itemDiv.innerHTML = `
        <h3>${item.strMeal}</h3>
        <img src="${item.strMealThumb}" alt="${item.strMeal}">
        <p>Quantity: ${item.quantity}</p>
        <p>Price: Ksh. ${price.toFixed(2)} each</p>
        <p>Subtotal: Ksh. ${lineSubtotal.toFixed(2)}</p>
      `;
      orderDetails.appendChild(itemDiv);
    }
  
    // total display
    const totalDiv = document.createElement('div');
    totalDiv.className = 'order-total';
    totalDiv.innerHTML = `<h3>Total: Ksh. ${totalPrice.toFixed(2)}</h3>`;
    orderDetails.appendChild(totalDiv);
  
    // confirmation message
    const notice = document.createElement('p');
    notice.className = 'notice';
    notice.textContent = 'Your order has been placed successfully.';
    orderDetails.appendChild(notice);
  });
  