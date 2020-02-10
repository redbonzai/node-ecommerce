import express from 'express'
const router = express.Router()

import { 
    createCategory, 
    getCategories,
    getCategory, 
    updateCategory, 
    deleteCategory 
} from '../controllers/CategoryController'
import { requireLogin, isAuth, isAdmin } from '../middleware/AuthMiddleware'

// Middleware
import {categoryById} from '../middleware/CategoryMiddleware'
import { userById } from '../middleware/UserMiddleware'

router.get('/category', requireLogin, getCategories)
router.get('/category/:categoryId', requireLogin, categoryById, getCategory)
router.post('/category/create/:userId', requireLogin, isAuth, isAdmin, createCategory)
router.put('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, updateCategory)
router.delete('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, deleteCategory)

router.param('categoryId', categoryById)
router.param('userId', userById)


export default router