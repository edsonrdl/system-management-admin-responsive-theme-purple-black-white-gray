const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const tbodyAllproducts = document.querySelector("#tbody-products-all");
const productsAllbtn = document.querySelector("#btn-all-products");
const deleteProductBtn = document.querySelector("#btn-delete-product");
const titleCreateDeleteUpdateProduct = document.querySelector(".title-create-delete-update-product");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");
});

function updateData() {
  const agora = new Date();
  const dia = agora.getDate();
  const mes = agora.getMonth() + 1;
  const ano = agora.getFullYear();

  const formatoData = `${dia < 10 ? "0" : ""}${dia}/${
    mes < 10 ? "0" : ""
  }${mes}/${ano}`;

  document.getElementById("current-date").innerText = formatoData;
}
updateData();

function showContentMain(contentId) {
  const allContentMain = document.querySelectorAll(".main-contant");
  allContentMain.forEach((contentMain) => {
    contentMain.classList.add("disabled-content");
  });

  const contentMainActive = document.getElementById(contentId);
  contentMainActive.classList.remove("disabled-content");
}

const valueProgressSales = 90;
const valueProgressExpenses = 50;
const valueProgressIncome = 30;
const valueProgressCanceled = 23;
const createCircularProgress = (
  circularProgressSelector,
  progressValueSelector,
  progressEndValue
) => {
  let circularProgress = document.querySelector(circularProgressSelector);
  let progressValue = document.querySelector(progressValueSelector);

  let progressStartValue = 0;
  let speed = 100;

  let progress = setInterval(() => {
    progressStartValue++;

    progressValue.textContent = `${progressStartValue}%`;
    circularProgress.style.background = `conic-gradient( #991AE6 ${
      progressStartValue * 3.6
    }deg ,#c478f3 0deg)`;

    if (progressStartValue === progressEndValue) {
      clearInterval(progress);
    }
  }, speed);
};

createCircularProgress(
  ".circular-progress-sales",
  ".progress-value-sales",
  valueProgressSales
);
createCircularProgress(
  ".circular-progress-expenses",
  ".progress-value-expenses",
  valueProgressExpenses
);
createCircularProgress(
  ".circular-progress-income",
  ".progress-value-income",
  valueProgressIncome
);
createCircularProgress(
  ".circular-progress-canceled",
  ".progress-value-canceled",
  valueProgressCanceled
);

// const productToday = "products.json";
const url = "http://localhost:8080/product/products";
const tbodyProductsRecentToday = document.querySelector("#tbody-products-today");

const getAllProducts = async () => {
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return null;
  }
};




const dashboardproductsToday = async () => {
  const products = await getAllProducts();
  console.log(products);

  if (products) {
    const productValidate = products.products;
    tbodyproductsRecentToday.innerHTML = "";

    productValidate.forEach((product) => {
      const tr = document.createElement("tr");
      const trContent = `
        <td>${product.name}</td>
        <td> R$:${product.value},00</td>
        <td>${product.description}</td>
      `;
      tr.innerHTML = trContent;
      tbodyproductsRecentToday.appendChild(tr);
    });
  } else {
    console.error("Failed to load products.");
  }
};

dashboardproductsToday();

const allproducts = async () => {
  const allproducts = await getAllProducts();
  if (allproducts) {
    const allproductsValidate = allproducts.products;
    tbodyAllproducts.innerHTML = "";

    allproductsValidate.forEach((product) => {
      let suppliers = product.supplier;
      const tr = document.createElement("tr");
      const trContent = `
   <td>${product.id}</td>
   <td>${product.name}</td>
   <td>${product.value}</td>
   <td>${product.description}</td>
   <td>${product.amount}</td>
   <td>${product.amountMinimum}</td>
   <td  onclick="toggleSuppler(${suppliers.id})" class="${
        suppliers.name === "ALIEXPRESS"
          ? "aliexpress"
          : suppliers.name === "AMAZON"
          ? "amazon"
          : suppliers.name === "MERCADO LIVRE"
          ? "mercado-livre"
          : suppliers.name === "SHOPEE"
          ? "shopee"
          : "warning"
      }">${suppliers.name}</td>
      <td><span onclick="putProduct(${product.id})" class="material-symbols-outlined btn-edit-product">
      edit</span></td>
      <td><span onclick="putProduct(${product.id})" class="material-symbols-outlined btn-delete-product">
      delete</span></td>
      `;
      tr.innerHTML = trContent;
      tbodyAllproducts.appendChild(tr);
    });
  }
};
productsAllbtn.addEventListener("click", allproducts);

