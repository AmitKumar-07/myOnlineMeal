// server page of our 
//web routing configration
const authController = require('./app/http/controllers/authController')
const cartController = require('./app/http/controllers/customers/cartController')
const orderController = require('./app/http/controllers/customers/orderController')
const homeController=require('./app/http/controllers/homeController')
const adminOrderController=require('./app/http/controllers/admin/orderController')
const statusController=require('./app/http/controllers/admin/statusController')

//middleware
const auth=require('./app/http/middlewares/auth')
const guest=require('./app/http/middlewares/guest')
const admin=require('./app/http/middlewares/admin')
require('dotenv').config()
const express=require('express') //express is function so we have to call it so that it give me all methods
const app=express() //app will get all methods of express
const ejs=require('ejs')
const expressLayout=require('express-ejs-layouts')
const path=require('path')
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const MongoDbStore=require('connect-mongo')(session)
const passport=require('passport')
const Emitter=require('events')

//port variables
const PORT=process.env.PORT || 3000


//database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true,
     useFindAndModify : true 
    });
const connection =mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch( err => {
    console.log('Connection failed...')
});

//session store
let mongoStore =new MongoDbStore({
    mongooseConnection: connection,
    collection:'sessions'
})

//eventemitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)
//setup for session
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

//Passport config
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())//passport initialized
app.use(passport.session()) //coz it works with the help of session

app.use(flash())

//asset from where static files can get
app.use(express.static('public'))
// for usinf json file
app.use(express.json())
app.use(express.urlencoded({ extended:false}))

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set templates engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

//(routing configration)it is a instance actually we are calling initRoutes Function from here
// require('./routes/web')(app)
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

//listening port
const server=app.listen(PORT,()=>{
          console.log(`listen at port ${PORT}`)
          })

//socket io configuaration
const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})