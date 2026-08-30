/* ==========================================================================
   AURA WEAR PAKISTAN - APPLICATION STATE & DATA
   ========================================================================== */

// WhatsApp Target Phone Number (Replace with merchant number)
const WHATSAPP_PHONE = "923001234567"; // Standard international format without '+' or '00'

// Product Catalog Data
const PRODUCTS = [
    {
        id: 1,
        name: "Aura Heavyweight Hoodie",
        price: 120.00,
        image: "assets/hoodie_black.png",
        category: "bags",
        badge: "Essential",
        description: "Engineered from 450GSM ultra-heavyweight loopback organic cotton. Features dropped shoulders, a double-layered structured hood, and a signature relaxed boxy fit. Finished with clean ribbed trims and seamless side seam pockets.",
        sizes: ["S", "M", "L", "XL"],
        details: {
            "Fit": "Oversized slouchy, drop shoulder",
            "Composition": "100% Organic Combed Cotton",
            "Weight": "450 GSM French Terry",
            "Origin": "Ethically crafted in Portugal"
        }
    },
    {
        id: 2,
        name: "Double-Breasted Classic Trench",
        price: 245.00,
        image: "assets/trench_coat_beige.png",
        category: "shoes",
        badge: "Premium Drop",
        description: "A timeless silhouette crafted from water-resistant premium gabardine cotton. Features traditional storm flaps, adjustable wrist straps, a removable waist belt, and deep inner pocket compartments. Fully lined with a silk-satin blend.",
        sizes: ["S", "M", "L", "XL"],
        details: {
            "Fit": "Tailored drape, regular length",
            "Composition": "80% Gabardine Cotton, 20% Polyester",
            "Lining": "100% Silk-Satin blend",
            "Care": "Dry clean only"
        }
    },
    {
        id: 3,
        name: "Cream knit Wool Sweater",
        price: 165.00,
        image: "assets/knitted_sweater.png",
        category: "tops",
        badge: "Best Seller",
        description: "Woven from premium extra-fine Merino wool with a soft, non-itch finish. Boasts a classic cable-knit texture, drop shoulder structure, and relaxed crew neckline. Perfect for elegant layering during cooler seasons.",
        sizes: ["S", "M", "L", "XL"],
        details: {
            "Fit": "Relaxed fit",
            "Composition": "100% Extra-fine Merino Wool",
            "Knit": "Heavy cable weave",
            "Care": "Hand wash cold, dry flat"
        }
    },
    {
        id: 4,
        name: "Aura Utility Cargo Pants",
        price: 135.00,
        image: "assets/cargo_pants_olive.png",
        category: "bottoms",
        badge: "Limited Release",
        description: "Heavy utility cargo trousers made from durable cotton twill. Featuring six-pocket styling, adjustable drawstring cords at the ankles, reinforced knee panels, and custom-branded gold-finish rivets.",
        sizes: ["S", "M", "L", "XL"],
        details: {
            "Fit": "Straight-leg loose fit",
            "Composition": "100% Cotton Twill",
            "Pockets": "6 functional compartments",
            "Hardware": "Branded copper rivets"
        }
    },
    {
        id: 5,
        name: "Vintage Indigo Denim Jacket",
        price: 180.00,
        image: "assets/denim_jacket_blue.png",
        category: "outerwear",
        badge: "Classic",
        description: "Constructed from 14oz raw selvedge denim, wash-softened for an authentic vintage feel. Features custom brass hardware, double chest pockets, and waist adjusters. Develops unique wear patterns over time.",
        sizes: ["S", "M", "L", "XL"],
        details: {
            "Fit": "Boxy cropped fit",
            "Composition": "100% Selvedge Denim",
            "Weight": "14oz raw denim",
            "Hardware": "Branded solid brass buttons"
        }
    },
    {
        id: 6,
        name: "Luxury Heavyweight Tee",
        price: 65.00,
        image: "assets/tee_oversized_white.png",
        category: "tops",
        badge: "staple",
        description: "A wardrobe staple cut from 280GSM heavy combed cotton. Features a high-tight ribbed collar that won't stretch, dropped shoulders, and a clean structured drape that flatters any body shape.",
        sizes: ["S", "M", "L", "XL"],
        details: {
            "Fit": "Boxy drop-shoulder",
            "Composition": "100% Combed Cotton",
            "Weight": "280 GSM",
            "Collar": "1.2-inch ribbing"
        }
    }
];

