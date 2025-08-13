document.addEventListener('DOMContentLoaded', function() {
    // 1. Tooltips initialization
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // =====  CAROUSELS =====
    function getRandomProducts(count = 10) {
    const allProducts = [];
    document.querySelectorAll('.product-variants .variant-card').forEach(card => {
        allProducts.push({
            img: card.querySelector('img').src,
            title: card.querySelector('h5').textContent,
            desc: card.querySelector('p').textContent,
            price: card.querySelector('.text-success').textContent,
            btn: card.querySelector('.add-to-cart').outerHTML
        });
    });
    return allProducts.sort(() => 0.5 - Math.random()).slice(0, count);
}

function initHotProductsCarousel() {
    const carousel = new Splide('#hot-products-carousel', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '20px',
        pagination: false,
        autoplay: {
            delay: 2000,
            pauseOnHover: false,
        },
        breakpoints: {
            992: { perPage: 2 },
            768: { perPage: 1 }
        }
    });
    
    // Update with random products
    const products = getRandomProducts();
    document.querySelector('#hot-products-carousel .splide__list').innerHTML = products.map(p => `
        <li class="splide__slide">
            <div class="hot-product-card">
                <img src="${p.img}" class="hot-product-img" alt="${p.title}">
                <div class="p-3">
                    <h5>${p.title}</h5>
                    <p class="text-muted small">${p.desc}</p>
                    <p class="text-success fw-bold">${p.price}</p>
                    ${p.btn}
                </div>
            </div>
        </li>
    `).join('');
    
    carousel.mount();
}
    
    new Splide('#testimonials-carousel', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '30px',
        pagination: false,
        autoplay: {
            delay: 2500,
            pauseOnHover: true,
        },
        breakpoints: {
            992: { perPage: 2 },
            768: { perPage: 1 }
        }
    }).mount();

    // =====  CATEGORY SYSTEM =====
    function setupCategories() {
    // Main categories (Shakes/Juices)
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Activate clicked button
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected category content
            const category = this.dataset.category;
            document.querySelectorAll('.category-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${category}-content`).classList.add('active');
            
            // Activate first subcategory
            const firstSub = document.querySelector(`#${category}-content .subcategory-btn`);
            if (firstSub) firstSub.click();
        });
    });

    // Subcategories (Ice Cream/Chocolate/etc)
    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.category-content');
            const category = parent.id.replace('-content', '');
            
            // Activate button
            parent.querySelectorAll('.subcategory-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show variants
            parent.querySelectorAll('.product-variants').forEach(v => v.classList.remove('active'));
            document.getElementById(`${category}-${this.dataset.subcategory}-variants`).classList.add('active');
        });
    });
    
    // Initialize
    document.querySelector('.category-btn.active').click();
}
   
        
    let cart = JSON.parse(localStorage.getItem('pioraCart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const product = {
                name: button.dataset.product,
                price: parseFloat(button.dataset.price),
                size: 'Classic',
                standardPrice: parseFloat(button.dataset.standardPrice),
                classicPrice: parseFloat(button.dataset.classicPrice),
                jumboPrice: parseFloat(button.dataset.jumboPrice)
            };
            
    const cartCount = document.querySelector('.cart-count');
    const cartFloatingBtn = document.getElementById('cartFloatingBtn');
    const orderItems = document.getElementById('orderItems');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const orderSummary = document.getElementById('orderSummary');
    const subtotalEl = document.getElementById('subtotal');
    const taxesEl = document.getElementById('taxes');
    const totalEl = document.getElementById('total');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const loginRequiredMessage = document.getElementById('loginRequiredMessage');
    const loginFromOrderBtn = document.getElementById('loginFromOrderBtn');
    
    // Size selection modal
    const sizeModal = document.getElementById('sizeModal');
    const sizeOptions = document.getElementById('sizeOptions');
    const confirmSizeSelection = document.getElementById('confirmSizeSelection');
    const cancelSizeSelection = document.getElementById('cancelSizeSelection');
    let selectedProduct = null;
    
    // Login modal
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form');
    
    // Profile elements
    const profileNavItem = document.getElementById('profileNavItem');
    const loginNavItem = document.getElementById('loginNavItem');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileSection = document.querySelector('.profile-section');
    const profileName = document.getElementById('profileName');
    const profilePhone = document.getElementById('profilePhone');
    const profileFullName = document.getElementById('profileFullName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhoneInput = document.getElementById('profilePhoneInput');
    const profileDOB = document.getElementById('profileDOB');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const profileEditButtons = document.getElementById('profileEditButtons');
    const cancelProfileEdit = document.getElementById('cancelProfileEdit');
    
    // Address management
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addressModal = new bootstrap.Modal(document.getElementById('addressModal'));
    const addressForm = document.getElementById('addressForm');
    const addressList = document.getElementById('addressList');
    const deliveryAddress = document.getElementById('deliveryAddress');
    
    // User state
    let currentUser = JSON.parse(localStorage.getItem('pioraUser')) || null;
    
    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Render cart items
    function renderCartItems() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            orderSummary.style.display = 'none';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        orderSummary.style.display = 'block';
        
        orderItems.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'd-flex justify-content-between align-items-center mb-3';
            itemEl.innerHTML = `
                <div>
                    <h6 class="mb-1">${item.name} (${item.size})</h6>
                    <p class="text-muted small mb-0">₹${item.price} × ${item.quantity}</p>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-3">₹${item.price * item.quantity}</span>
                    <button class="btn btn-sm btn-outline-danger remove-from-cart" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            orderItems.appendChild(itemEl);
            
            subtotal += item.price * item.quantity;
        });
        
        const taxes = subtotal * 0.05;
        const total = subtotal + taxes + 30;
        
        subtotalEl.textContent = `₹${subtotal}`;
        taxesEl.textContent = `₹${taxes.toFixed(2)}`;
        totalEl.textContent = `₹${total.toFixed(2)}`;
    }
    
    // Add to cart with size selection
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            selectedProduct = {
                name: button.dataset.product,
                standardPrice: parseFloat(button.dataset.standardPrice),
                classicPrice: parseFloat(button.dataset.classicPrice),
                jumboPrice: parseFloat(button.dataset.jumboPrice),
                price: parseFloat(button.dataset.price),
                size: 'Classic'
            };
            
            // Show size selection modal
            sizeOptions.innerHTML = `
                <div class="size-option" data-size="Standard" data-price="${selectedProduct.standardPrice}">
                    <div>
                        <h6>Standard</h6>
                        <p class="small mb-0">220ml</p>
                    </div>
                    <div class="price">₹${selectedProduct.standardPrice}</div>
                </div>
                <div class="size-option selected" data-size="Classic" data-price="${selectedProduct.classicPrice}">
                    <div>
                        <h6>Classic</h6>
                        <p class="small mb-0">350ml</p>
                    </div>
                    <div class="price">₹${selectedProduct.classicPrice}</div>
                </div>
                <div class="size-option" data-size="Jumbo" data-price="${selectedProduct.jumboPrice}">
                    <div>
                        <h6>Jumbo</h6>
                        <p class="small mb-0">500ml</p>
                    </div>
                    <div class="price">₹${selectedProduct.jumboPrice}</div>
                </div>
            `;
            
            document.getElementById('sizeModalTitle').textContent = `Select Size for ${selectedProduct.name}`;
            sizeModal.style.display = 'flex';
        }
    });
    
    // Size selection
    sizeOptions.addEventListener('click', function(e) {
        if (e.target.closest('.size-option')) {
            const sizeOption = e.target.closest('.size-option');
            document.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            sizeOption.classList.add('selected');
            selectedProduct.size = sizeOption.dataset.size;
            selectedProduct.price = parseFloat(sizeOption.dataset.price);
        }
    });
    
    // Confirm size selection
    confirmSizeSelection.addEventListener('click', function() {
        // Check if item already in cart
        const existingIndex = cart.findIndex(item => 
            item.name === selectedProduct.name && 
            item.size === selectedProduct.size
        );
        
        if (existingIndex !== -1) {
            cart[existingIndex].quantity++;
        } else {
            cart.push({
                ...selectedProduct,
                quantity: 1
            });
        }
        
        localStorage.setItem('pioraCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        sizeModal.style.display = 'none';
        
        // Show success message
        showToast(`${selectedProduct.name} added to cart!`);
    });
    
    // Cancel size selection
    cancelSizeSelection.addEventListener('click', function() {
        sizeModal.style.display = 'none';
    });
    
    // Remove from cart
    orderItems.addEventListener('click', function(e) {
        if (e.target.closest('.remove-from-cart')) {
            const index = e.target.closest('.remove-from-cart').dataset.index;
            cart.splice(index, 1);
            localStorage.setItem('pioraCart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        }
    });
    
    // Show toast notification
    function showToast(message) {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.position = 'fixed';
            toastContainer.style.bottom = '20px';
            toastContainer.style.left = '50%';
            toastContainer.style.transform = 'translateX(-50%)';
            toastContainer.style.zIndex = '2000';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast bg-success text-white p-3 rounded';
        toast.textContent = message;
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        // Hide after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Initialize cart
    updateCartCount();
    renderCartItems();
    
    // Floating cart button click
    cartFloatingBtn.addEventListener('click', function() {
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });
    
    updateCartCount();  
    renderCartItems();   
    
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const product = {
                name: button.dataset.product,
                price: parseFloat(button.dataset.price),
                size: 'Classic',
                standardPrice: parseFloat(button.dataset.standardPrice),
                classicPrice: parseFloat(button.dataset.classicPrice),
                jumboPrice: parseFloat(button.dataset.jumboPrice)
            };
            
       
       // ===== CUSTOM DRINK FUNCTIONALITY =====
// Size selection modal elements
function setupCustomDrinks() {
document.getElementById('customDrinkForm').addEventListener('submit', function(e) { /* ... */ });
    function showSizeSelectionForCustomDrink(drink) { /* ... */ }
const sizeModal = document.getElementById('sizeModal');
const sizeOptions = document.getElementById('sizeOptions');
const confirmSizeSelection = document.getElementById('confirmSizeSelection');
const cancelSizeSelection = document.getElementById('cancelSizeSelection');
let selectedProduct = null;

// Custom drink form submission
document.getElementById('customDrinkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate at least one ingredient is selected
    const hasBase = document.querySelector('#customDrinkForm input[name="base"]:checked');
    const hasFruit = document.querySelector('#customDrinkForm input[name="fruit"]:checked');
    
    if (!hasBase && !hasFruit) {
        alert('Please select at least one base ingredient or fruit');
        return;
    }
    
    // Get selected ingredients
    const baseIngredients = [];
    if (document.getElementById('milk').checked) baseIngredients.push('Milk');
    if (document.getElementById('yogurt').checked) baseIngredients.push('Yogurt');
    if (document.getElementById('water').checked) baseIngredients.push('Water');
    if (document.getElementById('coconutWater').checked) baseIngredients.push('Coconut Water');
    
    const fruits = [];
    if (document.getElementById('banana').checked) fruits.push('Banana');
    if (document.getElementById('strawberry').checked) fruits.push('Strawberry');
    if (document.getElementById('mango').checked) fruits.push('Mango');
    if (document.getElementById('apple').checked) fruits.push('Apple');
    if (document.getElementById('pineapple').checked) fruits.push('Pineapple');
    if (document.getElementById('kiwi').checked) fruits.push('Kiwi');
    
    const extras = [];
    if (document.getElementById('honey').checked) extras.push('Honey');
    if (document.getElementById('protein').checked) extras.push('Protein Powder');
    if (document.getElementById('chia').checked) extras.push('Chia Seeds');
    if (document.getElementById('almonds').checked) extras.push('Almonds');
    
    // Create custom drink object
    const customDrink = {
            name: "Amazing Piora Creation",
            base: baseIngredients.join(', '),
            fruits: fruits.join(', '),
            extras: extras.join(', '),
            price: 299,
            size: 'Classic'
        };
        

function showSizeSelectionForCustomDrink(drink) {
    confirmSizeSelection.addEventListener('click', function() {
            showToast(`${customDrink.name} added to cart!`);
            updateCartCount();
            setTimeout(() => {
                document.getElementById('order').scrollIntoView({behavior: 'smooth'});
            }, 1000);
        }, {once: true});
        
    // Show size selection modal
    sizeOptions.innerHTML = `
        <div class="size-option" data-size="Standard" data-price="${selectedProduct.standardPrice}">
            <div>
                <h6>Standard</h6>
                <p class="small mb-0">220ml</p>
            </div>
            <div class="price">₹${selectedProduct.standardPrice}</div>
        </div>
        <div class="size-option selected" data-size="Classic" data-price="${selectedProduct.classicPrice}">
            <div>
                <h6>Classic</h6>
                <p class="small mb-0">350ml</p>
            </div>
            <div class="price">₹${selectedProduct.classicPrice}</div>
        </div>
        <div class="size-option" data-size="Jumbo" data-price="${selectedProduct.jumboPrice}">
            <div>
                <h6>Jumbo</h6>
                <p class="small mb-0">500ml</p>
            </div>
            <div class="price">₹${selectedProduct.jumboPrice}</div>
        </div>
        <div class="custom-drink-details mt-3 p-2 bg-light rounded">
            <h6 class="mb-1">Your Recipe:</h6>
            <p class="small mb-1">${selectedProduct.details}</p>
        </div>
    `;
    
    document.getElementById('sizeModalTitle').textContent = `Select Size for Your Custom Drink`;
    sizeModal.style.display = 'flex';
}

// Size selection handling
sizeOptions.addEventListener('click', function(e) {
    if (e.target.closest('.size-option')) {
      if (e.target.closest('.size-option')) {
        const sizeOption = e.target.closest('.size-option');
        document.querySelectorAll('.size-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        sizeOption.classList.add('selected');
        selectedProduct.size = sizeOption.dataset.size;
        selectedProduct.price = parseFloat(sizeOption.dataset.price);
    }
});

// Confirm size selection
confirmSizeSelection.addEventListener('click', function() {
    if (!selectedProduct) return;
    
    // Add to cart
    const cart = JSON.parse(localStorage.getItem('pioraCart')) || [];
    
    // Check if identical custom drink already exists
    const existingIndex = cart.findIndex(item =>
        item.custom &&
        item.base === selectedProduct.base &&
        item.fruits === selectedProduct.fruits &&
        item.extras === selectedProduct.extras &&
        item.size === selectedProduct.size
    );
    
    if (existingIndex !== -1) {
        cart[existingIndex].quantity++;
    } else {
        cart.push({
            ...selectedProduct,
            quantity: 1
        });
    }
    
    localStorage.setItem('pioraCart', JSON.stringify(cart));
    updateCartCount();
    sizeModal.style.display = 'none';
    
    // Show success message
    showToast(`${selectedProduct.name} (${selectedProduct.size}) added to cart!`);
});

// Cancel size selection
cancelSizeSelection.addEventListener('click', function() {
    sizeModal.style.display = 'none';
    selectedProduct = null;
});

// Helper function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('pioraCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
    document.querySelector('.cart-count').style.display = count > 0 ? 'flex' : 'none';
}

// Helper function to show toast messages
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 10);
}


// =====  ORDER PROCESSING =====
function setupOrderProcessing() {
    const modal = document.getElementById('orderProcessingModal');
    
    document.getElementById('placeOrderBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show processing modal
        modal.style.display = 'flex';
        
        // Simulate payment processing
        setTimeout(() => {
            document.getElementById('paymentStatus').textContent = 'Payment received!';
            document.getElementById('successIcon').style.display = 'block';
            document.getElementById('continueShopping').style.display = 'inline-block';
        }, 3000);
    });
    
    document.getElementById('continueShopping').addEventListener('click', function() {
        modal.style.display = 'none';
        window.location.href = '#products';
    });
}



       // Login functionality
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    
    // Login tabs
    loginTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            loginTabs.forEach(t => t.classList.remove('active'));
            loginForms.forEach(form => form.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });
    
    // Close login modal when clicking outside
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, you would validate credentials with a backend
        const phone = document.getElementById('loginPhone').value;
        
        // Create user object
        currentUser = {
            id: 'user_' + Date.now(),
            phone: phone,
            name: 'User ' + phone.substring(phone.length - 4),
            email: '',
            addresses: [
                {
                    id: 'addr_1',
                    type: 'Home',
                    address: '123 Main Street, Apt 4B',
                    city: 'Mumbai',
                    pincode: '400001',
                    phone: '+91' + phone,
                    default: true
                }
            ],
            orders: []
        };
        
        // Save user to localStorage
        localStorage.setItem('pioraUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserState();
        
        // Close modal
        loginModal.style.display = 'none';
        
        // Show success message
        showToast('Logged in successfully!');
    });
    
    // Signup form submission
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phone = document.getElementById('signupPhone').value;
        const name = document.getElementById('signupName').value;
        
        // Create user object
        currentUser = {
            id: 'user_' + Date.now(),
            phone: phone,
            name: name,
            email: document.getElementById('signupEmail').value || '',
            addresses: [],
            orders: []
        };
        
        // Save user to localStorage
        localStorage.setItem('pioraUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserState();
        
        // Close modal
        loginModal.style.display = 'none';
        
        // Show success message
        showToast('Account created successfully!');
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('pioraUser');
        updateUserState();
        showToast('Logged out successfully');
    });
    
    // Update UI based on user state
    function updateUserState() {
        if (currentUser) {
            loginNavItem.style.display = 'none';
            profileNavItem.style.display = 'block';
            
            // Update profile info
            profileName.textContent = currentUser.name;
            profilePhone.textContent = currentUser.phone;
            profileFullName.value = currentUser.name;
            profileEmail.value = currentUser.email || '';
            profilePhoneInput.value = currentUser.phone;
            
            // Populate addresses
            renderAddresses();
            
            // Enable order form
            loginRequiredMessage.style.display = 'none';
            
            // Autofill delivery details
            autofillDeliveryDetails();
        } else {
            loginNavItem.style.display = 'block';
            profileNavItem.style.display = 'none';
            profileSection.style.display = 'none';
            
            // Disable order form
            loginRequiredMessage.style.display = 'block';
        }
    }
    
    
    
    // Initialize user state
    updateUserState();
    
    // Edit profile functionality
    editProfileBtn.addEventListener('click', function() {
        const inputs = profileForm.querySelectorAll('input');
        inputs.forEach(input => input.removeAttribute('readonly'));
        profileEditButtons.classList.remove('d-none');
        editProfileBtn.classList.add('d-none');
    });
    
    cancelProfileEdit.addEventListener('click', function() {
        const inputs = profileForm.querySelectorAll('input');
        inputs.forEach(input => input.setAttribute('readonly', 'true'));
        profileEditButtons.classList.add('d-none');
        editProfileBtn.classList.remove('d-none');
        
        // Reset values
        profileFullName.value = currentUser.name;
        profileEmail.value = currentUser.email || '';
        profilePhoneInput.value = currentUser.phone;
    });
    
    // Save profile changes
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        currentUser.name = profileFullName.value;
        currentUser.email = profileEmail.value;
        localStorage.setItem('pioraUser', JSON.stringify(currentUser));
        
        // Update UI
        profileName.textContent = currentUser.name;
        profileFullName.value = currentUser.name;
        profileEmail.value = currentUser.email || '';
        
        // Disable editing
        const inputs = profileForm.querySelectorAll('input');
        inputs.forEach(input => input.setAttribute('readonly', 'true'));
        profileEditButtons.classList.add('d-none');
        editProfileBtn.classList.remove('d-none');
        
        showToast('Profile updated successfully');
    });
    
    // Address management
    addAddressBtn.addEventListener('click', function() {
        // Reset form
        addressForm.reset();
        document.getElementById('addressId').value = '';
        document.getElementById('addressModalTitle').textContent = 'Add New Address';
        addressModal.show();
    });
    
    // Save address
    addressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const addressId = document.getElementById('addressId').value;
        const addressData = {
            id: addressId || 'addr_' + Date.now(),
            type: document.getElementById('addressType').value,
            address: document.getElementById('addressText').value,
            city: document.getElementById('addressCity').value,
            pincode: document.getElementById('addressPincode').value,
            default: document.getElementById('setDefaultAddress').checked
        };
        
        if (addressId) {
            // Update existing address
            const index = currentUser.addresses.findIndex(addr => addr.id === addressId);
            if (index !== -1) {
                currentUser.addresses[index] = addressData;
            }
        } else {
            // Add new address
            currentUser.addresses.push(addressData);
        }
        
        // If set as default, mark others as non-default
        if (addressData.default) {
            currentUser.addresses.forEach(addr => {
                if (addr.id !== addressData.id) {
                    addr.default = false;
                }
            });
        } else if (currentUser.addresses.length === 1) {
            // If it's the first address, set as default
            addressData.default = true;
        }
        
        // Save user
        localStorage.setItem('pioraUser', JSON.stringify(currentUser));
        
        // Update UI
        renderAddresses();
        
        // Close modal
        addressModal.hide();
        
        showToast('Address saved successfully');
    });
    
    // Render addresses
    function renderAddresses() {
        addressList.innerHTML = '';
        deliveryAddress.innerHTML = '<option value="">Select Address</option>';
        
        if (!currentUser || !currentUser.addresses.length) {
            addressList.innerHTML = '<div class="col-12 text-center py-4"><p>No addresses saved yet</p></div>';
            return;
        }
        
        currentUser.addresses.forEach(address => {
            // Add to profile address list
            const addressCard = document.createElement('div');
            addressCard.className = 'col-md-6 mb-3';
            addressCard.innerHTML = `
                <div class="address-card ${address.default ? 'default' : ''}">
                    <h5>${address.type}</h5>
                    <p>${address.address}<br>${address.city}, ${address.pincode}</p>
                    <div class="address-actions">
                        <button class="btn btn-sm btn-outline-primary me-1 edit-address" data-id="${address.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-address" data-id="${address.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            addressList.appendChild(addressCard);
            
            // Add to delivery address dropdown
            const option = document.createElement('option');
            option.value = address.id;
            option.textContent = `${address.type}: ${address.address}, ${address.city} - ${address.pincode}`;
            if (address.default) option.selected = true;
            deliveryAddress.appendChild(option);
        });
    }
    
    // Edit address
    addressList.addEventListener('click', function(e) {
        if (e.target.closest('.edit-address')) {
            const addressId = e.target.closest('.edit-address').dataset.id;
            const address = currentUser.addresses.find(addr => addr.id === addressId);
            
            if (address) {
                document.getElementById('addressId').value = address.id;
                document.getElementById('addressType').value = address.type;
                document.getElementById('addressText').value = address.address;
                document.getElementById('addressCity').value = address.city;
                document.getElementById('addressPincode').value = address.pincode;
                document.getElementById('setDefaultAddress').checked = address.default;
                
                document.getElementById('addressModalTitle').textContent = 'Edit Address';
                addressModal.show();
            }
        }
    });
    
    // Delete address
    addressList.addEventListener('click', function(e) {
        if (e.target.closest('.delete-address')) {
            const addressId = e.target.closest('.delete-address').dataset.id;
            currentUser.addresses = currentUser.addresses.filter(addr => addr.id !== addressId);
            
            // If we deleted the default, set first as default
            if (currentUser.addresses.length > 0 && !currentUser.addresses.some(addr => addr.default)) {
                currentUser.addresses[0].default = true;
            }
            
            localStorage.setItem('pioraUser', JSON.stringify(currentUser));
            renderAddresses();
            showToast('Address deleted');
        }
    });
    
    // Place order
    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
            loginRequiredMessage.style.display = 'block';
            return;
        }
        
        if (cart.length === 0) {
            showToast('Your cart is empty');
            return;
        }
        
        // Create order
        const order = {
            id: 'ORD_' + Date.now(),
            date: new Date().toISOString(),
            items: [...cart],
            address: deliveryAddress.value,
            status: 'pending',
            paymentMethod: document.querySelector('input[name="payment"]:checked').id
        };
        
        // Add to user's order history
        currentUser.orders.push(order);
        localStorage.setItem('pioraUser', JSON.stringify(currentUser));
        
        // Clear cart
        cart = [];
        localStorage.setItem('pioraCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        
        // Show success message
        showToast('Order placed successfully!');
        
        // Redirect to profile orders
        document.querySelector('#profile-orders .nav-link').click();
        profileSection.style.display = 'block';
        window.scrollTo(0, profileSection.offsetTop);
    });
    
    // Login from order section
    loginFromOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    
    // Profile navigation
    document.querySelectorAll('.profile-sidebar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all tabs
            document.querySelectorAll('.profile-tab').forEach(tab => {
                tab.style.display = 'none';
            });
            
            // Show selected tab
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).style.display = 'block';
            
            // Update active nav link
            document.querySelectorAll('.profile-sidebar .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Show profile section when navigating to profile
    document.querySelectorAll('a[href="#profile"]').forEach(link => {
        link.addEventListener('click', function() {
            profileSection.style.display = 'block';
            window.scrollTo(0, profileSection.offsetTop);
        });
    });
    
    // Initialize addresses
    if (currentUser) {
        renderAddresses();
    }
    
    
    // Autofill delivery details from profile
    function autofillDeliveryDetails() {
        if (currentUser) {
            document.getElementById('fullName').value = currentUser.name;
            document.getElementById('phoneNumber').value = currentUser.phone;
            
            // Select default address if available
            const defaultAddress = currentUser.addresses.find(addr => addr.default);
            if (defaultAddress) {
                document.getElementById('deliveryAddress').value = defaultAddress.id;
            }
        }
    }
    
    
    // ===== HELPER FUNCTIONS =====
// 1. Cart Counter
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('pioraCart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}

    document.getElementById('cartFloatingBtn').addEventListener('click', function() {
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    });

    // 2. Toast Notifications
function showToast(message) {
    // Create container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = '10000';
        document.body.appendChild(container);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = message;
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

    // Final initialization
    setupCategories();
initHotProductsCarousel();
initTestimonialsCarousel();
setupOrderProcessing();
setupCustomDrinks();
updateCartCount();

if (currentUser) {
        autofillDeliveryDetails();
    }
});
}}})}})});
  
