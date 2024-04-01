const sideMenu =document.querySelector("aside");
 const menuBtn=document.querySelector("#menu-btn");
 const closeBtn =document.querySelector("#close-btn");
 const themeToggler=document.querySelector('.theme-toggler');


 menuBtn.addEventListener('click',()=>{
    sideMenu.style.display='block';
 })

 closeBtn.addEventListener('click',()=>{
    sideMenu.style.display='none';
 })

 themeToggler.addEventListener('click',()=>{
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
 })

 function atualizarData() {
  const agora = new Date();
  const dia = agora.getDate();
  const mes = agora.getMonth() + 1; 
  const ano = agora.getFullYear();

  const formatoData = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${ano}`;

  document.getElementById('data-atual').innerText = formatoData;
}


atualizarData();
 
 function showContentMain(contentId) {
   const allContentMain = document.querySelectorAll('.main-contant');
   allContentMain.forEach(contentMain => {
    contentMain.classList.add('disabled-content');
   });

   const contentMainActive = document.getElementById(contentId);
   contentMainActive.classList.remove('disabled-content');
}

const valueProgressSales=90;
const valueProgressExpenses=50;
const valueProgressIncome=30;
const valueProgressCanceled=23;
const createCircularProgress = (circularProgressSelector, progressValueSelector, progressEndValue) => {
  let circularProgress = document.querySelector(circularProgressSelector);
  let progressValue = document.querySelector(progressValueSelector);

  let progressStartValue = 0;
  let speed = 100;

  let progress = setInterval(() => {
    progressStartValue++;

    progressValue.textContent = `${progressStartValue}%`;
    circularProgress.style.background = `conic-gradient( #BA58EF ${progressStartValue * 3.6}deg ,#ffffff 0deg)`;

    if (progressStartValue === progressEndValue) {
      clearInterval(progress);
    }
  }, speed);
};

createCircularProgress(".circular-progress-sales", ".progress-value-sales", valueProgressSales);
createCircularProgress(".circular-progress-expenses", ".progress-value-expenses", valueProgressExpenses);
createCircularProgress(".circular-progress-income", ".progress-value-income", valueProgressIncome);
createCircularProgress(".circular-progress-canceled", ".progress-value-canceled", valueProgressCanceled);

 
const productToday = 'productsToday.json';
const tbodyproductsRecentToday = document.querySelector('#tbody-products-today');

