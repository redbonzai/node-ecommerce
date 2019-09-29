import User from '../../models/User'

export const userById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err) {
			return res.status(400).json({
				error: 'User was not found'
			})
		}

		req.profile = user
		next()

	})
}