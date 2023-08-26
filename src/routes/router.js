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
router.use('/admins', adminRoutes
/* 
  #swagger.tags = ['Admins']
  #swagger.summary = "Private route for admins"
  #swagger.security = [{
    "bearerAuth": []
  }]
  #swagger.responses[401] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          message: "Unauthorized access"
        }
      }           
    }
  }
  #swagger.responses[403] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          message: "You do not have sufficient privileges to access this route"
        }
      }           
    }
  }
  #swagger.responses[404] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          message: "Admin not found"
        }
      }           
    }
  }
  #swagger.responses[409] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          message: "Email is already in use by another user"
        }
      }           
    }
  }
*/
)
router.use('/auth', authRoutes
/* 
  #swagger.tags = ['Auth']
*/
)

module.exports = router