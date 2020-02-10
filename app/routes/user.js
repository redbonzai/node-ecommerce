import express from 'express'
const router = express.Router()

import { requireLogin, isAuth, isAdmin } from '../middleware/AuthMiddleware'
import { showUser, updateUser } from '../controllers/UserController'
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

router.get('/user/:userId', requireLogin, isAuth, showUser)
router.put('/user/:userId', requireLogin, isAuth, updateUser)

router.param('userId', userById)

export default router 