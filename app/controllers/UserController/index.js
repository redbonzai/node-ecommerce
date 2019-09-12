import User from '../../models/User'
import jwt from 'jsonwebtoken' //user to generate signed token
import expressJwt from 'express-jwt' // used for authorization check
import { errorHandler } from '../../helpers/dbErrorHandlers'

export const signup = (req, res) => {
	console.log('req.body: ', req.body)
	const user = new User(req.body)

	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				err: errorHandler(err)
			})
		}

		user.salt = undefined
		user.hashed_password = undefined

		res.json({ user })
	})
}

export const signin = (req, res) => {

	// find user based on email
	const {email, password} = req.body

	User.findOne({email}, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				err: 'User with that email does not exist.  Please sign up'
			})
		}

		// if user is found make sure email and password match
		// create authenticate method in user model
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: 'Email and password do not match'
			})
		}

		// generate a signed token with userId and secret
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

		// persist the token as 'token' in cookie with expiry date
		res.cookie('token', token, {expire: new Date() + 9999 })

		// return response with user and token to frontend client
		const { _id, name, email, role } = user
		return res.json({
			token,
			user: { _id, email, name, role }
		})
	})
}

export const signout = (req, res) => {
	res.clearCookie('token')

	res.json({
		message: 'You have successfully logged out'
	})
}