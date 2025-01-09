let cartItems = document.querySelector('.cart-items');
let cartCounter = document.querySelector(".cart-count");
let btnCart = document.querySelectorAll('.cart-btn');
let totalCount = document.querySelector('.cart-count');
let totalCost = document.querySelector('.total-Cost');

let cartDom = loadCartFromLocalStorage();

// Toggle cart visibility
cartCounter.addEventListener('click', () => {
    cartItems.classList.toggle('active');
});

// Display initial cart items
cartDom.forEach(product => addItemToTheDom(product));
calculateTotal();

// Add to cart button functionality
btnCart.forEach(btn => {
    btn.addEventListener('click', () => {
        let parentElement = btn.parentElement;

        const product = {
            id: parentElement.querySelector('.product-id').value,
            name: parentElement.querySelector('.product-name').innerText,
            image: parentElement.querySelector('.product-img').getAttribute('src'),
            price: parseFloat(parentElement.querySelector('.product-price').innerText.replace("$", "")),
            quantity: 1,
        };

        let isCart = cartDom.some(item => item.id === product.id);

        if (!isCart) {
            addItemToTheDom(product);
            cartDom.push(product);
            saveCartToLocalStorage();
            calculateTotal();
        } else {
            alert(`Product "${product.name}" is already in the cart!`);
        }
    });
});

// Add item to DOM
function addItemToTheDom(product) {
    cartItems.insertAdjacentHTML("afterbegin", `
        <div class="cart-item">
            <input type="hidden" class="product-id" value="${product.id}">
            <img src="${product.image}" alt="">
            <h3 class="product-name">${product.name}</h3>
            <a href="#" class="btn-small" action="decrease">&minus;</a>
            <h3 class="product-quantity">${product.quantity}</h3>
            <a href="#" class="btn-small" action="increase">&plus;</a>
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <a href="#" class="btn-small btn-remove" action="remove">&times;</a>
        </div>
    `);

    addCartActions(product);
}

// Calculate total
function calculateTotal() {
    let total = 0;
    cartDom.forEach(item => {
        total += item.quantity * item.price;
    });
    totalCount.innerText = cartDom.length; // Total unique products
    totalCost.innerText = `$${total.toFixed(2)}`; // Total cost
}

// Add cart actions
function addCartActions(product) {
    const cartItem = document.querySelector(`.cart-item input[value="${product.id}"]`).parentElement;

    // Increase quantity
    cartItem.querySelector("[action='increase']").addEventListener("click", () => {
        cartDom.forEach(cartProduct => {
            if (cartProduct.id === product.id) {
                cartItem.querySelector(".product-quantity").innerText = ++cartProduct.quantity;
                saveCartToLocalStorage();
                calculateTotal();
            }
        });
    });

    // Decrease quantity
    cartItem.querySelector("[action='decrease']").addEventListener("click", () => {
        cartDom.forEach((cartProduct, index) => {
            if (cartProduct.id === product.id) {
                if (cartProduct.quantity > 1) {
                    cartProduct.quantity--;
                    cartItem.querySelector(".product-quantity").innerText = cartProduct.quantity;
                } else {
                    cartDom.splice(index, 1);
                    cartItem.remove();
                }
                saveCartToLocalStorage();
                calculateTotal();
            }
        });
    });

    // Remove item
    cartItem.querySelector("[action='remove']").addEventListener("click", () => {
        cartDom = cartDom.filter(cartProduct => cartProduct.id !== product.id);
        cartItem.remove();
        saveCartToLocalStorage();
        calculateTotal();
    });
}

// Save cart to Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cartDom));
}

// Load cart from Local Storage
function loadCartFromLocalStorage() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}