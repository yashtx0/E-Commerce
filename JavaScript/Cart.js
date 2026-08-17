document.addEventListener('DOMContentLoaded', () => {
    loadCartData();
});

async function loadCartData() {
    try {
        const response = await fetch('../PHP/get_cart.php');
        const result = await response.json();
        
        const container = document.getElementById('dynamic-cart-container');
        const totalDisplay = document.getElementById('cart-total-price');
        
        if (result.status === 'error' || result.data.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #666; padding: 40px 0;">Your cart is currently empty.</p>`;
            totalDisplay.textContent = 'Rs. 0';
            return;
        }
        let htmlString = '';
        let grandTotal = 0;
        result.data.forEach(item => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            htmlString += `
                <div class="order-item" id="cart-item-${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-details">
                        <h3>${item.name}</h3>
                        <p>Rs. ${Number(item.price).toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div style="text-align: right;">
                        <p style="font-size: 14px; color: #888; margin-bottom: 5px;">Qty</p>
                        <input type="number" readonly value="${item.quantity}" class="qty-input" style="background: #f9f9f9;">
                    </div>
                </div>
            `;
        });
        container.innerHTML = htmlString;
        totalDisplay.textContent = `Rs. ${grandTotal.toLocaleString('en-IN')}`;

    } catch (error) {
        console.error("Failed to load cart:", error);
        document.getElementById('dynamic-cart-container').innerHTML = 
            `<p style="text-align: center; color: red;">Failed to load cart data.</p>`;
    }
}