const fetchproducts = async () => {
  try {
    const response = await fetch(productToday);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

const dashboardproductsToday = async () => {
  const products = await fetchproducts();

  if (products) {
    const productValidate=products.products;
    tbodyproductsRecentToday.innerHTML = '';

    productValidate.forEach(product => {
      const tr = document.createElement('tr');
      const trContent = `
        <td>${product.client}</td>
        <td>${product.numberproduct}</td>
        <td class="${product.status === 'Cancelado' ? 'canceled' : product.status === 'Pendente' ? 'primary' : 'success'}">${product.status}</td>
      `;
      tr.innerHTML = trContent;
      tbodyproductsRecentToday.appendChild(tr);

    });
  } else {
    console.error('Failed to load products.');
  }
}

dashboardproductsToday();


const tbodydashboardTopClientproducts = document.querySelector('#tbody-client-products');

const dashboardTopClientproducts = async () => {
  const topClientproducts = await fetchproducts();

  if (topClientproducts) {
    const topClientproductValidate=topClientproducts.topClientOrdes;
    tbodydashboardTopClientproducts.innerHTML = '';

    topClientproductValidate.forEach(topClientproduct => {
      const numeroTelefone = topClientproduct.numberPhone.toString(); 
      const numeroFormatado = `+1 ${numeroTelefone.slice(1, 4)}-${numeroTelefone.slice(4, 7)}-${numeroTelefone.slice(7)}`;
      const tr = document.createElement('tr');
      const trContent = `
        <td>${topClientproduct.client}</td>
        <td>${numeroFormatado}</td>
        <td>${topClientproduct.email}</td>
        <td>${topClientproduct.amount}</td>
        `;
      tr.innerHTML = trContent;
      tbodydashboardTopClientproducts.appendChild(tr);

    });
  } else {
    console.error('Failed to load products.');
  }
}

dashboardTopClientproducts();



const tbodyAllproducts = document.querySelector('#tbody-products-all');
const productsAllbtn=document.querySelector('#btn-all-products');

const allproductsClients=async()=>{
  const allproducts = await fetchproducts();
  if (allproducts) {
    const allproductsValidate=allproducts.products;
    tbodyAllproducts.innerHTML = ''

  allproductsValidate.forEach(product => {
   const tr=document.createElement('tr');
   const trContent=`
   <td>${product.client}</td>
    <td>${product.numberproduct}</td>
   <td class="${product.status === 'CANCELED' ? 'canceled' : product.status === 'PENDING' ? 'primary' : product.status === 'CONCLUDED' ? 'success' : 'success'}">${product.status}</td>
   <td class="item-button" onclick="toggleItemproduct(${product.id})">Ver Itens</td>`;
    tr.innerHTML=trContent;
    tbodyAllproducts.appendChild(tr);

  });
  
  }
}
productsAllbtn.addEventListener('click',allproductsClients);


const toggleItemproduct = async (idproductClient)=> {
  const idproduct = idproductClient;
  const allproductsItems = await fetchproducts();
  
  if (allproductsItems && idproduct) {
    const allproductsItemsValidate = allproductsItems.products;


    const productItems= allproductsItemsValidate.find(product => product.id === idproduct); 
    const itens=productItems.itens;



    const totalproductValue = sumItemValues(productItems.itens);
    const formattedTotal = formatCurrency(totalproductValue);
    loaditemsproductClient(itens,formattedTotal);
  }

};
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};


const sumItemValues = (items) => {
  return items.reduce((total, item) => {
    return total + (parseFloat(item.value) * item.quantity);
  }, 0);
};


const tbodyItemsproduct = document.querySelector('#tbody-products-items-all');

function loaditemsproductClient(ItemsproductClient, totalValueproduct) {
  console.log(ItemsproductClient);
  console.log(totalValueproduct);
  tbodyItemsproduct.innerHTML = '';

  if (ItemsproductClient.length > 0) {
    for (const itemproduct of ItemsproductClient) {
      console.log(itemproduct);
      const totalproductValeu = document.querySelector('#total-product-value');
      totalproductValeu.innerText=`Total do Pedido ${totalValueproduct}`;

      const tr = document.createElement('tr');
      const trContent = `
        <td>${itemproduct.name}</td>
        <td>${itemproduct.value}</td>
        <td>${itemproduct.quantity}</td>`;
      tr.innerHTML = trContent;
      tbodyItemsproduct.appendChild(tr);
      console.log(tbodyItemsproduct);

    }
  } else {
    const tr = document.createElement('tr');
    const trContent = `
      <td>Vazio</td>
      <td>Vazio</td>
      <td>Vazio</td>
      <td>Total do pedido : vazio</td>`;
    tr.innerHTML = trContent;
    tbodyItemsproduct.appendChild(tr);
  }
};


const searchproductNumber = async () => {
  const inputproduct = document.getElementById('input-product');
  const numberproduct = inputproduct.value;
  const allproductsResponse = await fetchproducts();
  
  if (allproductsResponse && numberproduct) {
    const allproducts = allproductsResponse.products;
    const productsearcher = allproducts.find(product => product.numberproduct == numberproduct);

    productsearcher && productsearcherFunction(productsearcher);
  }
};

function productsearcherFunction(productsearcher) {
  console.log(productsearcher);

  if (productsearcher) {
    const totalproductValeu = document.querySelector('#total-product-value');
    totalproductValeu.innerText='';
    tbodyAllproducts.innerHTML = '';
    tbodyItemsproduct.innerHTML = '';
    const tr = document.createElement('tr');
    const trContent = `
      <td>${productsearcher.client}</td>
      <td>${productsearcher.numberproduct}</td>
      <td class="${productsearcher.status === 'CANCELED' ? 'canceled' : productsearcher.status === 'PENDING' ? 'primary' : productsearcher.status === 'CONCLUDED' ? 'success' : 'success'}">${productsearcher.status}</td>
      <td class="item-button" onclick="toggleItemproduct(${productsearcher.id})">Ver Itens</td>`
      ;
    tr.innerHTML = trContent;
    tbodyAllproducts.appendChild(tr);
    console.log(tbodyAllproducts);
  }
}