// App State
let cart = [];
let selectedSize = 'M'; // Default size
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

// LocalStorage Helper
const saveCartToStorage = () => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
};

const loadCartFromStorage = () => {
    const saved = localStorage.getItem('aura_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
};

/* ==========================================================================
   DOM ELEMENTS SELECTORS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Nav Elements
    const navMenu = document.getElementById("nav-menu");
    const menuToggle = document.getElementById("menu-toggle");
    
    // Cart Drawer Elements
    const cartToggle = document.getElementById("cart-toggle");
    const cartDrawer = document.getElementById("cart-drawer");
    const cartClose = document.getElementById("cart-close");
    const drawerOverlay = document.getElementById("drawer-overlay");
    const cartCountBadge = document.getElementById("cart-count");
    const cartHeaderCount = document.getElementById("cart-header-count");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartSubtotal = document.getElementById("cart-subtotal");
    const cartShipping = document.getElementById("cart-shipping");
    const cartTotal = document.getElementById("cart-total");
    
    // Catalog Elements
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const categoryFilters = document.getElementById("category-filters");
    
    // Modals
    const productModal = document.getElementById("product-modal");
    const productModalClose = document.getElementById("modal-close");
    const modalDetails = document.getElementById("modal-product-details");
    
    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutModalClose = document.getElementById("checkout-modal-close");
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutForm = document.getElementById("checkout-form");

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    const initApp = () => {
        loadCartFromStorage();
        renderProducts(PRODUCTS);
        updateCartUI();
        registerEventListeners();
    };

    /* ==========================================================================
       CATALOG / FILTERING / SORTING
       ========================================================================== */
    const renderProducts = (productsToRender) => {
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-cart-state" style="grid-column: 1/-1; padding: 4rem 0;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>No pieces found matching your criteria. Try adjusting your filters.</p>
                </div>
            `;
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-image-container">
                    <span class="product-badge">${product.badge}</span>
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn btn-primary view-details-btn" data-id="${product.id}">Quick View</button>
                    </div>
                </div>
                <div class="product-details">
                    <h3 class="product-title" data-id="${product.id}">${product.name}</h3>
                    <div class="product-meta">
                        <span class="product-price">${product.price.toFixed(2)} PKR</span>
                        <button class="product-add-quick quick-add-btn" data-id="${product.id}" aria-label="Add to cart">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Attach event listeners for dynamic cards
        document.querySelectorAll(".view-details-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                openProductModal(id);
            });
        });

        document.querySelectorAll(".product-title").forEach(title => {
            title.addEventListener("click", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                openProductModal(id);
            });
        });

        document.querySelectorAll(".quick-add-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                // Find parent element if nested icon triggers click
                const target = e.target.closest(".quick-add-btn");
                const id = parseInt(target.getAttribute("data-id"));
                // Quick add uses default 'M' size
                addToCart(id, 'M', 1);
            });
        });
    };

    const filterAndSortProducts = () => {
        let filtered = PRODUCTS.filter(product => {
            const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  product.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (currentSort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered);
    };

    /* ==========================================================================
       CART OPERATIONS & UI UPDATES
       ========================================================================== */
    const addToCart = (productId, size, quantity) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        // Check if matching item + size combination exists in cart
        const existingItem = cart.find(item => item.id === productId && item.size === size);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: quantity
            });
        }

        saveCartToStorage();
        updateCartUI();
        showToast(`Added ${quantity}x ${product.name} (Size ${size}) to bag.`);
    };

    const removeFromCart = (productId, size) => {
        cart = cart.filter(item => !(item.id === productId && item.size === size));
        saveCartToStorage();
        updateCartUI();
        showToast("Item removed from shopping bag.", "info");
    };

    const updateQuantity = (productId, size, change) => {
        const item = cart.find(item => item.id === productId && item.size === size);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            saveCartToStorage();
            updateCartUI();
        }
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const freeShippingThreshold = 150.00;
        const shippingCost = 15.00;
        
        let shipping = 0;
        if (subtotal > 0 && subtotal < freeShippingThreshold) {
            shipping = shippingCost;
        }

        const total = subtotal + shipping;

        return { subtotal, shipping, total, freeShippingThreshold };
    };

    const updateCartUI = () => {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        // Update badge counts
        if (cartCountBadge) cartCountBadge.innerText = count;
        if (cartHeaderCount) cartHeaderCount.innerText = count;

        // Render Cart Items
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-state">
                    <i class="fa-solid fa-bag-shopping"></i>
                    <p>Your shopping bag is empty.</p>
                    <a href="#shop" class="btn btn-outline cart-close-link" style="padding: 0.6rem 1.5rem; font-size: 0.75rem;">Shop Collection</a>
                </div>
            `;
            
            // Hide footer totals / check out button if cart is empty
            if (cartSubtotal) cartSubtotal.innerText = '0.00 PKR';
            if (cartTotal) cartTotal.innerText = '0.00 PKR';
            if (cartShipping) cartShipping.innerText = 'Calculated at checkout';
            if (checkoutBtn) checkoutBtn.disabled = true;
            
            const closeLink = cartItemsContainer.querySelector(".cart-close-link");
            if (closeLink) {
                closeLink.addEventListener("click", () => {
                    cartDrawer.classList.remove("active");
                    drawerOverlay.classList.remove("active");
                });
            }
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        cart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "cart-item";
            itemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-meta">
                        <span>Size: ${item.size}</span>
                    </div>
                    <div class="qty-control">
                        <button class="qty-btn qty-minus" data-id="${item.id}" data-size="${item.size}">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="qty-number">${item.quantity}</span>
                        <button class="qty-btn qty-plus" data-id="${item.id}" data-size="${item.size}">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-price-del">
                    <span class="cart-item-price">${(item.price * item.quantity).toFixed(2)} PKR</span>
                    <button class="cart-item-delete" data-id="${item.id}" data-size="${item.size}" aria-label="Delete item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Totals Calculations
        const { subtotal, shipping, total, freeShippingThreshold } = calculateTotals();
        
        if (cartSubtotal) cartSubtotal.innerText = `${subtotal.toFixed(2)} PKR`;
        if (cartShipping) {
            if (subtotal >= freeShippingThreshold) {
                cartShipping.innerText = "FREE";
                cartShipping.style.color = "var(--color-success)";
            } else {
                cartShipping.innerText = `${shipping.toFixed(2)} PKR`;
                cartShipping.style.color = "var(--color-text-muted)";
            }
        }
        if (cartTotal) cartTotal.innerText = `${total.toFixed(2)} PKR`;

        // Attach listeners for cart item controls
        cartItemsContainer.querySelectorAll(".qty-minus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const trigger = e.target.closest(".qty-minus");
                const id = parseInt(trigger.getAttribute("data-id"));
                const size = trigger.getAttribute("data-size");
                updateQuantity(id, size, -1);
            });
        });

        cartItemsContainer.querySelectorAll(".qty-plus").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const trigger = e.target.closest(".qty-plus");
                const id = parseInt(trigger.getAttribute("data-id"));
                const size = trigger.getAttribute("data-size");
                updateQuantity(id, size, 1);
            });
        });

        cartItemsContainer.querySelectorAll(".cart-item-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const trigger = e.target.closest(".cart-item-delete");
                const id = parseInt(trigger.getAttribute("data-id"));
                const size = trigger.getAttribute("data-size");
                removeFromCart(id, size);
            });
        });
    };

    /* ==========================================================================
       MODALS INTERACTION (Product Details & Checkout)
       ========================================================================== */
    const openProductModal = (productId) => {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product || !modalDetails) return;

        // Reset selected size to default when opening a new product
        selectedSize = product.sizes[0];

        // Format product specifications list
        let specListHtml = '';
        for (const [key, value] of Object.entries(product.details)) {
            specListHtml += `<li style="font-size: 0.85rem; margin-bottom: 0.4rem;"><strong style="color: var(--color-text-main); font-weight: 500;">${key}:</strong> <span style="color: var(--color-text-muted);">${value}</span></li>`;
        }

        // Populate detail HTML
        modalDetails.innerHTML = `
            <div class="modal-img-container">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-details">
                <span class="modal-category">${product.category}</span>
                <h2 class="modal-title">${product.name}</h2>
                <div class="modal-price">$${product.price.toFixed(2)}</div>
                
                <p class="modal-desc">${product.description}</p>
                
                <div style="margin-bottom: 1.5rem;">
                    <h5 class="option-title">Aura Specifications</h5>
                    <ul style="list-style: disc; padding-left: 1.2rem;">
                        ${specListHtml}
                    </ul>
                </div>

                <div class="detail-options">
                    <h5 class="option-title">Select Size</h5>
                    <div class="size-selector" id="modal-size-selector">
                        ${product.sizes.map(size => `
                            <button class="size-btn ${size === selectedSize ? 'active' : ''}" data-size="${size}">${size}</button>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-actions">
                    <div class="modal-qty">
                        <button class="qty-btn" id="modal-qty-minus"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-number" id="modal-qty-val">1</span>
                        <button class="qty-btn" id="modal-qty-plus"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button class="btn btn-primary" id="modal-add-to-cart" data-id="${product.id}">Add to Bag</button>
                </div>
            </div>
        `;

        // Handle Size Selection in Modal
        const sizeSelector = modalDetails.querySelector("#modal-size-selector");
        sizeSelector.addEventListener("click", (e) => {
            if (e.target.classList.contains("size-btn")) {
                sizeSelector.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
                selectedSize = e.target.getAttribute("data-size");
            }
        });

        // Handle Modal Quantity Selector
        const qtyVal = modalDetails.querySelector("#modal-qty-val");
        let modalQty = 1;

        modalDetails.querySelector("#modal-qty-minus").addEventListener("click", () => {
            if (modalQty > 1) {
                modalQty--;
                qtyVal.innerText = modalQty;
            }
        });

        modalDetails.querySelector("#modal-qty-plus").addEventListener("click", () => {
            modalQty++;
            qtyVal.innerText = modalQty;
        });

        // Add to cart from modal
        modalDetails.querySelector("#modal-add-to-cart").addEventListener("click", () => {
            addToCart(product.id, selectedSize, modalQty);
            // Close details modal
            productModal.classList.remove("active");
        });

        // Show details modal
        productModal.classList.add("active");
    };

    /* ==========================================================================
       WHATSAPP ORDER GENERATOR & SUBMIT
       ========================================================================== */
    const handleCheckoutSubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById("cust-name").value.trim();
        const phone = document.getElementById("cust-phone").value.trim() || "Not provided";
        const address = document.getElementById("cust-address").value.trim();
        const payment = document.getElementById("cust-payment").value;
        const notes = document.getElementById("cust-notes").value.trim() || "None";

        const { subtotal, shipping, total, freeShippingThreshold } = calculateTotals();

        // 1. Build Receipt Title
        let orderMessage = `🛍️ *Prime Fits - NEW ORDER*\n`;
        orderMessage += `=============================\n\n`;
        
        // 2. Add Customer details
        orderMessage += `👤 *CUSTOMER DETAILS*\n`;
        orderMessage += `• *Name:* ${name}\n`;
        orderMessage += `• *Phone:* ${phone}\n`;
        orderMessage += `• *Delivery Address:* ${address}\n`;
        orderMessage += `• *Payment Method:* ${payment}\n\n`;

        // 3. Add Cart pieces
        orderMessage += `📦 *ORDERED PIECES*\n`;
        cart.forEach((item, index) => {
            orderMessage += `${index + 1}. *${item.name}*\n`;
            orderMessage += `   Size: ${item.size} | Qty: ${item.quantity}\n`;
            orderMessage += `   Price: ${item.price.toFixed(2)} PKR each (Sub: ${(item.price * item.quantity).toFixed(2)} PKR)\n\n`;
        });
        
        // 4. Add Financial summary
        orderMessage += `=============================\n`;
        orderMessage += `💰 *ORDER SUMMARY*\n`;
        orderMessage += `• *Subtotal:* ${subtotal.toFixed(2)}\n PKR`;
        // orderMessage += `• *Shipping:* ${subtotal >= freeShippingThreshold ? 'FREE' : `${shipping.toFixed(2)} PKR`}\n`;
        orderMessage += `• *Total Amount:* ${total.toFixed(2)} PKR\n\n`;

        if (notes !== "None") {
            orderMessage += `📝 *SPECIAL NOTES*\n_${notes}_\n\n`;
        }

        orderMessage += `=============================\n`;
        orderMessage += `Please confirm availability. Thank you!`;

        // Encode parameters and redirect
        const encodedText = encodeURIComponent(orderMessage);
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

        // Clear cart
        cart = [];
        saveCartToStorage();
        updateCartUI();

        // Close Modals & Drawers
        checkoutModal.classList.remove("active");
        cartDrawer.classList.remove("active");
        drawerOverlay.classList.remove("active");

        showToast("Redirecting you to WhatsApp to place order...", "success");

        // Redirect with delay so user sees toast
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1200);
    };

    /* ==========================================================================
       TOAST NOTIFICATION ENGINE
       ========================================================================== */
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-check toast-icon"></i>';
        if (type === 'error') {
            iconHtml = '<i class="fa-solid fa-triangle-exclamation toast-icon"></i>';
        } else if (type === 'info') {
            iconHtml = '<i class="fa-solid fa-circle-info toast-icon"></i>';
        }

        toast.innerHTML = `
            ${iconHtml}
            <span class="toast-msg">${message}</span>
            <button class="toast-close" aria-label="Dismiss toast"><i class="fa-solid fa-xmark"></i></button>
        `;

        toastContainer.appendChild(toast);

        // Toast Dismiss click
        toast.querySelector(".toast-close").addEventListener("click", () => {
            dismissToast(toast);
        });

        // Auto Dismiss
        setTimeout(() => {
            dismissToast(toast);
        }, 4000);
    };

    const dismissToast = (toast) => {
        toast.classList.add("toast-out");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    };

    /* ==========================================================================
       EVENT LISTENERS REGISTRATION
       ========================================================================== */
    const registerEventListeners = () => {
        // Mobile Toggle Menu
        if (menuToggle && navMenu) {
            menuToggle.addEventListener("click", () => {
                navMenu.classList.toggle("active");
                const icon = menuToggle.querySelector("i");
                if (navMenu.classList.contains("active")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars-staggered";
                }
            });

            // Close Mobile Menu on links clicked
            document.querySelectorAll(".nav-link").forEach(link => {
                link.addEventListener("click", () => {
                    navMenu.classList.remove("active");
                    const icon = menuToggle.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-bars-staggered";
                });
            });
        }

        // Cart Drawer Toggles
        if (cartToggle && cartDrawer && drawerOverlay && cartClose) {
            cartToggle.addEventListener("click", () => {
                cartDrawer.classList.add("active");
                drawerOverlay.classList.add("active");
            });

            cartClose.addEventListener("click", () => {
                cartDrawer.classList.remove("active");
                drawerOverlay.classList.remove("active");
            });

            drawerOverlay.addEventListener("click", () => {
                cartDrawer.classList.remove("active");
                productModal.classList.remove("active");
                checkoutModal.classList.remove("active");
                drawerOverlay.classList.remove("active");
            });
        }

        // Modal Close Events
        if (productModal && productModalClose) {
            productModalClose.addEventListener("click", () => {
                productModal.classList.remove("active");
            });
            
            // Close modal when clicking outside contents
            productModal.addEventListener("click", (e) => {
                if (e.target === productModal) {
                    productModal.classList.remove("active");
                }
            });
        }

        if (checkoutModal && checkoutModalClose) {
            checkoutModalClose.addEventListener("click", () => {
                checkoutModal.classList.remove("active");
                drawerOverlay.classList.remove("active");
            });

            checkoutModal.addEventListener("click", (e) => {
                if (e.target === checkoutModal) {
                    checkoutModal.classList.remove("active");
                    drawerOverlay.classList.remove("active");
                }
            });
        }

        // Open Checkout Modal
        if (checkoutBtn && checkoutModal) {
            checkoutBtn.addEventListener("click", () => {
                // If cart is empty, do nothing
                if (cart.length === 0) return;
                
                // Show Checkout info modal
                checkoutModal.classList.add("active");
                drawerOverlay.classList.add("active");
            });
        }

        // Checkout Form Submit handler
        if (checkoutForm) {
            checkoutForm.addEventListener("submit", handleCheckoutSubmit);
        }

        // Filtering by Categories
        if (categoryFilters) {
            categoryFilters.addEventListener("click", (e) => {
                if (e.target.classList.contains("filter-btn")) {
                    categoryFilters.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
                    e.target.classList.add("active");
                    activeCategory = e.target.getAttribute("data-category");
                    filterAndSortProducts();
                }
            });
        }

        // Dynamic Text Search Input
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                searchQuery = e.target.value;
                filterAndSortProducts();
            });
        }

        // Price sorting options dropdown selector
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                currentSort = e.target.value;
                filterAndSortProducts();
            });
        }

        // Close Modals on ESC key
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                productModal.classList.remove("active");
                checkoutModal.classList.remove("active");
                cartDrawer.classList.remove("active");
                drawerOverlay.classList.remove("active");
            }
        });
    };

    // Trigger App Init
    initApp();
});
