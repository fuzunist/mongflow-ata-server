const Joi = require('joi/lib')

const createValidation = Joi.object({
    customername: Joi.string().required().min(3),
    companyname: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required()
})

module.exports = {
    createValidation
}
