// here its name is menu but in database menus name will be there
//it represent database tables(collections)

const mongoose = require('mongoose')
const Schema = mongoose.Schema
 
const menuSchema = new Schema({
    name:{type:String, required:true},
    image:{type:String, required:true},
    price:{type:Number, required:true},
    size:{type:String, required:true}
})

//model('database me collection ka name dete h singular form me',yha shema dete h )
module.exports= mongoose.model('Menu',menuSchema)
