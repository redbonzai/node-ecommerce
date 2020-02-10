
export const categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        if (!category) {
            return res.status(404).json({
                message: 'There is no category by the passed ID'
            })

        }

        req.category = category
        next()
    })
}