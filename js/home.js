const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const tbodyAllproducts = document.querySelector("#tbody-products-all");
const productsAllbtn = document.querySelector("#btn-all-products");

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

const productToday = "products.json";
const tbodyproductsRecentToday = document.querySelector(
  "#tbody-products-today"
);

const fetchproducts = async () => {
  try {
    const response = await fetch(productToday);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

const dashboardproductsToday = async () => {
  const products = await fetchproducts();

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
  const allproducts = await fetchproducts();
  if (allproducts) {
    const allproductsValidate = allproducts.products;
    tbodyAllproducts.innerHTML = "";

    allproductsValidate.forEach((product) => {
      const tr = document.createElement("tr");
      const trContent = `
   <td>${product.id}</td>
   <td>${product.name}</td>
   <td>${product.value}</td>
   <td>${product.description}</td>
   <td>${product.amount}</td>
   <td>${product.amountMinimum}</td>
   <td  onclick="toggleSuppler(${product.supplier})" class="${
      product.supplier === "ALIEXPRESS"
        ? "aliexpress"
        : product.supplier === "AMAZON"
        ? "amazon"
        : product.supplier === "MERCADO LIVRE"
        ? "mercado-livre"
        : product.supplier === "SHOPEE"
        ? "shopee"
        : "warning"
    }">${product.supplier}</td>`;
      tr.innerHTML = trContent;
      tbodyAllproducts.appendChild(tr);
    });
  }
};
productsAllbtn.addEventListener("click", allproducts);

const toggleSuppler = async (id) => {
  const idSupplier = id;
  const allproductsItems = await fetchproducts();

  if (allproductsItems && idSupplier) {
    const allproductsItemsValidate = allproductsItems.products;

    const productItems = allproductsItemsValidate.find(
      (product) => product.id === idSupplier
    );
    const itens = productItems.itens;

    const totalproductValue = sumItemValues(productItems.itens);
    const formattedTotal = formatCurrency(totalproductValue);
    loaditemsproductClient(itens, formattedTotal);
  }
};
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const sumItemValues = (items) => {
  return items.reduce((total, item) => {
    return total + parseFloat(item.value) * item.quantity;
  }, 0);
};

const tbodyItemsproduct = document.querySelector("#tbody-supplier-description");

function loaditemsproductClient(ItemsproductClient, totalValueproduct) {
  console.log(ItemsproductClient);
  console.log(totalValueproduct);
  tbodyItemsproduct.innerHTML = "";

  if (ItemsproductClient.length > 0) {
    for (const itemproduct of ItemsproductClient) {
      const totalproductValeu = document.querySelector("#supplier-name");
      totalproductValeu.innerText = `${ItemsproductClient.name}`;

      const tr = document.createElement("tr");
      const trContent = `
        <td>${ItemsproductClient.description}</td>`;
      tr.innerHTML = trContent;
      tbodyItemsproduct.appendChild(tr);
    }
  } else {
    const tr = document.createElement("tr");
    const trContent = `
      <td>Vazio</td>
      <td>Vazio</td>
      <td>Vazio</td>
      <td>Total do pedido : vazio</td>`;
    tr.innerHTML = trContent;
    tbodyItemsproduct.appendChild(tr);
  }
}

const searchproductNumber = async () => {
  const inputproduct = document.getElementById("input-product");
  const idProduct = inputproduct.value;
  const allproductsResponse = await fetchproducts();

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
    totalproductValeu.innerText = "";
    tbodyAllproducts.innerHTML = "";
    tbodyItemsproduct.innerHTML = "";
    const tr = document.createElement("tr");
    const trContent = `
    <td>${productsearcher.id}</td>
    <td>${productsearcher.name}</td>
    <td>${productsearcher.value}</td>
    <td>${productsearcher.description}</td>
    <td>${productsearcher.amount}</td>
    <td>${productsearcher.amountMinimum}</td>
     <td class="${
      productsearcher.supplier === "ALIEXPRESS"
         ? "aliexpress"
         : productsearcher.supplier === "AMAZON"
         ? "amazon"
         : productsearcher.supplier === "MERCADO LIVRE"
         ? "mercado-livre"
         : productsearcher.supplier === "SHOPEE"
         ? "shopee"
         : "warning"
     }">${productsearcher.supplier}</td>`;
    tr.innerHTML = trContent;
    tbodyAllproducts.appendChild(tr);
    console.log(tbodyAllproducts);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const decrementButton = document.querySelector(".decrement");
  const incrementButton = document.querySelector(".increment");
  const quantityInput = document.getElementById("quantity");

  decrementButton.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
      quantityInput.value = currentValue - 1;
    }
  });

  incrementButton.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
});

//class="product-button" onclick="toggleItemOrder(${product.id})
// const tbodydashboardTopClientproducts = document.querySelector(
//   "#tbody-client-products"
// );

// const dashboardTopClientproducts = async () => {
//   const topClientproducts = await fetchproducts();

//   if (topClientproducts) {
//     const topClientproductValidate = topClientproducts.topClientOrdes;
//     tbodydashboardTopClientproducts.innerHTML = "";

//     topClientproductValidate.forEach((topClientproduct) => {
//       const numeroTelefone = topClientproduct.numberPhone.toString();
//       const numeroFormatado = `+1 ${numeroTelefone.slice(
//         1,
//         4
//       )}-${numeroTelefone.slice(4, 7)}-${numeroTelefone.slice(7)}`;
//       const tr = document.createElement("tr");
//       const trContent = `
//         <td>${topClientproduct.client}</td>
//         <td>${numeroFormatado}</td>
//         <td>${topClientproduct.email}</td>
//         <td>${topClientproduct.amount}</td>
//         `;
//       tr.innerHTML = trContent;
//       tbodydashboardTopClientproducts.appendChild(tr);
//     });
//   } else {
//     console.error("Failed to load products.");
//   }
// };

// dashboardTopClientproducts();
