document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cardContent = this.nextElementSibling; // Get the .card-content div
            const isVisible = cardContent.style.display === "block";

            // Toggle the display and button text
            if (isVisible) {
                cardContent.style.display = "none";
                this.textContent = "Show More"; // Change button text to "Show More"
            } else {
                cardContent.style.display = "block";
                this.textContent = "Show Less"; // Change button text to "Show Less"
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");

    // Toggle buttons functionality (if needed for other parts of the page)
    const toggleButtons = document.querySelectorAll(".toggle-btn");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cardContent = this.previousElementSibling;
            const isVisible = cardContent.style.display === "block";

            cardContent.style.display = isVisible ? "none" : "block";
            this.textContent = isVisible ? "Ver más" : "Ver menos";
        });
    });

    // Event delegation for add-to-cart buttons
    productList.addEventListener("click", function (e) {
        if (e.target.classList.contains("add-to-cart")) {
            e.preventDefault();

            // Get product data from the button
            let button = e.target;
            let product = {
                id: button.getAttribute("data-id"),
                name: button.getAttribute("data-name"),
                price: parseFloat(button.getAttribute("data-price")),
                quantity: 1 // Default quantity is 1
            };

            // Add product to cart
            addToCart(product);
        }
    });

    // Fetch and display products
    fetch("../data/products.json")
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productCard = `
                    <div class="col-md-2 col-sm-6 mb-3">
                        <div class="card custom-card">
                            <div class="card-body">
                                <h5 class="card-title text-center">${product.title}</h5>
                                <p class="card-text text-center">${product.description}</p>
                                <p class="card-text text-center">Price: $${product.price}</p>
                                <a href="#" class="btn btn-primary add-to-cart" 
                                    data-name="${product.title}" 
                                    data-price="${product.price}" 
                                    data-id="${product.id}">
                                    Asociate
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                productList.innerHTML += productCard;
            });
        })
        .catch(error => console.error("Error loading products:", error));
});

// Function to add product to the cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    let productIndex = cart.findIndex(item => item.id === product.id);
    if (productIndex > -1) {
        // If product exists, increase the quantity
        cart[productIndex].quantity += 1;
    } else {
        // If product doesn't exist, add it
        cart.push(product);
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Immediately update the cart UI
    updateCartCount();
    renderCart();
}

// Update the cart count in the navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// Render the cart
function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartList = document.getElementById("cart-items-list");

    cartList.innerHTML = ""; // Clear previous cart items

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach(item => {
            let cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");
            cartItemDiv.innerHTML = `
                <p><strong>${item.name}</strong> - $${item.price} x 
                <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 60px; text-align: center;"></p>
                <button class="btn btn-sm btn-warning update-quantity" data-id="${item.id}">Update Quantity</button>
                <button class="btn btn-sm btn-danger delete-item" data-id="${item.id}">Remove</button>
            `;
            cartList.appendChild(cartItemDiv);
        });
    }
}

// Function to handle deleting a product
function deleteItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Function to handle updating the quantity
function updateQuantityFromTextarea(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity = newQuantity;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Event listeners for cart actions
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-item")) {
        let productId = event.target.getAttribute("data-id");
        deleteItem(productId);
    }

    if (event.target.classList.contains("update-quantity")) {
        let productId = event.target.getAttribute("data-id");
        let quantityInput = document.querySelector(`input[data-id="${productId}"]`);
        let newQuantity = parseInt(quantityInput.value);

        if (newQuantity > 0) {
            updateQuantityFromTextarea(productId, newQuantity);
        } else {
            alert("Invalid quantity.");
        }
    }
});

// Initial setup
window.onload = function () {
    updateCartCount();
    renderCart();
};

// Function to clear the cart
function clearCart() {
    localStorage.removeItem('cart'); // Remove the cart from localStorage
    updateCartCount(); // Reset the cart count to 0
    renderCart(); // Refresh the cart display
}

document.getElementById('clear-cart').addEventListener('click', function () {
    if (confirm('Are you sure you want to clear the cart?')) {
        clearCart();
    }
});

document.getElementById('buy-now').addEventListener('click', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        // SweetAlert for empty cart
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your cart is empty. Add items before proceeding to buy.',
        });
        return;
    }

    // SweetAlert confirmation dialog before purchase
    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to complete the purchase.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, complete purchase!',
        cancelButtonText: 'No, cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            // SweetAlert success message after purchase
            Swal.fire({
                icon: 'success',
                title: 'Purchase Complete!',
                text: 'Thank you for your purchase! Your order has been placed.',
                showConfirmButton: false,
                timer: 3000, // Closes after 3 seconds
            });

            // Clear the cart after the purchase
            clearCart();
        }
    });
});

