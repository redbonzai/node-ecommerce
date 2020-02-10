import express from 'express'
const router = express.Router()

import { 
    getAllProducts, 
    listProductsByParam, 
    listRelatedProducts,
    listCategoriesByProduct, 
    createProduct, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    listProductsBySearch, 
     
} from '../controllers/ProductController'

import {productById, showProductPhoto} from '../middleware/ProductMiddleware'
import { requireLogin, isAuth, isAdmin } from '../middleware/AuthMiddleware'
import { userById } from '../middleware/UserMiddleware'

router.get('/products', requireLogin, getAllProducts)
router.get('/products/query', requireLogin, listProductsByParam)
router.get('/products/related/:productId', requireLogin, listRelatedProducts)
router.get('/product/:productId', productById, getProductById)
router.get('/products/categories', listCategoriesByProduct)
router.post('/product/create/:userId', requireLogin, isAdmin, createProduct)
router.post('/products/by/search',  listProductsBySearch)
router.get('/product/photo/:productId', showProductPhoto)
router.put('/product/:productId/:userId', requireLogin, isAuth, isAdmin, updateProduct)
router.delete('/product/:productId/:userId', requireLogin, isAuth, isAdmin, deleteProduct)

router.param('userId', userById)
router.param('productId', productById)


export default router