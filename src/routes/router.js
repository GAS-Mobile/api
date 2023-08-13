const router = require('express').Router()
const customerRoutes = require('./customerRoutes')
const companyRoutes = require('./companyRoutes')
const analystRoutes = require('./analystRoutes')

router.use('/customers', customerRoutes)
router.use('/companies', companyRoutes)
router.use('/analysts', analystRoutes)

module.exports = router