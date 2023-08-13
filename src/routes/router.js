const router = require('express').Router()
const customerRoutes = require('./customerRoutes')
const companyRoutes = require('./companyRoutes')

router.use('/customers', customerRoutes)
router.use('/companies', companyRoutes)

module.exports = router