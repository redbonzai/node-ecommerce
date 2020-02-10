import expressJwt from 'express-jwt'; // authorization check

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