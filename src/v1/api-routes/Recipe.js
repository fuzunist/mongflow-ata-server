const authenticate = require('../middlewares/authenticate')
const validate = require('../middlewares/validate')
const paramValidate = require('../middlewares/paramValidate')
const schemas = require('../validations/Recipes')

const { get, create, put, remove } = require('../controllers/Recipes')

const express = require('express')
const router = express.Router()

router.route('/').get(authenticate, get)
router.route('/').post(authenticate, validate(schemas.createValidation), create)
router.route('/:id').put(authenticate, paramValidate('id'), validate(schemas.updateValidation), put)
router.route('/:id').delete(authenticate, paramValidate('id'), remove)

module.exports = router
