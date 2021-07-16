// this page is for middleware handle
//cheching if a user is login then he don't go to login or register page

function guest(req,res,next){
     if(!req.isAuthenticated()){
         return next()
     }
     return res.redirect('/')
}

module.exports=guest 