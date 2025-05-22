// Global console log from the initial setup
console.log("JavaScript file loaded");

// --- Homepage specific JS (if any, currently none) ---

// --- Products Page Specific JS ---
document.addEventListener('DOMContentLoaded', () => {
    // Price range sliders for products.html
    const minPriceSlider = document.getElementById('min-price');
    const minPriceValueDisplay = document.getElementById('min-price-value');
    const maxPriceSlider = document.getElementById('max-price');
    const maxPriceValueDisplay = document.getElementById('max-price-value');

    if (minPriceSlider && minPriceValueDisplay) {
        minPriceValueDisplay.textContent = `$${minPriceSlider.value}`;
        minPriceSlider.oninput = function() {
            minPriceValueDisplay.textContent = `$${this.value}`;
        }
    }
    if (maxPriceSlider && maxPriceValueDisplay) {
        maxPriceValueDisplay.textContent = `$${maxPriceSlider.value}`;
        maxPriceSlider.oninput = function() {
            maxPriceValueDisplay.textContent = `$${this.value}`;
        }
    }

    // Thumbnail click for product-details.html
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.product-gallery .thumbnail');
    if (mainProductImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainProductImage.src = this.src.replace('_thumb', '_large').replace('thumb', 'large'); // A common pattern, adjust if names differ
            });
        });
    }

    // --- Main Site Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation'); 

    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isVisible = primaryNav.querySelector('ul').classList.toggle('nav-visible');
            mobileNavToggle.setAttribute('aria-expanded', isVisible);
            if(isVisible){
                mobileNavToggle.innerHTML = '&times;'; // Change to 'X' icon (close)
            } else {
                mobileNavToggle.innerHTML = '&#9776;'; // Change back to hamburger icon
            }
        });
    }

    // --- Night Mode Toggle ---
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
        nightModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('night-mode');
            // Save preference in localStorage
            if (document.body.classList.contains('night-mode')) {
                localStorage.setItem('theme', 'night-mode');
                nightModeToggle.textContent = '☀️'; // Sun icon for day mode
            } else {
                localStorage.setItem('theme', 'day-mode');
                nightModeToggle.textContent = '🌙'; // Moon icon for night mode
            }
        });
    }
    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'night-mode') {
        document.body.classList.add('night-mode');
        if (nightModeToggle) nightModeToggle.textContent = '☀️';
    } else {
        if (nightModeToggle) nightModeToggle.textContent = '🌙'; // Default to moon if no theme or day mode
    }


    // --- Fade-in Animation for Product Items on Scroll ---
    const productItems = document.querySelectorAll('.featured-products .product-item, .new-arrivals .product-item, .wish-list-item');
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = entry.target.dataset.delay || '0s'; // Use data-delay if set
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    productItems.forEach((item, index) => {
        // Optional: Add a slight delay based on index if not already set by other means
        // item.dataset.delay = `${index * 0.05}s`; 
        observer.observe(item);
    });


    // --- Cart Page (cart.html) Specific JS ---
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    function updateCartTotal() {
        if (!cartItemsContainer || !cartTotalElement) return; // Only run on cart page
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.dataset.price);
            const quantityInput = item.querySelector('.item-quantity');
            if (quantityInput) {
                const quantity = parseInt(quantityInput.value);
                const subtotal = price * quantity;
                const itemSubtotalElement = item.querySelector('.item-subtotal');
                if (itemSubtotalElement) {
                    itemSubtotalElement.textContent = subtotal.toFixed(2);
                }
                total += subtotal;
            }
        });
        cartTotalElement.textContent = total.toFixed(2);
        localStorage.setItem('cartTotal', total.toFixed(2)); // Store total for checkout page
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('change', event => {
            if (event.target.classList.contains('item-quantity')) {
                updateCartTotal();
            }
        });

        cartItemsContainer.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')) {
                const itemId = event.target.dataset.itemid;
                const itemToRemove = document.querySelector(`.cart-item[data-id='${itemId}']`);
                if (itemToRemove) {
                    itemToRemove.remove();
                    updateCartTotal();
                }
            }
        });
        // Initial calculation on cart page load
        updateCartTotal();
    }


    // --- Checkout Page (checkout.html) Specific JS ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const bkashDetailsDiv = document.getElementById('bkash-details');
        const cardDetailsDiv = document.getElementById('card-details');
        const paymentMessageElement = document.getElementById('payment-message');

        // Function to show/hide payment details based on selection
        function togglePaymentDetails() {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            if (selectedMethod === 'bkash') {
                bkashDetailsDiv.style.display = 'block';
                cardDetailsDiv.style.display = 'none';
            } else if (selectedMethod === 'visa' || selectedMethod === 'mastercard') {
                bkashDetailsDiv.style.display = 'none';
                cardDetailsDiv.style.display = 'block';
            } else {
                bkashDetailsDiv.style.display = 'none';
                cardDetailsDiv.style.display = 'none';
            }
        }

        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', togglePaymentDetails);
        });
        // Initial call to set correct payment details visibility
        togglePaymentDetails(); 
        
        // bKash mock verification
        const verifyBkashButton = document.getElementById('verifyBkash');
        if (verifyBkashButton) {
            verifyBkashButton.addEventListener('click', () => {
                const bkashNumber = document.getElementById('bkashNumber').value;
                if (bkashNumber.match(/^01[3-9]\d{8}$/)) { // Basic bKash number regex
                    paymentMessageElement.textContent = "bKash number format valid. (Mock verification successful)";
                    paymentMessageElement.style.color = "green";
                } else {
                    paymentMessageElement.textContent = "Invalid bKash number format.";
                    paymentMessageElement.style.color = "red";
                }
                setTimeout(() => paymentMessageElement.textContent = "", 3000);
            });
        }


        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (document.getElementById('step-review').style.display !== 'block') {
                alert("Please complete all previous steps and review your order.");
                return;
            }

            // Basic Form Validation for shipping
            let isValid = true;
            const requiredShippingInputs = document.querySelectorAll('#step-shipping input[required]');
            requiredShippingInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    // alert(`Please fill in ${input.labels[0] ? input.labels[0].textContent : input.name}.`);
                    // goToStep('shipping');
                    // input.focus();
                }
            });
             if (!isValid) {
                alert("Please fill in all required shipping details.");
                goToStep('shipping'); // Go back to shipping step
                // Focus on the first invalid shipping input (optional)
                for(let input of requiredShippingInputs) {
                    if (!input.value.trim()) {
                        input.focus();
                        break;
                    }
                }
                return; 
            }


            // Mock Payment Processing
            paymentMessageElement.textContent = "Processing payment...";
            paymentMessageElement.style.color = "blue";

            setTimeout(() => {
                // Simulate success or failure (e.g., 80% success rate)
                const isPaymentSuccessful = Math.random() < 0.9; // 90% chance of success

                if (isPaymentSuccessful) {
                    paymentMessageElement.textContent = "Payment Successful!";
                    paymentMessageElement.style.color = "green";
                    // Store minimal order details for confirmation page
                    localStorage.setItem('orderNumber', `ORD-${Date.now()}`);
                    localStorage.setItem('orderTotal', document.getElementById('review-total').textContent || localStorage.getItem('cartTotal') || 'N/A');
                    // In a real app, items would be more complexly stored
                    localStorage.setItem('orderItems', document.getElementById('review-items').textContent || "Items from your cart (details not fully passed)");


                    setTimeout(() => {
                        window.location.href = 'order-confirmation.html';
                    }, 1000);
                } else {
                    paymentMessageElement.textContent = "Payment Failed. Please try another method or contact support.";
                    paymentMessageElement.style.color = "red";
                }
            }, 2500); // Simulate 2.5 second delay
        });
    }
});

