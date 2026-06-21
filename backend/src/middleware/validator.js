const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user', 'admin').default('user') // Evita Mass Assignment
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { stripUnknown: true }); // stripUnknown remove campos não permitidos
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validateUser };