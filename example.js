// store(req, res) {
//     //validate request
//     const {phone,address, stripeToken, paymentType} = req.body
//     if(!phone||!address)
//     {
//         return res.status(422).json({message : 'All fields are required'})
//         // req.flash('error','All fields are required')
//         // return res.redirect('/cart')
//     }
//     const order=new Order({
//         customerId:req.user._id,
//         items:req.session.cart.items,
//         phone,
//         address
//     })

//     order.save().then(result=>{
//         Order.populate(result,{path:'customerId'},(err,placedOrder) =>{
//                 // req.flash('success','Order placed successfully')

//                 //Stripe payment
//                 if(paymentType==='card'){
//                     stripe.charges.create({
//                         amount:req.session.cart.totalPrice *100,
//                         source:stripeToken,
//                         currency:'inr',
//                         discription:`Pizza order: ${placedOrder._id}`
//                     }).then(()=>{
//                        placedOrder.paymentStatus = true;
//                        placedOrder.save().then((ord)=>{
                           
//                            //Emit
//                           const eventEmitter = req.app.get('eventEmitter')
//                           eventEmitter.emit('orderPlaced', ord)
//                           delete req.session.cart
//                           return res.json({ message:' Payment successful, Order placed successfully' });
//                        }).catch((err)=>{
//                            console.log(err)
//                        })
//                     }).catch((err)=>{
//                         //err
//                         delete req.session.cart
//                         return res.json({ message:'OrderPlaced but Payment failed, You can pay at delivery time' });
//                     })
//                 }
                
//                 //Emit
//                 // const eventEmitter = req.app.get('eventEmitter')
//                 // eventEmitter.emit('orderPlaced', result)
                
               
//                 //  return res.redirect('/customer/orders')
//         })
         
//     }).catch(err=>{
//         return res.status(500).json({ message:'Something went wrong' });

//     })
//  },

//2
// store(req, res) {
//     // Validate request
//     const { phone, address, stripeToken, paymentType } = req.body
//     if(!phone || !address) {
//         return res.status(422).json({ message : 'All fields are required' });
//     }

//     const order = new Order({
//         customerId: req.user._id,
//         items: req.session.cart.items,
//         phone,
//         address
//     })
//     order.save().then(result => {
//         Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
//             // Stripe payment
//             if(paymentType === 'card') {
//                 stripe.charges.create({
//                     amount: req.session.cart.totalPrice * 100,
//                     source: stripeToken,
//                     currency: 'inr',
//                     description: `Pizza order: ${placedOrder._id}`
//                 }).then(()=>{
//                        placedOrder.paymentStatus = true;
//                        placedOrder.paymentType= paymentType
//                        placedOrder.save().then((ord)=>{
//                            //Emit
//                           const eventEmitter = req.app.get('eventEmitter')
//                           eventEmitter.emit('orderPlaced',ord)
//                           delete req.session.cart
//                           return res.json({ message:' Payment successful, Order placed successfully' });
//                        }).catch((err)=>{
//                            console.log(err)
//                        })
//                     }).catch((err)=>{
//                         //err
//                         delete req.session.cart
//                         return res.json({ message:'OrderPlaced but Payment failed, You can pay at delivery time' });
//                     })
//                 }
//                 else
//                 {
//                        const eventEmitter = req.app.get('eventEmitter')
//                        eventEmitter.emit('orderPlaced',result)
//                        delete req.session.cart
//                         return res.json({ message : 'Order placed succesfully' });
//                 }
//         })
         
//     }).catch(err=>{
//         return res.status(500).json({ message:'Something went wrong' });

//     })
//  },

