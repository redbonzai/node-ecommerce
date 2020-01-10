import express from 'express'
const router = express.Router()

import { createCategory, getCategories } from '../controllers/CategoryController'
import { requireSignin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/category', requireSignin, getCategories)
router.post('/category/create/:userId', requireSignin, isAdmin, createCategory)

router.param('userId', userById)


export default router