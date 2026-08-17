async function checkAuthStatus() { // Check if the user is already logged in when the page loads
    try {
        const response = await fetch('../PHP/check_session.php');
        const data = await response.json();
        
        const loginBtn = document.getElementById('amazon-login');
        
        if (data.isLoggedIn) {
            loginBtn.innerHTML = `
                <p style="color: #dfb96f;">Welcome,</p>
                <strong>${data.name} (Log Out)</strong>
            `;
            
            loginBtn.href = '#'; 
            
            loginBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await fetch('../PHP/logout.php');
                window.location.reload(); 
            });
        }
    } catch (error) {
        console.error("Failed to check authentication status:", error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
//Loading products from php
async function loadProducts() {
    try {
        const response = await fetch('../PHP/get_products.php');
        const products = await response.json();
        
        renderProducts(products);
        
    } catch (error) {
        console.error("Error loading the database:", error);
        document.getElementById('product-grid').innerHTML = '<p style="color: #ccc; text-align: center; width: 100%;">Failed to load inventory. Is XAMPP running?</p>';
    }
}
//Rendering Products
function renderProducts(products) {
    const container = document.getElementById('product-grid');
    
    const htmlString = products.map(product => `
        <div class="product-card" id="${product.id}">
            <a href="${product.link}" target="_blank">
                <img src="${product.image}" alt="${product.name}">
            </a>
            <div class="product-title">${product.name}</div>
            
            <div class="product-price">Rs. ${Number(product.price).toLocaleString('en-IN')}</div>
            
            <div class="product-description">${product.description}</div>
            <button class="buy-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `).join('');

    container.innerHTML = htmlString;

    initializeSearchFilters();
}
//Search
function initializeSearchFilters() {
    const links = document.querySelectorAll('.dropdown-content a');
    const cards = document.querySelectorAll('.product-card');
    const details = document.querySelector('.search-dropdown');

    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href').slice(1);
            
            // Show/Hide logic
            cards.forEach(card => {
                if (card.id === targetId) {
                    card.classList.remove('hidden-card');
                } else {
                    card.classList.add('hidden-card');
                }
            });
            
            if (details) {
                details.open = false;
            }
            
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    checkAuthStatus(); 
});
//Adding to cart
async function addToCart(productId) {
    try {
        const response = await fetch('../PHP/add_to_cart.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert('Item added to your cart!'); 
        } else {
            if (result.message.includes('log in')) {
                alert(result.message);
                window.location.href = 'Signin.html';
            } else {
                alert(result.message);
            }
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}
//Add Carousel
let currentSlideIndex = 0;
let carouselTimer;

function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        startCarouselTimer();
    }
}

function startCarouselTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => {
        changeSlide(currentSlideIndex + 1);
    }, 5000);
}

function changeSlide(newIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = newIndex;
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function setSlide(index) {
    changeSlide(index);
    startCarouselTimer(); 
}
document.addEventListener('DOMContentLoaded', () => {
    // Grab the specific dropdown elements from your HTML
    const searchDropdown = document.querySelector('.search-dropdown');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    // --- 1. AUTO-CLOSE ON SELECTION ---
    // When a user clicks a product in the dropdown, close the menu
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            searchDropdown.removeAttribute('open');
            showClearButton();
        });
    });

    // --- 2. CLICK OUTSIDE TO CLOSE ---
    // If the dropdown is open and the user clicks anywhere else on the page, close it
    document.addEventListener('click', (e) => {
        if (searchDropdown && searchDropdown.hasAttribute('open')) {
            if (!searchDropdown.contains(e.target)) {
                searchDropdown.removeAttribute('open');
            }
        }
    });

    // --- 3. THE ESCAPE KEY ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close the dropdown if it's open
            if (searchDropdown && searchDropdown.hasAttribute('open')) {
                searchDropdown.removeAttribute('open');
            }
            // Clear the highlight/hash if one is active
            clearSearchHighlight(); 
        }
    });
});

// --- 4. THE HIGHLIGHT RESET ENGINE ---
function showClearButton() {
    // Check if the button already exists so we don't stack them
    if (!document.getElementById('clear-hash-btn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clear-hash-btn';
        clearBtn.innerHTML = '✕ Clear Selection';
        
        // Atlas Premium Styling
        clearBtn.style.cssText = `
            display: block;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #888;
            padding: 8px 16px;
            font-size: 11px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            margin: 20px auto; /* Centers it nicely above the grid */
            border-radius: 4px;
            transition: all 0.3s ease;
        `;
        
        clearBtn.onmouseover = () => clearBtn.style.color = '#fff';
        clearBtn.onmouseout = () => clearBtn.style.color = '#888';

        clearBtn.onclick = clearSearchHighlight;

        // Insert it right above the product grid
        const gridContainer = document.querySelector('.atlas-hero-container') || document.querySelector('.search-dropdown'); 
        gridContainer.parentNode.insertBefore(clearBtn, gridContainer.nextSibling);
    }
}

function clearSearchHighlight() {
    // 1. Construct the pure URL without any #hash
    const cleanURL = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
    
    // 2. Force the browser to navigate to this clean slate
    window.location.replace(cleanURL);
}