//here listen event on buttons and etc
import axios from 'axios'
import  initAdmin  from './admin'
import Noty from 'noty'
import moment from 'moment'
import { initStripe } from './stripe'
let addToCart= document.querySelectorAll('.add-to-cart')
let cartCount=document.querySelectorAll('#cartCounter')

// this function is for removing cart items
function remove(){
    const removeCart=document.querySelector('#removeCart')
  
      if(!removeCart){
       return;
        }
    function removeUpdate(){
            //here we are ajax calling
            axios.post('/remove-cart').then(res=>{
                //here we show number of items in cart
                console.log(res)
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text:res.data.message,
                    progressBar: false,
                 }).show();

                setTimeout(()=>{
                    window.location.href='/cart'
                  },1000)
            }).catch(err=>{
        
                new Noty({
                    type: 'success',
                    timeout: 1000,
                    text: 'Something went wrong',
                    progressBar: false,
                }).show();
            })
        
     }
    removeCart.addEventListener('click',(e)=>{
            console.log(e)
            removeUpdate()
     })
}
//calling remove function
remove()


//updating cart items
function updateCart(pizza){
    //here we are ajax calling
    axios.post('/update-cart',pizza).then(res=>{
        //here we show number of items in cart
        cartCounter.innerText=res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false,
         }).show();
    }).catch(err=>{

        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar: false,
        }).show();
    })

}
//here we are getting btn=pizza(home.ejs) object for every iteration in home.ejs file
addToCart.forEach((btn)=>{
     btn.addEventListener('click',(e)=> {
         //here we are getting pizza's details which is sent from home.ejs file in span tag
        let pizza =JSON.parse(btn.dataset.pizza)
         //here we are updating cart (how many items a user selected show in cart)
          updateCart(pizza)
        
     })

})

//Remove alert message after 2 second
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}


//change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

//payement ajax call
initStripe()

// initAdmin()
let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
//this is customer to admin update
//windoe.location.pathname this tell url form of admin pade('/admin/orders')
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}

//this is admin to customer update
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})