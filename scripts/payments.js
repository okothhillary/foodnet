document.addEventListener("DOMContentLoaded", () => {
    const paymentForm = document.getElementById("payment-form");
    const paymentTotalEl = document.getElementById("payment-total");
    const paymentMessage = document.getElementById("payment-message");
  
    //total cost from localStorage cart, could've picked it directly from the cart object but I got confused
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    let totalPrice = 0;
    Object.values(cart).forEach(item => {
      const price = item.price ? parseFloat(item.price) : 0;
      totalPrice += (price * item.quantity);
    });
  
    if (paymentTotalEl) {
      paymentTotalEl.textContent = `Total to Pay: Ksh. ${totalPrice.toFixed(2)}`;
    }
  
    
    paymentForm.addEventListener("submit", async (event) => {
      event.preventDefault(); 
  
      paymentMessage.classList.remove("error", "success");
      paymentMessage.textContent = "Processing payment... You will be redirected in 5 seconds.";
  
      
      try {
        const url = "https://paypaldimasv1.p.rapidapi.com/authorizeOrder";
        const options = {
          method: "POST",
          headers: {
            "x-rapidapi-key": "9717995e5dmsh125ec7fca0ddbd4p134764jsn856c027bf1c9",
            "x-rapidapi-host": "PayPaldimasV1.p.rapidapi.com",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            // no params but can still be added with modifications, like:
            // "intent": "CAPTURE",
            // "purchase_units[0][amount][value]": totalPrice.toString(),
            // "purchase_units[0][amount][currency_code]": "USD",
            // "purchase_units[0][description]": "Demo Payment"
          })
        };
  
        const response = await fetch(url, options);
        const result = await response.text();
        console.log("PayPal API response:", result);
  
        paymentMessage.textContent = "Payment attempt complete (success or fail). You will be redirected in 5 seconds.";
      } catch (error) {
        console.error("Payment error:", error);
        paymentMessage.textContent = `Error: ${error.message} - Redirecting in 5 seconds.`;
        paymentMessage.classList.add("error");
      }
      
  
      setTimeout(() => {
        window.location.href = "orders.html";
      }, 5000);
    });
  });
  