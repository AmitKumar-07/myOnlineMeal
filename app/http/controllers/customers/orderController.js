//it conrols order page(when we order something and submit)
const Order=require('../../../models/order')
const bcrypt=require('bcrypt')
const moment=require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function orderController() {
    return {
        store(req, res) {
            // Validate request
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {

                //about flash
                // req.flash('error','All fields are required')
                // req.flash('phone',phone)
                // req.flash('address',address)
                // return res.redirect('/cart')
                 return res.json({ message : 'All fields are required' });
            }
        
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    // Stripe payment
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Pizza order: ${placedOrder._id}`
                        }).then(()=>{
                               placedOrder.paymentStatus = true;
                               placedOrder.paymentType= paymentType
                               placedOrder.save().then((ord)=>{
                                   //Emit
                                  const eventEmitter = req.app.get('eventEmitter')
                                  eventEmitter.emit('orderPlaced',ord)
                                  delete req.session.cart
                                  return res.json({ message:' Payment successful, Order placed successfully' });
                               }).catch((err)=>{
                                   console.log(err)
                               })
                            }).catch((err)=>{
                                   //err
                                   delete req.session.cart
                                   return res.json({ message:'OrderPlaced but Payment failed, You can pay at delivery time' });
                            })
                        }
                        else
                        {
                                    const eventEmitter = req.app.get('eventEmitter')
                                    eventEmitter.emit('orderPlaced',result)
                                    delete req.session.cart
                                    return res.json({ message : 'Order placed succesfully' });
                        }
                })
                 
            }).catch(err=>{
                return res.status(500).json({ message:'Something went wrong' });
        
            })
         },
       async index(req,res){
           const orders=await Order.find({customerId:req.user._id },
            null,
            {sort:{'createdAt':-1}})
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders',{orders : orders,moment:moment})
        },
      async show(req,res){
           const order= await Order.findById(req.params.id)
           // authorize user who can track their order //
           if(req.user._id.toString()==order.customerId.toString()){
              return res.render('customers/singleOrder',{order})
           }
           return res.redirect('/')
        }
    }
}

module.exports=orderController