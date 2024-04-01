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

 
const orderToday = 'ordersToday.json';
const tbodyOrdersRecentToday = document.querySelector('#tbody-orders-today');

const fetchOrders = async () => {
  try {
    const response = await fetch(orderToday);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return null;
  }
}

const dashboardOrdersToday = async () => {
  const orders = await fetchOrders();

  if (orders) {
    const orderValidate=orders.orders;
    tbodyOrdersRecentToday.innerHTML = '';

    orderValidate.forEach(order => {
      const tr = document.createElement('tr');
      const trContent = `
        <td>${order.client}</td>
        <td>${order.numberOrder}</td>
        <td class="${order.status === 'Cancelado' ? 'canceled' : order.status === 'Pendente' ? 'primary' : 'success'}">${order.status}</td>
      `;
      tr.innerHTML = trContent;
      tbodyOrdersRecentToday.appendChild(tr);

    });
  } else {
    console.error('Failed to load orders.');
  }
}

dashboardOrdersToday();


const tbodydashboardTopClientOrders = document.querySelector('#tbody-client-orders');

const dashboardTopClientOrders = async () => {
  const topClientorders = await fetchOrders();

  if (topClientorders) {
    const topClientorderValidate=topClientorders.topClientOrdes;
    tbodydashboardTopClientOrders.innerHTML = '';

    topClientorderValidate.forEach(topClientorder => {
      const numeroTelefone = topClientorder.numberPhone.toString(); 
      const numeroFormatado = `+1 ${numeroTelefone.slice(1, 4)}-${numeroTelefone.slice(4, 7)}-${numeroTelefone.slice(7)}`;
      const tr = document.createElement('tr');
      const trContent = `
        <td>${topClientorder.client}</td>
        <td>${numeroFormatado}</td>
        <td>${topClientorder.email}</td>
        <td>${topClientorder.amount}</td>
        `;
      tr.innerHTML = trContent;
      tbodydashboardTopClientOrders.appendChild(tr);

    });
  } else {
    console.error('Failed to load orders.');
  }
}

dashboardTopClientOrders();



const tbodyAllOrders = document.querySelector('#tbody-orders-all');
const ordersAllbtn=document.querySelector('#btn-all-orders');

const allOrdersClients=async()=>{
  const allOrders = await fetchOrders();
  if (allOrders) {
    const allOrdersValidate=allOrders.orders;
    tbodyAllOrders.innerHTML = ''

  allOrdersValidate.forEach(order => {
   const tr=document.createElement('tr');
   const trContent=`
   <td>${order.client}</td>
    <td>${order.numberOrder}</td>
   <td class="${order.status === 'CANCELED' ? 'canceled' : order.status === 'PENDING' ? 'primary' : order.status === 'CONCLUDED' ? 'success' : 'success'}">${order.status}</td>
   <td class="item-button" onclick="toggleItemOrder(${order.id})">Ver Itens</td>`;
    tr.innerHTML=trContent;
    tbodyAllOrders.appendChild(tr);

  });
  
  }
}
ordersAllbtn.addEventListener('click',allOrdersClients);


const toggleItemOrder = async (idOrderClient)=> {
  const idOrder = idOrderClient;
  const allOrdersItems = await fetchOrders();
  
  if (allOrdersItems && idOrder) {
    const allOrdersItemsValidate = allOrdersItems.orders;


    const orderItems= allOrdersItemsValidate.find(order => order.id === idOrder); 
    const itens=orderItems.itens;



    const totalOrderValue = sumItemValues(orderItems.itens);
    const formattedTotal = formatCurrency(totalOrderValue);
    loaditemsOrderClient(itens,formattedTotal);
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


const tbodyItemsOrder = document.querySelector('#tbody-orders-items-all');

function loaditemsOrderClient(ItemsOrderClient, totalValueOrder) {
  console.log(ItemsOrderClient);
  console.log(totalValueOrder);
  tbodyItemsOrder.innerHTML = '';

  if (ItemsOrderClient.length > 0) {
    for (const itemOrder of ItemsOrderClient) {
      console.log(itemOrder);
      const totalOrderValeu = document.querySelector('#total-order-value');
      totalOrderValeu.innerText=`Total do Pedido ${totalValueOrder}`;

      const tr = document.createElement('tr');
      const trContent = `
        <td>${itemOrder.name}</td>
        <td>${itemOrder.value}</td>
        <td>${itemOrder.quantity}</td>`;
      tr.innerHTML = trContent;
      tbodyItemsOrder.appendChild(tr);
      console.log(tbodyItemsOrder);

    }
  } else {
    const tr = document.createElement('tr');
    const trContent = `
      <td>Vazio</td>
      <td>Vazio</td>
      <td>Vazio</td>
      <td>Total do pedido : vazio</td>`;
    tr.innerHTML = trContent;
    tbodyItemsOrder.appendChild(tr);
  }
};


const searchOrderNumber = async () => {
  const inputOrder = document.getElementById('input-pedido');
  const numberOrder = inputOrder.value;
  const allOrdersResponse = await fetchOrders();
  
  if (allOrdersResponse && numberOrder) {
    const allOrders = allOrdersResponse.orders;
    const orderSearcher = allOrders.find(order => order.numberOrder == numberOrder);

    orderSearcher && orderSearcherFunction(orderSearcher);
  }
};

function orderSearcherFunction(orderSearcher) {
  console.log(orderSearcher);

  if (orderSearcher) {
    const totalOrderValeu = document.querySelector('#total-order-value');
    totalOrderValeu.innerText='';
    tbodyAllOrders.innerHTML = '';
    tbodyItemsOrder.innerHTML = '';
    const tr = document.createElement('tr');
    const trContent = `
      <td>${orderSearcher.client}</td>
      <td>${orderSearcher.numberOrder}</td>
      <td class="${orderSearcher.status === 'CANCELED' ? 'canceled' : orderSearcher.status === 'PENDING' ? 'primary' : orderSearcher.status === 'CONCLUDED' ? 'success' : 'success'}">${orderSearcher.status}</td>
      <td class="item-button" onclick="toggleItemOrder(${orderSearcher.id})">Ver Itens</td>`;
    
    tr.innerHTML = trContent;
    tbodyAllOrders.appendChild(tr);
    console.log(tbodyAllOrders);
  }
}

