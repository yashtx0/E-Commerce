document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutSummary();
    
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleOrderSubmission);
    }
});

async function loadCheckoutSummary() {
    try {
        const response = await fetch('../PHP/get_cart.php');
        const result = await response.json();
        
        const container = document.getElementById('summary-items-container');
        const subtotalDisplay = document.getElementById('summary-subtotal');
        const totalDisplay = document.getElementById('summary-total');

        if (result.status === 'error' || result.data.length === 0) {
            window.location.href = 'Cart.html';
            return;
        }

        let htmlString = '';
        let grandTotal = 0;

        result.data.forEach(item => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            htmlString += `
                <div class="summary-item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>Rs. ${itemTotal.toLocaleString('en-IN')}</span>
                </div>
            `;
        });

        container.innerHTML = htmlString;
        subtotalDisplay.textContent = `Rs. ${grandTotal.toLocaleString('en-IN')}`;
        totalDisplay.textContent = `Rs. ${grandTotal.toLocaleString('en-IN')}`;

    } catch (error) {
        console.error("Failed to load summary:", error);
    }
}

async function handleOrderSubmission(e) {
    e.preventDefault();
    const messageBox = document.getElementById('checkout-message');
    const btn = document.getElementById('submit-btn');
    
    btn.textContent = 'Processing...';
    btn.disabled = true;
    messageBox.style.color = '#ccc';
    messageBox.textContent = 'Encrypting transaction data...';

    const fullAddress = `${document.getElementById('ship-address').value}, ${document.getElementById('ship-city').value}, ${document.getElementById('ship-zip').value}`;

    try {
        const response = await fetch('../PHP/process_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: fullAddress })
        });

        const result = await response.json();

        if (result.status === 'success') {
            messageBox.style.color = '#dfb96f'; 
            messageBox.textContent = 'Order successful! Redirecting you to the storefront...';
            
            setTimeout(() => {
                window.location.href = 'Webpage.html';
            }, 2000);
        } else {
            // The server caught an error (like an empty cart)
            messageBox.style.color = '#ff6b6b';
            messageBox.textContent = result.message;
            btn.textContent = 'Place Order Securely';
            btn.disabled = false;
        }
    } catch (error) {
        console.error("Order processing failed:", error);
        messageBox.style.color = '#ff6b6b';
        messageBox.textContent = 'Network connection failed. Please try again.';
        btn.textContent = 'Place Order Securely';
        btn.disabled = false;
    }
}