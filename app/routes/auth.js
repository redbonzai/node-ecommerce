import express from 'express';

import { register, login, logout } from '../controllers/AuthController'

import { requireLogin, isAuth, isAdmin } from '../middleware/AuthMiddleware'
import { userSignupValidator } from '../validator'

const router = express.Router();

router.post('/register', userSignupValidator, register)
router.post('/login', login)
router.get('/logout', logout)

router.get('/hello', requireLogin, (req, res) => {
    res.send('hello ... ')
})

export default router;