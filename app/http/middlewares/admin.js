//middleware for admin can only visit admin/orders and admin/orders/status page
function admin (req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'admin') {
        return next()
    }
    return res.redirect('/')
}

module.exports = admin