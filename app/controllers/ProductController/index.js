import formidable from 'formidable'
import _ from 'lodash'
import fs from 'fs'

import Product from '../../models/Product'
import { errorHandler } from '../../helpers/dbErrorHandlers'

export const getAllProducts = (req, res) => {
    Product.find({}, (err, result) => {
        if (err || !result) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        return res.json({ result: result })
    })
}

// Create a product via file upload
export const createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        let product = new Product(fields)

        // Check that all fields are filled
        const {name, description, price, category, quantity, shipping} = fields

        if (!name || !description || !price || !category || !quantity || !shipping ) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }

        if (files.photo) {

            // check that image files are less than 1MB
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1MB"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err || ! result) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json(result)
        })
    })

}

export const getProductById = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

export const productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            })
        }

        req.product = product
        next()
    })
}

export const updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        // Check that all fields are filled
        const { name, description, price, category, quantity, shipping } = fields

        if (!name || !description || !price || !category || !quantity || !shipping ) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }


        
        let product = req.product
        product = _.extend(product, fields)

        console.log('updated Product: ', product)

        if (files.photo) {

            // check that image files are less than 1MB
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image size should be less than 1MB"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            console.log('update result: ', result)
            console.error('update error: ', err)
            if (err || ! result) {
                return res.status(400).json({
                    error: err.message,
                    message: 'The product was not saved'
                })
            }

            result.photo = undefined

            res.json(result)
        })
    })

}

export const deleteProduct = (req, res) => {
    req.product.photo = undefined
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            deletedProduct: product,
            message: 'Product has been deleted'
        })
    })
}