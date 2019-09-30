import express from 'express'
const router = express.Router()

import { getAllProducts, createProduct, productById, getProductById, updateProduct, deleteProduct } from '../controllers/ProductController'
import { requireSignin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/product', requireSignin, getAllProducts)
router.get('/product/:productId', productById, getProductById)
router.post('/product/create/:userId', requireSignin, isAdmin, createProduct)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct)

router.param('userId', userById)
router.param('productId', productById)


export default router