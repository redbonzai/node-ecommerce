import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import expressValidator from 'express-validator'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'

const app = express()

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true

}).then(() => {
	console.log('Database is connected')
})

/** Middleware **/
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())


// Routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)

app.listen(process.env.PORT || 3200, () => console.log(`The app is listening on port ${process.env.PORT}`))