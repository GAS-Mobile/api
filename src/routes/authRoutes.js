const router = require('express').Router()
const authController = require('../controllers/authController')
const { authorize } = require('../utils/auth')

router.post('/login/', authController.login)
router.delete('/logout/', authorize(['Admin', 'Analyst', 'Customer']), authController.logout)
router.post('/refresh-tokens/', authController.refreshTokens)

module.exports = router