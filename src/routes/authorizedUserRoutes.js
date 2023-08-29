const router = require('express').Router();
const authorizedUserController = require('../controllers/authorizedUserController')
const { authorize } = require('../utils/auth')

router.get('/', authorize(['Admin', 'Analyst', 'Customer']), authorizedUserController.getAuthorizedUserInfo)

module.exports = router