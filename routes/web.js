//web routing configration
const homeController=require('../app/http/controllers/homeController')
const adminOrderController=require('../app/http/controllers/admin/orderController')
const statusController=require('../app/http/controllers/admin/statusController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')


//middleware
const auth=require('../app/http/middlewares/auth')
const guest=require('../app/http/middlewares/guest')
const admin=require('../app/http/middlewares/admin')

function initRoutes(app){
    // app.get('/',(req,res)=>{
    //     res.render('home') 
    // })
    // above app.get() and below app.get are same fuction 
    app.get('/',homeController().index)
    //by giving guest only not login user can reach login and register page
    app.get('/login', guest ,authController().login)
    app.post('/login',authController().postLogin)
    app.post('/logout',authController().logout)
    app.get('/register', guest ,authController().register)
    app.post('/register',authController().postRegister)

    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)
    app.post('/remove-cart',cartController().updateremove)
    
    
    //customer routes
    app.post('/orders',auth,orderController().store)
    app.get('/customer/orders',auth, orderController().index)
    app.get('/customer/orders/:id',auth,orderController().show)
    
    //admin routes
    app.get('/admin/orders',admin, adminOrderController().index)
    app.post('/admin/order/status',admin,statusController().update)
   
    
}

module.exports=initRoutes
