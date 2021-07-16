import axios from 'axios'
import Noty from 'noty'
export function placedOrder(formObject){
    axios.post('/orders',formObject).then(( res )=>{
        new Noty({
            type: 'success',
            timeout: 1000,
            text:res.data.message,
            progressBar: false,
        }).show();
        let myVar;
        if(res.data.message==='All fields are required')
               clearTimeout(myVar)
      myVar=setTimeout(()=>{
         window.location.href='/customer/orders'
       },1000)
       
       if(res.data.message==='All fields are required')
               clearTimeout(myVar)

    }).catch((error)=>{
        new Noty({
            type: 'success',
            timeout: 1000,
            text:error.res.data.message,
            progressBar: false,
        }).show();
    })
}