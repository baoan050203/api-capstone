let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let iconCart = document.querySelector(".icon-cart");
let iconCartSpan = document.querySelector(".icon-cart span");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let products = [];
let cart = [];
let totall = document.querySelector(".checkOut");
let clearcart = document.querySelector(".clearr");

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
// add du lieu tu mang product vào HTML render ra giao diện
const addDataToHTML = (product) => {
  // remove datas default from HTML
  console.log(product, "product call from");
  // add new datas
  if (products.length > 0) {
    // if has data
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("item");
      newProduct.innerHTML = `<img src="${product.img}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

function getDataAPI() {
  axios({
    method: "GET",
    url: "https://65aebe0f1dfbae409a757980.mockapi.io/phone", /////             thay link url backend
  })
    .then(function (response) {
      products = response.data;
      addDataToHTML(products);
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    })
    .catch(function (err) {
      console.log("err getData", err);
    });
}
//
getDataAPI();
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let id_product = positionClick.parentElement.dataset.id;
    addToCart(id_product);
  }
});
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[positionThisProductInCart].quantity =
      cart[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity =
          cart[positionItemInCart].quantity + 1;
        break;

      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

const calculateTotalPrice = () => {
  let totalPrice = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      let positionProduct = products.findIndex(
        (value) => value.id == item.product_id
      );
      let info = products[positionProduct];
      totalPrice += info.price * item.quantity;
    });
  }
  return totalPrice + "$";
};

let selectElement = document.querySelector(".select");

// Gắn sự kiện onChange cho thẻ select
selectElement.addEventListener("change", () => {
  let selectedValue = selectElement.value;
  if (selectedValue === "samsung" || selectedValue === "iphone") {
    renderProductsByBrand(selectedValue);
  }
});

function renderProductsByBrand(brand) {
  listProductHTML.innerHTML = "";

  let filteredProducts = products.filter((product) => product.type == brand);
  console.log(filteredProducts, "filter");
  addDataToHTML1(filteredProducts);
}

const addDataToHTML1 = (arr) => {
  // add new datas
  if (arr.length > 0) {
    arr.forEach((item) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = item.id;
      newProduct.classList.add("item");
      newProduct.innerHTML = `<img src="${item.img}" alt="">
            <h2>${item.name}</h2>
            <div class="price">$${item.price}</div>
            <button class="addCart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

////
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let positionProduct = products.findIndex(
        (value) => value.id == item.product_id
      );
      let info = products[positionProduct];
      listCartHTML.appendChild(newItem);
      newItem.innerHTML = `
        <div class="image">
            <img src="${info.img}">
        </div>
        <div class="name">
        ${info.name}
        </div>
        <div class="totalPrice">$${info.price * item.quantity}</div>
        <div class="quantity">
            <span class="minus">-</span>
            <span>${item.quantity}</span>
            <span class="plus">+</span>
            <span class="clearr">X</span>
        </div>
      `;

      newItem.querySelector(".clearr").addEventListener("click", () => {
        removeItemFromCart(item.product_id);
      });
    });
  }

  iconCartSpan.innerText = totalQuantity;
  const totalPrice = "Thanh Toán" + " :  " + calculateTotalPrice();
  totall.innerText = `${totalPrice}`;
};

// Hàm xóa sản phẩm khỏi cart
const removeItemFromCart = (product_id) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    cart.splice(positionItemInCart, 1);
    addCartToHTML();
    addCartToMemory();
  }
};

totall.addEventListener("click", () => {
  cart = [];
  // Cập nhật lại giao diện hiển thị của giỏ hàng
  addCartToHTML();
  // Xóa dữ liệu trong localStorage
  localStorage.removeItem("cart");
});

// const addCartToHTML = () => {
//   listCartHTML.innerHTML = "";
//   let totalQuantity = 0;
//   if (cart.length > 0) {
//     cart.forEach((item) => {
//       totalQuantity += item.quantity;
//       let newItem = document.createElement("div");
//       newItem.classList.add("item");
//       newItem.dataset.id = item.product_id;

//       let positionProduct = products.findIndex(
//         (value) => value.id == item.product_id
//       );
//       let info = products[positionProduct];
//       listCartHTML.appendChild(newItem);
//       newItem.innerHTML = `
//         <div class="image">
//             <img src="${info.img}">
//         </div>
//         <div class="name">
//         ${info.name}
//         </div>
//         <div class="totalPrice">$${info.price * item.quantity}</div>
//         <div class="quantity">
//             <span class="minus">-</span>
//             <span>${item.quantity}</span>
//             <span class="plus">+</span>
//             <span class="clearr">X</span>
//         </div>
//       `;
//     });
//   }

//   iconCartSpan.innerText = totalQuantity;
//   const totalPrice = calculateTotalPrice();
//   totall.innerText = `$${totalPrice}`;
// };
// const addCartToHTML = () => {
//   listCartHTML.innerHTML = "";
//   let totalQuantity = 0;
//   if (cart.length > 0) {
//     cart.forEach((item) => {
//       totalQuantity = totalQuantity + item.quantity;
//       let newItem = document.createElement("div");
//       newItem.classList.add("item");
//       newItem.dataset.id = item.product_id;

//       let positionProduct = products.findIndex(
//         (value) => value.id == item.product_id
//       );
//       let info = products[positionProduct];
//       listCartHTML.appendChild(newItem);
//       newItem.innerHTML = `
//                 <div class="image">
//                     <img src="${info.img}">
//                 </div>
//                 <div class="name">
//                 ${info.name}
//                 </div>
//                 <div class="totalPrice">$${info.price * item.quantity}</div>
//                 <div class="quantity">
//                     <span class="minus"><</span>
//                     <span>${item.quantity}</span>
//                     <span class="plus">></span>
//                 </div>
//             `;
//     });
//   }
//   iconCartSpan.innerText = totalQuantity;
// };

///
