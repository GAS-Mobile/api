const router = require('express').Router()
const customerRoutes = require('./customerRoutes')
const companyRoutes = require('./companyRoutes')
const analystRoutes = require('./analystRoutes')
const analysisRequestRoutes = require('./analysisRequestRoutes')
const analysisRoutes = require('./analysisRoutes')
const adminRoutes = require('./adminRoutes')
const authRoutes = require('./authRoutes')

router.use('/customers', customerRoutes)
router.use('/companies', companyRoutes)
router.use('/analysts', analystRoutes)
router.use('/requests', analysisRequestRoutes)
router.use('/analyzes', analysisRoutes)
router.use('/admins', adminRoutes)
router.use('/auth', authRoutes)

module.exports = router