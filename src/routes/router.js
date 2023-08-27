const router = require('express').Router()
const customerRoutes = require('./customerRoutes')
const companyRoutes = require('./companyRoutes')
const analystRoutes = require('./analystRoutes')
const analysisRequestRoutes = require('./analysisRequestRoutes')
const analysisRoutes = require('./analysisRoutes')
const adminRoutes = require('./adminRoutes')
const authRoutes = require('./authRoutes')

router.use('/analyzes', analysisRoutes)
router.use('/requests', analysisRequestRoutes
/*
  #swagger.tags = ['Analysis Requests']
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
          message: "Analysis request not found"
        }
      }           
    }
  }
*/
)
router.use('/companies', companyRoutes
/* 
  #swagger.tags = ['Companies']
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
          message: "Company not found"
        }
      }           
    }
  }
  #swagger.responses[409] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          message: "CNPJ is already in use by another company"
        }
      }           
    }
  }
*/
)
router.use('/customers', customerRoutes
/* 
  #swagger.tags = ['Customers']
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
          message: "Customer not found"
        }
      }           
    }
  }
  #swagger.responses[409] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          responsePossibilities: [
            { message: "Email is already in use by another user" },
            { message: "CPF is already in use by another user" }
          ]
        }
      }           
    }
  }
*/
)
router.use('/analysts', analystRoutes
/* 
  #swagger.tags = ['Analysts']
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
          message: "Analyst not found"
        }
      }           
    }
  }
  #swagger.responses[409] = {
    ifStatusPresent: true,
    content: {
      "application/json": {
        example: {
          responsePossibilities: [
            { message: "Email is already in use by another user" },
            { message: "CPF is already in use by another user" }
          ]
        }
      }           
    }
  }
*/
)
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