import axios from 'axios'
import Noty from 'noty'
import { loadStripe } from '@stripe/stripe-js'
import { placedOrder} from './apiService'

export async function initStripe(){

    const stripe = await loadStripe('pk_test_51IXN2qSDNtfQ52hkYYQIb66EtQxEA7FpcAgnkeh1pji3k4NSAvjZFqsjzLAWRbgy7MGnQd8zfzg6k16s6d0rfNv600cZTqcP3r');

     let card=null;
   function mountWidget() {
    const elements = stripe.elements()
    let style = {
           base: {
           color: '#32325d',
           fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
           fontSmoothing: 'antialiased',
           fontSize: '16px',
           '::placeholder': {
               color: '#aab7c4'
           }
           },
           invalid: {
           color: '#fa755a',
           iconColor: '#fa755a'
           }
       };
        card=elements.create('card', { style ,hidePostalCode : true})
   
            card.mount('#card-element')
  }
    

    const paymentType= document.querySelector('#paymentType')

       if(!paymentType){
           return;
       }
     paymentType.addEventListener('change',(e)=>{
         console.log(e)
         if(e.target.value==='card'){
             //display widget
             mountWidget();
         }
         else{
             //
             card.destroy()
         }
     })

    //ajax call
    const paymentForm=document.querySelector('#payment-form')
   if(paymentForm){
    paymentForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        let formData= new FormData(paymentForm)
    
        let formObject= {}
        for(let [key,value] of formData.entries()){
            formObject[key]=value
        }

       if(!card){
           //ajax
           placedOrder(formObject);
           return;
       }
        
      //verify card
        stripe.createToken(card).then((result)=>{
              formObject.stripeToken=result.token.id;
              placedOrder(formObject);
              console.log(result)
        }).catch((err)=>{
          console.log(err)
        })
     })
  }
}