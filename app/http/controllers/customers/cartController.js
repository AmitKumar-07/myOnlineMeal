//controllers for home page
const { json } = require("express")

function cartController() {
    return {
             index(req, res) {
            res.render('customers/cart')
            },
            updateremove(req,res){
                 //delete cart items if i don't want
                  delete req.session.cart
                  return res.json({ message : 'Cart items are removed, successfullly' });
            },
              
            update(req, res) {
                //define structure of storing variabls
                // let cart = {
                //     items: {
                //         pizzaId: { item: pizzaObject, qty:0 },
                //         pizzaId: { item: pizzaObject, qty:0 },
                //         pizzaId: { item: pizzaObject, qty:0 },
                //     },
                //     totalQty: 0,
                //     totalPrice: 0
                // }
                // for the first time creating cart and adding basic object structure
               if (!req.session.cart) {
                    req.session.cart = {
                        items: {},
                        totalQty: 0,
                        totalPrice: 0
                    }
                }
            let cart = req.session.cart
            // Check if item does not exist in cart 
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
             else 
             {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice =  cart.totalPrice + req.body.price
             }
            return res.json({ totalQty: req.session.cart.totalQty })
        }
    }
}

module.exports = cartController