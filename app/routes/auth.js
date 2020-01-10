import express from 'express'
const router = express.Router()

import { signup, signin, signout, requireSignin } from '../controllers/AuthController'
import {userSignupValidator} from "../validator";

router.get('/', (req, res) => {
	res.send('index is loaded')
})

router.post('/signup', userSignupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)

router.get('/hello', requireSignin, (req, res) => {
	res.send('Hello there')
})

export default router