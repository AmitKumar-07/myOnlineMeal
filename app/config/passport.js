//here we write all code for passport configuration (Login page)
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login                                                        (this data is getting if a user sign in )

        // check if email exists
        const user = await User.findOne({ email: email }) //query from database
        if(!user) {
            return done(null, false, { message: 'No user with this email' })
        }
       // all this done() function will at authController page at postLogin
        bcrypt.compare(password, user.password).then(match => {
            if(match) {
                return done(null, user, { message: 'Logged in succesfully' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })
    }))
     // it is for storing user in database
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
     //it is for getting user from database
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init