const Menu=require('../../models/menu')
// controllers for home page
// function homeController(){
//     return {
//            index(req,res){
//                res.render('home')
//            }
//     }
// }
//home rendering page and fatching data from database and sending it on frontend of home page
//Menu.find() getting data from database after that then() function executed
//A factory function is a function that returns a new object
function homeController() {
    return {
        async index(req, res) {
            const pizzas = await Menu.find()
            // here we are sending pizzas data on frontend of home page
            return res.render('home', { pizzas: pizzas })
        }
    }
}

module.exports=homeController