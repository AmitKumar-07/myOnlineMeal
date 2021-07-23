//controller for login and register page 
const User=require('../../models/user')
const bcrypt=require('bcrypt')
const passport = require('passport')
function authController(){
    return {
           // get login
           login(req,res){
//                res.render('auth/login')
           },
          //post login
           postLogin(req, res,) {
            const { email,password }= req.body 
            //validate request
            if(!email||!password)
            {
                req.flash('error','All fields are required')
                req.flash('email',email)
                return res.redirect('/login')
            }
            //through this we can check if user enter right password and email or not
            passport.authenticate('local', (err, user, info) => {
                if(err) {       //(err,user,info) it is actually done() function which we called from passport page
                    req.flash('error', info.message )
//                     return next(err)
                }
//                 if(!user) {
//                     req.flash('error', info.message )
//                     return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect('/')
                })
               })(req, res, next)
           },
             //get register
           register(req,res){
               res.render('auth/register')
           },
            //post register
          async postRegister(req,res){
               //here we are getting name,gmail and password of user in req.body
               //now we have to store it in database
               const { name,email,password }= req.body 
               //validate request
               if(!name||!email||!password)
               {   //here we are sending flash messages to frontend(at register-page)
                   req.flash('error','All fields are required')
                   req.flash('name',name)
                   req.flash('email',email)
                   return res.redirect('/register')
               }
   
           
               //hash password
               const hashedpassword=await bcrypt.hash(password,10)
               //create a new user
               const user=new User({
                   name,
                   email,
                   password:hashedpassword
               })
        
               user.save().then((user)=>{
                   //after saving data in database this block will executed
                   //login concept
                   return res.redirect('/')
               }).catch(err=>{
                  
                //if we get error go to register page(if email already present in database then it will give error)
                req.flash('error','Email already taken')
                req.flash('name',name)
                req.flash('email',email)
                return res.redirect('/register')
               })
            
          },

          //post logout
          logout(req,res){
              req.logout()
              return res.redirect('/')
          }
    }
}

module.exports=authController
