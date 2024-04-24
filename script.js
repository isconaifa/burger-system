const menu = document.getElementById('menu');
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemscontainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const count = document.getElementById("cart-count");
const address = document.getElementById("addressInput");
const addressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});


cartModal.addEventListener("click", function (event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
    //console.log(event.target);

    let parentButton = event.target.closest(".add-to-btn");
    //console.log(parentButton);
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }

});


//Function para adicionar no carrinho 
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {

        cart.push({
            name,
            price,
            quantity: 1,

        });
    }
    updateCartModal();
}


//Atualizar carrinho 
function updateCartModal() {
    cartItemscontainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");

        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
         <div class="flex items-center justify-between">

         <div>
         <p class="font-medium">${item.name}</p>
         <p>Qtd: ${item.quantity}</p>
         <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>

         </div>  

 
           <button class="remover-item" data-name="${item.name}">
           Remover
           </button>


         </div>  
        `
        total += item.price.toFixed(2) * item.quantity;

        cartItemscontainer.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    count.innerHTML = cart.length;
}

//Function de remover item do carrinho
cartItemscontainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("remover-item")) {
        const name = e.target.getAttribute("data-name");

        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
        updateCartModal();
    }
}

address.addEventListener('input', function (e) {
    let inputvalue = e.target.value;
    if (inputvalue !== "") {
        address.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")

    }

});

checkoutBtn.addEventListener('click', function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
            text: "Ops o restaurante está fechado no momento",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
           return;
    }

if (cart.length === 0) return;
        if (address.value === "") {
            addressWarn.classList.remove("hidden")
            address.classList.add("border-red-500")
            return;
        }

        //Enviar pdedido para api whats
        const cartIem = cart.map((item) => {
            return (
                `
    ${item.name} quantidade: (${item.quantity}) Preço: R$${item.price} |`
            )
        }).join("");

        const message = encodeURIComponent(cartIem)
        const phone = "+5585989321850"

        window.open(`http://wa.me/${phone}?text=${message} Endereço: ${address.value}`, "_blank")


    });

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const spanIem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen(); //

if (isOpen) {
    spanIem.classList.remove("bg-red-500");
    spanIem.classList.add("bg-green-600");
} else {
    spanIem.classList.remove("bg-green-600");
    spanIem.classList.add("bg-red-500");
}
