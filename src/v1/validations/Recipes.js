const Joi = require("joi/lib");

const createValidation = Joi.object({
  order_id: Joi.number().required(),
  details: Joi.object().required(),
  cost: Joi.number().required(),
  recipe_id: Joi.string().required(),
});

const updateValidation = Joi.object({
  details: Joi.object().required(),
  cost: Joi.number().required(),
});

module.exports = {
  createValidation,
  updateValidation,
};
