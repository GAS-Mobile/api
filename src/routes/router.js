const router = require('express').Router()
const customerRoutes = require('./customerRoutes')
const companyRoutes = require('./companyRoutes')
const analystRoutes = require('./analystRoutes')
const analysisRequestRoutes = require('./analysisRequestRoutes')

router.use('/customers', customerRoutes)
router.use('/companies', companyRoutes)
router.use('/analysts', analystRoutes)
router.use('/requests', analysisRequestRoutes)

module.exports = router