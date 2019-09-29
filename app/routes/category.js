import express from 'express'
const router = express.Router()

import { createCategory } from '../controllers/CategoryController'
import { requireSignin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.post('/category/create/:userId', requireSignin, isAdmin, createCategory)

router.param('userId', userById)


export default router