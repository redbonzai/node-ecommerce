import express from 'express'
const router = express.Router()

import { 
    createCategory, 
    getCategories, 
    categoryById, 
    getCategory, 
    updateCategory, 
    deleteCategory 
} from '../controllers/CategoryController'
import { requireLogin, isAuth, isAdmin } from '../controllers/AuthController'
import { userById } from '../controllers/UserController'

router.get('/category', requireLogin, getCategories)
router.get('/category/:categoryId', requireLogin, categoryById, getCategory)
router.post('/category/create/:userId', requireLogin, isAuth, isAdmin, createCategory)
router.put('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, updateCategory)
router.delete('/category/:categoryId/:userId', requireLogin, isAuth, isAdmin, deleteCategory)

router.param('categoryId', categoryById)
router.param('userId', userById)


export default router