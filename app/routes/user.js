import express from 'express'
const router = express.Router()

import { signup, signin, signout } from '../controllers/UserController'
import {userSignupValidator} from "../validator";

router.get('/', (req, res) => {
	res.send('index is loaded')
})

router.post('/signup', userSignupValidator, signup)
router.post('/signin', signin)
router.get('/signout', signout)

export default router