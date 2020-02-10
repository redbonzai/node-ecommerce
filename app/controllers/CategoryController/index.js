import Category from '../../models/Category'
import { errorHandler } from '../../helpers/dbErrorHandler'

export const createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((err, data) => {
        if (err || !data) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({ data })
    });
}

export const updateCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            message: 'Category has been updated',
            result: data
        })
    })
}

export const getCategories = (req, res) => {
    
    Category.find({}, (err, result) => {
        if (err ) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        if (!result) {
            return res.status(404).json({
                message: 'There are no categories available to view'
            })
        }

        res.json({ result })
    })
}

export const getCategory = (req, res) => {
    return res.json(req.category)
}

export const deleteCategory = (req, res) => {   
    let category = req.category
    category.remove((err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            deletedCategory,
            message: 'Category has been deleted'
        })
    })

}