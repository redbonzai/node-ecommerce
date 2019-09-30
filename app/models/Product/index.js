import mongoose from 'mongoose'
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		maxlength: 32
    },
    description: {
		type: String,
		required: true,
		maxlength: 2000
    },    
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true,
        maxlength: 32
    },
    quantity: {
        type: Number
    },
    photo: {
        data: Buffer,
        contentTYpe: String
    },
    shipping: {
        required: false,
        type: Boolean
    }

}, {
	timestamps: true
})

export default mongoose.model('Product', productSchema)

