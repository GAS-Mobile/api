const router = require('express').Router()
const authController = require('../controllers/authController')
const { authorize } = require('../utils/utils')

router.post('/login/', authController.login)
router.post('/logout/', authorize(['Admin', 'Analyst', 'Customer']), authController.logout)
router.post('/refresh-tokens/', authController.refreshTokens)

module.exports = router