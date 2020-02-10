import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import expressValidator from 'express-validator'

import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import categoryRoutes from './routes/category'
import productRoutes from './routes/product'

const app = express();

mongoose.connect(process.env.APP_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log(chalk.blue.bold('MongoDB database connected'))
})

mongoose.set('useFindAndModify', false)

// middleware
app.use(morgan('dev')) //loging

app.use(bodyParser.json()) //parsing request objects
app.use(cookieParser()) //parse sessions
app.use(expressValidator()) // request validation
app.use(cors()) // handle requests from different domains

 // Routes middleware
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)


const port = process.env.PORT || 3200;

app.listen(port, () => {
    console.log(chalk.green.bold(`Server is running on port ${port}`))
})