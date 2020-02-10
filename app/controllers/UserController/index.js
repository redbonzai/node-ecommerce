import User from '../../models/User'

export const showUser = (req, res) => {
	req.profile.hashed_password = undefined
	req.profile.salt = undefined

	return res.json({ profile: req.profile })
}

export const updateUser = (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.profile._id }, 
		{ $set: req.body},
		{ new: true }, 
		(error, user) => {
			if (error) {
				return res.status(400).json({
					error: 'You are not authorized to perform this action',
					message: error
				})
			}

			user.hashed_password = undefined
			user.salt = undefined
			res.json({ user })

		}
	)
}