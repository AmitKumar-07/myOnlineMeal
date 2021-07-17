// server page of our 
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
const PORT=process.env.PORT || 4000


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
require('./routes/web')(app)

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