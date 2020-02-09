import User from '../../models/user'
import jwt from 'jsonwebtoken'; // to generate signed token
import expressJwt from 'express-jwt'; // authorization check
import { errorHandler } from '../../helpers/dbErrorHandler'

export const register = (req, res) => {
    const user = new User(req.body)
    
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        /** 
         * We make the salt & hashed_password undefined because 
         * we don't want them appearing in the API result 
         * */
        user.salt = undefined;
        user.hashed_password = undefined;

        res.json({ user })
    })
}

export const login = (req, res) => {
    const { email, password } = req.body
    User.findOne({email}, (error, user) => {
       
        if (error || !user) {
            return res.status(400).json({
                error: 'User with that email does not exists.  Please register'
            });
        }
        // if User is found, then make sure that email & password match.
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'email and password do not match'
            })
        }

        // generate a signed token with user id and secret
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET)

        //persist the token as 't' in cookie with expiry date
        res.cookie('token', token, {expire: new Date() + 9999 })

        // return response with user and token to frontend client
        const { _id, name, email, role } = user       

        return res.json({ 
            token,
            user: {
                _id, 
                email, 
                name, 
                role 
            } 
        });
    })
}

export const logout = (req, res) => {
    res.clearCookie('token')

    res.json({
        message: 'Logout is successful'
    })
}

export const requireLogin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
})

export const isAuth = (req, res, next) => {
         
    console.log('user profile: ', req.profile, 'req.auth: ', req.auth)
    let user = req.profile && req.auth && (req.profile._id == req.auth._id)
    console.log('user: ', user)

   if (!user) {
       return res.status(403).json({
           error: 'Access denied!'
       })
   }

   next()
}

export const isAdmin = (req, res, next) => {

   // role = 0 is user, role = 1 is admin
   if (req.profile.role === 0) {
       return res.status(403).json({
           error: 'Admin resource! Access denied'
       })
   }

   next()
}