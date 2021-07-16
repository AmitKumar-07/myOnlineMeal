// here its name is user but in database users name will be there
//we are creating a model to store name,gamil,password in database
//it represent database tables(collections)

const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const userSchema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    role:{type:String, default:'customer'}
},{ timestamps:true})

//model('database me collection ka name dete h singular form me',yha schema dete h )
module.exports= mongoose.model('User',userSchema)
