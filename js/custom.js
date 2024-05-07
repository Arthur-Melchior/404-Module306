(function () {
    'use strict';

    var tinyslider = function () {
        var el = document.querySelectorAll('.testimonial-slider');

        if (el.length > 0) {
            var slider = tns({
                container: '.testimonial-slider',
                items: 1,
                axis: "horizontal",
                controlsContainer: "#testimonial-nav",
                swipeAngle: false,
                speed: 700,
                nav: true,
                controls: true,
                autoplay: true,
                autoplayHoverPause: true,
                autoplayTimeout: 3500,
                autoplayButtonOutput: false
            });
        }
    };
    tinyslider();


    var sitePlusMinus = function () {

        var value,
            quantity = document.getElementsByClassName('quantity-container');

        function createBindings(quantityContainer) {
            var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
            var increase = quantityContainer.getElementsByClassName('increase')[0];
            var decrease = quantityContainer.getElementsByClassName('decrease')[0];
            increase.addEventListener('click', function (e) {
                increaseValue(e, quantityAmount);
            });
            decrease.addEventListener('click', function (e) {
                decreaseValue(e, quantityAmount);
            });
        }

        function init() {
            for (var i = 0; i < quantity.length; i++) {
                createBindings(quantity[i]);
            }
        };

        function increaseValue(event, quantityAmount) {
            value = parseInt(quantityAmount.value, 10);

            console.log(quantityAmount, quantityAmount.value);

            value = isNaN(value) ? 0 : value;
            value++;
            quantityAmount.value = value;
        }

        function decreaseValue(event, quantityAmount) {
            value = parseInt(quantityAmount.value, 10);

            value = isNaN(value) ? 0 : value;
            if (value > 0) value--;

            quantityAmount.value = value;
        }

        init();

    };
    sitePlusMinus();

    // Displays products dynamically by appending HTML elements to the product list container
    function displayProducts(limit = null) {
        const productListContainer = document.getElementById('product-list');
        if (!productListContainer) {
            console.log("Product list container not found");
            return;
        }
        productListContainer.innerHTML = '';

        let displaySet = products;
        if (limit) {
            displaySet = products.slice(0, limit);
        }

        displaySet.forEach(product => {
            const productElement = `
            <div class="col-12 col-md-4 col-lg-3 mb-5">
                <div class="product-item">
                    <img src="${product.image}" class="img-fluid product-thumbnail" alt="product">
                    <h3 class="product-title">${product.name}</h3>
                    <strong class="product-price">$${product.price.toFixed(2)}</strong>
					<button class="add-to-cart" data-product-id="${product.id}">+</button>
                </div>
            </div>
        `;
            productListContainer.innerHTML += productElement;
        });
        attachAddToCartEventListeners();
    }

    // Retrieves the cart from local storage or initializes a new one if none exists
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Saves the current state of the cart to local storage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Adds a product to the cart and updates the cart in local storage
    function addToCart(productId) {
        console.log("Adding to cart, Product ID:", productId);
        let cart = getCart();
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex > -1) {
            cart[productIndex].quantity += 1;
        } else {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push({...product, quantity: 1});
            } else {
                console.error("Product not found!");
                return;
            }
        }

        saveCart(cart);
        console.log("Product added to cart. Current cart:", getCart());
    }

    // Removes or decreases the quantity of a product in the cart
    function removeProductFromCart(productId) {
        let cart = getCart();
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex > -1) {

            cart[productIndex].quantity -= 1;

            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }

            saveCart(cart);
            displayCart();
        } else {
            console.error("Product not found in cart!");
        }
    }

    // Displays the current state of the cart in the UI
    function displayCart() {
        const cart = getCart();
        const cartTableBody = document.querySelector('.site-blocks-table tbody');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const cartTaxElement = document.getElementById('cart-tax');
        const cartTotalElement = document.getElementById('cart-total');

        const TAX_RATE = 0.077; // 7.7%
        let subtotal = 0;

        cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            cartTableBody.innerHTML = '<tr><td colspan="6" class="text-center">You haven’t added anything to your cart yet.</td></tr>';
        } else {
            cart.forEach(item => {
                let itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const row = `
                    <tr data-product-id="${item.id}">
                        <td class="product-thumbnail"><img src="${item.image}" alt="${item.name}" class="img-fluid"></td>
                        <td class="product-name">${item.name}</td>
                        <td>${item.price}</td>
                        <td class="product-quantity">${item.quantity}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td><button class="remove-from-cart" data-product-id="${item.id}">X</button></td>
                    </tr>
            `;
                cartTableBody.innerHTML += row;
            });

            let tax = subtotal * TAX_RATE;
            let total = subtotal + tax;

            if (cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            if (cartTaxElement) cartTaxElement.textContent = `$${tax.toFixed(2)}`;
            if (cartTotalElement) cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        attachRemoveButtons();
    }

    // Attaches event listeners to the remove buttons in the cart table
    function attachRemoveButtons() {
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.removeEventListener('click', handleRemoveFromCart);
            button.addEventListener('click', handleRemoveFromCart);
        });
    }

    // Event handler for removing items from the cart
    function handleRemoveFromCart(event) {
        const productId = parseInt(event.target.getAttribute('data-product-id'), 10);
        removeProductFromCart(productId);
        displayCart();
    }

    // Updates order summary based on items in the cart
    function updateOrderSummary() {
        const cart = getCart();
        const orderItemsElement = document.getElementById('order-items');
        const orderSubtotalElement = document.getElementById('order-subtotal');
        const orderTotalElement = document.getElementById('order-total');
        let TAX_RATE = 0.077; // 7.7%

        let subtotal = 0;

        orderItemsElement.innerHTML = '';

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const itemRow = `
            <tr>
                <td>${item.name} <strong class="mx-2">x</strong> ${item.quantity}</td>
                <td>${itemTotal.toFixed(2)} $</td>
            </tr>
        `;
            orderItemsElement.innerHTML += itemRow;
        });

        let tax = subtotal * TAX_RATE;
        let total = subtotal + tax;

        orderSubtotalElement.textContent = `${subtotal.toFixed(2)} $`;
        orderTotalElement.textContent = `${total.toFixed(2)} $`;
    }

    // Ensures the cart and order summary are updated on page load
    document.addEventListener('DOMContentLoaded', updateOrderSummary);

    // Ensures the cart is displayed on page load
    document.addEventListener('DOMContentLoaded', displayCart);

    // Specific page load conditions for different pages
    window.addEventListener('load', function () {
        if (document.body.id === "indexPage") {
            displayProducts(3);
        } else if (document.body.id === "shopPage") {
            displayProducts();
        }

        attachAddToCartEventListeners();
    });

    // This block sets up event listeners for all 'add-to-cart' buttons.
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productId = parseInt(event.target.getAttribute('data-product-id'), 10);
            addToCart(productId);
        });

    });

    // This block sets up event listeners for all 'remove-from-cart' buttons.
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productId = parseInt(event.target.getAttribute('data-product-id'), 10);
            removeProductFromCart(productId);
        });

    });

    // Function to attach event listeners to all 'add-to-cart' buttons on the page.
    function attachAddToCartEventListeners() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.removeEventListener('click', handleAddToCart);
            button.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(event) {
        const productId = parseInt(event.target.getAttribute('data-product-id'), 10);
        addToCart(productId);
        displayCart();
    }

})()