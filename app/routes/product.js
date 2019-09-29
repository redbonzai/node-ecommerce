import express from 'express'
const router = express.Router()

import { getAllProducts, createProduct } from '../controllers/ProductController'
import { requireSignin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/product', requireSignin, getAllProducts)
router.post('/product/create/:userId', requireSignin, isAdmin, createProduct)

router.param('userId', userById)


export default router