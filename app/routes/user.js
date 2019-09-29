import express from 'express'
const router = express.Router()

import { requireSignin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/secret/:userId', isAuth, (req, res) => {
	res.json({
		user: req.profile
	})
})

router.param('userId', userById)

export default router