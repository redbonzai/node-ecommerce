import express from 'express'
const router = express.Router()

import { signup } from '../controllers/UserController'
import {userSignupValidator} from "../validator";

router.get('/', (req, res) => {
	res.send('index is loaded')
})

router.post('/signup', userSignupValidator, signup)

export default router