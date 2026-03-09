// PLAN & DISCOUNT LOGIC
const planRadios = document.querySelectorAll('input[name="plan"]');
const earlyBird = document.getElementById('earlyBird');
const groupLeader = document.getElementById('groupLeader');
const priceDisplay = document.getElementById('basePrice');
const bookBtn = document.getElementById('bookNowBtn');

function updatePrice() {

    let base = 10000;

    planRadios.forEach(radio => {
        if (radio.checked) {
            base = parseInt(radio.value);
        }
    });

    if (earlyBird && earlyBird.checked) {
        base -= base * 0.10;
    }

    if (groupLeader && groupLeader.checked) {
        base -= base * 0.15;
    }

    base = Math.round(base);

    if (priceDisplay) priceDisplay.textContent = base;
    if (bookBtn) bookBtn.href = "gear.html?price=" + base;

}

planRadios.forEach(r => r.addEventListener("change", updatePrice));

if (earlyBird) {
    earlyBird.addEventListener("change", updatePrice);
}

if (groupLeader) {
    groupLeader.addEventListener("change", updatePrice);
}

updatePrice();

// GET TREK PRICE FROM URL
const params = new URLSearchParams(window.location.search);
let trekPrice = parseInt(params.get("price")) || 0;

let cart = {};
let gearTotal = 0;


// UPDATE TOTALS
function updateTotals() {

    const ids = [
        ["trekPrice", trekPrice],
        ["gearTotal", gearTotal],
        ["finalTotal", trekPrice + gearTotal],
        ["trekPriceSide", trekPrice],
        ["gearTotalSide", gearTotal],
        ["finalTotalSide", trekPrice + gearTotal]
    ];

    ids.forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });

}

// RENDER CART
function renderCart() {

    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;

    cartItems.innerHTML = "";
    gearTotal = 0;

    for (let item in cart) {

        let data = cart[item];
        let itemTotal = data.price * data.qty;

        gearTotal += itemTotal;

        let div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
        <span>${item}</span>

        <div>
            <button class="minus" data-item="${item}">-</button>
            <span>${data.qty}</span>
            <button class="plus" data-item="${item}">+</button>
        </div>

        <span>₹${itemTotal}</span>
        `;

        cartItems.appendChild(div);

    }

    updateTotals();

    // PLUS BUTTON

    document.querySelectorAll(".plus").forEach(btn => {

        btn.onclick = () => {
            cart[btn.dataset.item].qty++;
            renderCart();
        };

    });

    // MINUS BUTTON

    document.querySelectorAll(".minus").forEach(btn => {

        btn.onclick = () => {

            cart[btn.dataset.item].qty--;

            if (cart[btn.dataset.item].qty <= 0) {
                delete cart[btn.dataset.item];
            }

            renderCart();
        };

    });

}

// ADD ITEMS TO CART

document.querySelectorAll(".gear-checkbox").forEach(btn => {

    btn.addEventListener("click", function () {

        const card = btn.closest(".gear-card");
        const name = card.querySelector("h3").textContent;
        const price = parseInt(btn.dataset.price);

        if (cart[name]) {
            cart[name].qty++;
        } else {
            cart[name] = {
                price: price,
                qty: 1
            };
        }

        renderCart();

    });

});

updateTotals();

// PORTER SERVICE OPTION

const porter = document.getElementById("porterService");

if (porter) {

    porter.addEventListener("change", function () {

        if (this.checked) {

            cart["Porter Service"] = {
                price: 1200,
                qty: 1
            };

        } else {

            delete cart["Porter Service"];

        }

        renderCart();

    });

}