const toggleSuppler = async (id) => {
  const idSupplier = id;
  const allproducts = await getAllProducts();
  const allproductsValidate = allproducts.products;

  allproductsValidate.forEach(async (product) => {
   
    let supplier = product.supplier;

    if(supplier.id==idSupplier){

      loaditemsproductClient(supplier);
    }
  });
};

const tbodySupplierDescription = document.querySelector("#tbody-supplier-description");
function loaditemsproductClient(supplier) {
      
      tbodySupplierDescription.innerHTML = "";

      const totalproductValeu = document.querySelector("#supplier-name");
      totalproductValeu.innerText = `${supplier.name}`;
      const tr = document.createElement("tr");
      const trContent = `
        <td>${supplier.description}</td>`;
      tr.innerHTML = trContent;
      tbodySupplierDescription.appendChild(tr);
}

const searchproductNumber = async () => {
  const inputproduct = document.getElementById("input-product");
  const idProduct = inputproduct.value;
  const allproductsResponse = await getAllProducts();

  if (allproductsResponse && idProduct) {
    const allproducts = allproductsResponse.products;
    const productsearcher = allproducts.find(
      (product) => product.id == idProduct
    );

    productsearcher && productsearcherFunction(productsearcher);
  }
};

function productsearcherFunction(productsearcher) {
  if (productsearcher) {
    const totalproductValeu = document.querySelector("#supplier-name");
    let suppliers = productsearcher.supplier;
    totalproductValeu.innerText = "";
    tbodyAllproducts.innerHTML = "";
    tbodySupplierDescription.innerHTML = "";
    const tr = document.createElement("tr");
    const trContent = `
    <td>${productsearcher.id}</td>
    <td>${productsearcher.name}</td>
    <td>${productsearcher.value}</td>
    <td>${productsearcher.description}</td>
    <td>${productsearcher.amount}</td>
    <td>${productsearcher.amountMinimum}</td>
     <td onclick="toggleSuppler(${suppliers.id})" class="${
      suppliers.name === "ALIEXPRESS"
         ? "aliexpress"
         : suppliers.name === "AMAZON"
         ? "amazon"
         : suppliers.name === "MERCADO LIVRE"
         ? "mercado-livre"
         : suppliers.name === "SHOPEE"
         ? "shopee"
         : "warning"
     }">${suppliers.name}</td>
     <td><span onclick="putProduct(${productsearcher.id})" class="material-symbols-outlined btn-edit-product">
     edit</span></td>
     <td><span onclick="putProduct(${productsearcher.id})" class="material-symbols-outlined btn-delete-product">
     delete</span></td>
     `;
    tr.innerHTML = trContent;
    tbodyAllproducts.appendChild(tr);
    console.log(tbodyAllproducts);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const decrementAmountMinumum = document.querySelector(".decrement-amountMinimum");
  const incrementAmountMinumum= document.querySelector(".increment-amountMinimum");
  const quantityInput = document.getElementById("amountMinimum");

  decrementAmountMinumum.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
      quantityInput.value = currentValue - 1;
    }
  });

  incrementAmountMinumum.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const decrementAmount= document.querySelector(".decrement-amount");
  const incrementAmount = document.querySelector(".increment-amount");
  const quantityInput = document.getElementById("amount");

  decrementAmount.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
      quantityInput.value = currentValue - 1;
    }
  });

  incrementAmount.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
});

const deleteProduct =function(event){
  const idProduct = event.currentTarget;
  const deleteProductssd = async () => {
    const product = await getProduct();
    if (allproducts) {
      const allproductsValidate = allproducts.products;
      tbodyAllproducts.innerHTML = "";
  
      allproductsValidate.forEach((product) => {
        let suppliers = product.supplier;
        const tr = document.createElement("tr");
        const trContent = `
     <td>${product.id}</td>
     <td>${product.name}</td>
     <td>${product.value}</td>
     <td>${product.description}</td>
     <td>${product.amount}</td>
     <td>${product.amountMinimum}</td>
     <td  onclick="toggleSuppler(${suppliers.id})" class="${
          suppliers.name === "ALIEXPRESS"
            ? "aliexpress"
            : suppliers.name === "AMAZON"
            ? "amazon"
            : suppliers.name === "MERCADO LIVRE"
            ? "mercado-livre"
            : suppliers.name === "SHOPEE"
            ? "shopee"
            : "warning"
        }">${suppliers.name}</td>
        <td><span onclick="putProduct(${product.id})" class="material-symbols-outlined btn-edit-product">
        edit</span></td>
        <td><span onclick="putProduct(${product.id})" class="material-symbols-outlined btn-delete-product">
        delete</span></td>
        `;
        tr.innerHTML = trContent;
        tbodyAllproducts.appendChild(tr);
      });
    }
  };
}

deleteProductBtn.addEventListener("click", deleteProduct);