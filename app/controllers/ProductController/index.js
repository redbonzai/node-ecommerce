import formidable from 'formidable'
import _ from 'lodash'
import fs from 'fs'

import Product from '../../models/Product'
import { errorHandler } from '../../helpers/dbErrorHandler'
import Category from '../../models/Category'

export const getAllProducts = (req, res) => {
    Product.find({}, (err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        if (!result) {
            return res.status(404).json({
                message: 'There are currently no products to view'
            })
        }

        let products = result.map(product => product.photo = null)
        // console.log('products: ', products)

        return res.json({ result: result })
    })
}

// Create a product via file upload
export const createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log('form.parse error: ', error)
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

            res.json({
                updatedProduct: result,
                message: 'Product has been successfully updated'
            })
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
            deletedProduct,
            message: 'Product has been deleted'
        })
    })
}

/**
 * Sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then app products are returned
 */

 export const listProductsByParam = (req, res) => {
     let order = req.query.order ? req.query.order : 'asc'
     let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
     let limit = req.query.limit ? parseInt(req.query.limit, 10) : 6

     Product.find()
     .select('-photo')
     .populate('gategory')
     .sort([[sortBy, order]])
     .limit(limit)
     .exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }

        if (!data) {
            return res.status(404).json({
                message: 'There are no products available by that search query.'
            })
        }

        return res.json(data)
     })

 }

 /**
  * Finds the products based on the req product category
  * other products that have the same category will be returned
  * @param {*} req 
  * @param {*} res 
  */
 export const listRelatedProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit, 10) : 6

    // $ne; means not included.
    Product.find({
        _id: {
            $ne: req.product
        }, 
        category: req.product.category 
    })
    .limit(limit)
    .populate('category', '_id name')
    .exec((error, data) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            })
        }

        if (!data) {
            return res.status(404).json({
                message: 'There are no products available by that search query.'
            })
        }

        return res.json(data)
     })

 }

 export const listCategoriesByProduct = (req, res) => {
     // console.log('Rquest: ', req)
    
     Product.distinct('category', {}, (error, categories) => {
         if (error) {
            return res.status(400).json({
                error: 'Products or Categories not found',
                message: error
            })
         }

         if (!categories) {
             return res.status(404).json({
                 message: 'No categories found for given Product'
             })
         }

         return res.json({
             categories
         })
     })
 }

 /**
  * List Products by search
  * show categories in checkbox and price range in radio buttons
  * The frontend will make API requests as the user clicks on checkboxes & radio buttons
  * @param Request req 
  * @param json res 
  */
 export const listProductsBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    message: 'Products not found',
                    error: errorHandler(err)
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
 }