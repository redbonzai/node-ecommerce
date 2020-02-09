import express from 'express'
const router = express.Router()

import { 
    getAllProducts, 
    listProductsByParam, 
    listRelatedProducts,
    listCategoriesByProduct, 
    createProduct, 
    productById, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    listProductsBySearch 
} from '../controllers/ProductController'
import { requireLogin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/products', requireLogin, getAllProducts)
router.get('/products/query', requireLogin, listProductsByParam)
router.get('/products/related/:productId', requireLogin, listRelatedProducts)
router.get('/product/:productId', productById, getProductById)
router.get('/products/categories', listCategoriesByProduct)
router.post('/product/create/:userId', requireLogin, isAdmin, createProduct)
router.post('/products/by/search',  listProductsBySearch)
router.put('/product/:productId/:userId', requireLogin, isAuth, isAdmin, updateProduct)
router.delete('/product/:productId/:userId', requireLogin, isAuth, isAdmin, deleteProduct)

router.param('userId', userById)
router.param('productId', productById)


export default router