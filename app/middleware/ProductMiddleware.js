export const productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        if (!product) {
            return res.status(404).json({
                message: 'Product is not found'
            })
        }

        req.product = product
        next()
    })
}

export const showProductPhoto = (req, res, next) => {     
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }

    next();
}