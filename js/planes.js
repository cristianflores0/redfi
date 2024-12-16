document.addEventListener("DOMContentLoaded", function () {
    const toggleButtons = document.querySelectorAll(".toggle-btn");

    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cardContent = this.nextElementSibling; 
            const isVisible = cardContent.style.display === "block";

            
            if (isVisible) {
                cardContent.style.display = "none";
                this.textContent = "Show More"; 
            } else {
                cardContent.style.display = "block";
                this.textContent = "Show Less"; 
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");

    const toggleButtons = document.querySelectorAll(".toggle-btn");
    toggleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cardContent = this.previousElementSibling;
            const isVisible = cardContent.style.display === "block";

            cardContent.style.display = isVisible ? "none" : "block";
            this.textContent = isVisible ? "Ver más" : "Ver menos";
        });
    });

    productList.addEventListener("click", function (e) {
        if (e.target.classList.contains("add-to-cart")) {
            e.preventDefault();

            let button = e.target;
            let product = {
                id: button.getAttribute("data-id"),
                name: button.getAttribute("data-name"),
                price: parseFloat(button.getAttribute("data-price")),
                quantity: 1 
            };

            addToCart(product);
        }
    });

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

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let productIndex = cart.findIndex(item => item.id === product.id);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    renderCart();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartList = document.getElementById("cart-items-list");

    cartList.innerHTML = ""; 

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        cart.forEach(item => {
            let cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");
            cartItemDiv.innerHTML = `
                <p><strong>${item.name}</strong> - $${item.price} x 
                <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 60px; text-align: center;"></p>
                <button class="btn btn-sm btn-warning update-quantity" data-id="${item.id}">Actualizar cantidad</button>
                <button class="btn btn-sm btn-danger delete-item" data-id="${item.id}">Eliminar</button>
            `;
            cartList.appendChild(cartItemDiv);
        });
    }
}

function deleteItem(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

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

window.onload = function () {
    updateCartCount();
    renderCart();
};

function clearCart() {
    localStorage.removeItem('cart'); 
    updateCartCount(); 
    renderCart();
}

document.getElementById('clear-cart').addEventListener('click', function () {
    if (confirm('¿Querés limpiar el carrito?')) {
        clearCart();
    }
});

document.getElementById('buy-now').addEventListener('click', function () {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Tu carrito está vacío. Agregá productos para comprar.',
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "Estás por confirmar tu compra",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, confirmo!',
        cancelButtonText: 'No, cancelo',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: '¡Compra completada!',
                text: '¡Gracias por tu compra! Tu orden fue recibida',
                showConfirmButton: false,
                timer: 3000, 
            });

            clearCart();
        }
    });
});

