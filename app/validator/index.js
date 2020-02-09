export const userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
	req.check('email', 'Name must be between 4 and 32 characters')
		//.matches(/.+\@.+\..+/)
		.matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
		.withMessage('Email must be a proper email address')
		.isLength({
			min: 4,
			max: 32
		})

	req.check('password', 'Password is required').notEmpty()
		.isLength({ min: 6 })
		.withMessage('Password must contain at least 6 characters')
		.matches(/\d/)
		.withMessage('Password must contain a number')

	const errors = req.validationErrors()

	if (errors) {
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({ error: firstError })
	}

	next()


}