// Global function for checkout step navigation (needs to be global or properly scoped)
function goToStep(stepName) {
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.style.display = 'none';
    });
    const targetStep = document.getElementById(`step-${stepName}`);
    if (targetStep) {
        targetStep.style.display = 'block';
    }


    if (stepName === 'review') {
        populateOrderReview();
    }
}

function populateOrderReview() {
    // Shipping details
    const name = document.getElementById('fullName') ? document.getElementById('fullName').value : 'N/A';
    const address = document.getElementById('address') ? document.getElementById('address').value : 'N/A';
    const city = document.getElementById('city') ? document.getElementById('city').value : 'N/A';
    const postal = document.getElementById('postalCode') ? document.getElementById('postalCode').value : 'N/A';
    const country = document.getElementById('country') ? document.getElementById('country').value : 'N/A';
    
    const reviewShippingAddrEl = document.getElementById('review-shipping-address');
    if (reviewShippingAddrEl) {
        reviewShippingAddrEl.textContent = `${name}, ${address}, ${city}, ${postal}, ${country}`;
    }

    // Payment Method
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    const reviewPaymentMethodEl = document.getElementById('review-payment-method');
    if (reviewPaymentMethodEl) {
        reviewPaymentMethodEl.textContent = selectedPaymentMethod ? selectedPaymentMethod.value.toUpperCase() : 'Not selected';
    }


    // For items and total, it's better to pull from a reliable source like localStorage 
    // that cart.html would have populated.
    const reviewItemsEl = document.getElementById('review-items');
    if (reviewItemsEl) {
        // This is a simplified placeholder. A real app would have structured cart data.
        reviewItemsEl.textContent = localStorage.getItem('cartItemsPreview') || "Product 7 (x1), Product 8 (x2) - Placeholder";
    }
    
    const reviewTotalEl = document.getElementById('review-total');
    if (reviewTotalEl) {
        reviewTotalEl.textContent = `$${localStorage.getItem('cartTotal') || '0.00'}`;
    }
}


