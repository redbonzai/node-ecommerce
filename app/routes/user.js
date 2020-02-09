import express from 'express'
const router = express.Router()

import { requireLogin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/secret/:userId', requireLogin, isAuth, /*isAdmin,*/ (req, res) => {
    
	res.json({
        user: req.profile,
        auth: {
            id: req.auth._id,
            iat: req.auth.iat
        }
	})
})

router.param('userId', userById)

export default router 