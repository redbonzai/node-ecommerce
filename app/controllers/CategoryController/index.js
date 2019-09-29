import Category from '../../models/Category'
import { errorHandler } from '../../helpers/dbErrorHandlers'

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

export const getCategories = (req, res) => {
    
    Category.find({}, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({ result })
    })
}