import express from 'express'
const router = express.Router()

import { requireLogin, isAuth, isAdmin } from '../middleware/AuthMiddleware'
//import { userById } from '../controllers/UserController'
import { userById } from '../middleware/UserMiddleware'

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