// Ensure cart total is loaded for review page if user navigates directly or refreshes
// This should be inside DOMContentLoaded or similar for checkout page specifically
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('checkout.html')) { // Only run on checkout page
        const cartTotalFromStorage = localStorage.getItem('cartTotal');
        const reviewTotalEl = document.getElementById('review-total');
        if (cartTotalFromStorage && reviewTotalEl && document.getElementById('step-review')) {
            // Check if we are on the review step, or about to go to it.
            // The populateOrderReview function will handle setting this.
        }
        // Initial population if starting on review or navigating
        if(document.getElementById('step-review') && document.getElementById('step-review').style.display === 'block'){
            populateOrderReview();
        }
        // Call togglePaymentDetails on checkout page load to ensure correct fields are shown
        if (document.getElementById('checkout-form')) {
             const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
             if (paymentMethodRadios.length > 0) {
                const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
                const bkashDetailsDiv = document.getElementById('bkash-details');
                const cardDetailsDiv = document.getElementById('card-details');
                if (selectedMethod === 'bkash') {
                    bkashDetailsDiv.style.display = 'block';
                    cardDetailsDiv.style.display = 'none';
                } else if (selectedMethod === 'visa' || selectedMethod === 'mastercard') {
                    bkashDetailsDiv.style.display = 'none';
                    cardDetailsDiv.style.display = 'block';
                } else {
                    bkashDetailsDiv.style.display = 'none';
                    cardDetailsDiv.style.display = 'none';
                }
             }
        }
    }

    // --- Account Page (account.html) Specific JS ---
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');
    const welcomeMessage = document.getElementById('welcome-message');
    const showRegisterLink = document.getElementById('show-register-form');
    const showLoginLink = document.getElementById('show-login-form');

    function updateAccountView() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            authSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            const userData = JSON.parse(localStorage.getItem(loggedInUser)); // User data is stored with email as key
            if(userData && welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${userData.name}!`;
            }
        } else {
            authSection.style.display = 'block';
            dashboardSection.style.display = 'none';
        }
    }

    if (authSection && dashboardSection) { // Ensure we are on account.html
        updateAccountView(); // Initial view setup

        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('login-form-container').style.display = 'none';
                document.getElementById('register-form-container').style.display = 'block';
            });
        }

        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('register-form-container').style.display = 'none';
                document.getElementById('login-form-container').style.display = 'block';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const messageEl = document.getElementById('login-message');
                
                const userDataString = localStorage.getItem(email); // User email is the key
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    // In a real app, compare hashed passwords. Here, direct compare for mock.
                    if (userData.password === password) { // Simulate password check
                        localStorage.setItem('loggedInUser', email); // Set loggedInUser to user's email
                        messageEl.textContent = 'Login successful!';
                        messageEl.style.color = 'green';
                        updateAccountView();
                        setTimeout(() => messageEl.textContent = '', 2000);
                    } else {
                        messageEl.textContent = 'Invalid email or password.';
                        messageEl.style.color = 'red';
                    }
                } else {
                    messageEl.textContent = 'User not found. Please register.';
                    messageEl.style.color = 'red';
                }
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                const messageEl = document.getElementById('register-message');

                if (password !== confirmPassword) {
                    messageEl.textContent = 'Passwords do not match.';
                    messageEl.style.color = 'red';
                    return;
                }
                if (password.length < 6) {
                    messageEl.textContent = 'Password must be at least 6 characters long.';
                    messageEl.style.color = 'red';
                    return;
                }

                if (localStorage.getItem(email)) {
                    messageEl.textContent = 'User with this email already exists. Please login.';
                    messageEl.style.color = 'red';
                } else {
                    // Simulate password hashing (very basic)
                    // const hashedPassword = "hashed_" + password; // Don't store plain text in real apps
                    const userData = { name, email, password: password }; // Storing plain for mock
                    localStorage.setItem(email, JSON.stringify(userData)); // Use email as key
                    messageEl.textContent = 'Registration successful! Please login.';
                    messageEl.style.color = 'green';
                    // Switch to login form
                    document.getElementById('register-form-container').style.display = 'none';
                    document.getElementById('login-form-container').style.display = 'block';
                    loginForm.reset(); // Clear login form for user
                    registerForm.reset();
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                updateAccountView();
            });
        }
    }

    // Wishlist page JS (basic remove item)
    const wishListItemsContainer = document.querySelector('.wish-list-items');
    if (wishListItemsContainer) {
        wishListItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-wishlist-item')) {
                e.target.closest('.wish-list-item').remove();
                // Check if wishlist is empty
                if (wishListItemsContainer.children.length === 0) {
                    const emptyMsg = document.getElementById('empty-wishlist-message');
                    if(emptyMsg) emptyMsg.style.display = 'block';
                }
            }
        });
         if (wishListItemsContainer.children.length === 0) {
            const emptyMsg = document.getElementById('empty-wishlist-message');
            if(emptyMsg) emptyMsg.style.display = 'block';
        }
    }
     // Saved Addresses page JS (basic remove)
    const savedAddressesList = document.querySelector('.saved-addresses-list');
    if (savedAddressesList) {
        savedAddressesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-danger') && e.target.closest('.address-item')) { // Assuming remove button has btn-danger
                e.target.closest('.address-item').remove();
                // Add logic to update localStorage if addresses are stored there
            }
        });
        // Mock form submission for adding address
        const addAddressForm = document.getElementById('add-address-form');
        if(addAddressForm){
            addAddressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Mock: New address saved! (Not actually saved in this demo)');
                addAddressForm.reset();
            });
        }
    }


});
