const { User } = require('../models/User')
const { Admin } = require('../models/Admin')
const { Analyst } = require('../models/Analyst')
const { Customer } = require('../models/Customer')

// Private route for admins
const getAuthorizedUserInfo = async (req, res) => {
  /*
    #swagger.description = "Shows information about the authorized user."
    #swagger.responses[200] = {
      content: {
        "application/json": {
          example: {
            responsePossibilities: [
              {
                "admin": {
                  "_id": "64e6b6edsafsdfa8d7ea2d26",
                  "user": {
                    "_id": "64e6bdds6ed598d7ea12269b",
                    "email": "admin@gmail.com"
                  }
                }
              },
              {
                "analyst": {
                  "_id": "64e6b1ds1bd31dad7ea2dd1a",
                  "user": {
                    "_id": "64e6dsafa121s8d7ea269b77",
                    "email": "analista@gmail.com"
                  },
                  "name": "analista",
                  "cpf": "000.100.000-00"
                }
              },
              {
                "customer": {
                  "_id": "64e6b6e1ddsaddfa12fa8d1b",
                  "user": {
                    "_id": "64e6b6ds1dfa1dfb12fa8d78",
                    "email": "customer1@gmail.com"
                  },
                  "name": "customer1",
                  "cpf": "000.000.000-00"
                }
              },
            ]
          }
        }           
      }
    }
    #swagger.responses[500] = {
      content: {
        "application/json": {
          example: {
            message: "An error occurred while fetching the user data"
          }
        }           
      }
    }
  */
  try {
    let user = req.user
    
    if (user.adminID) {
      let admin = await Admin.findById(user.adminID)
      user = await User.findById(user.userID)

      admin = {
        _id: admin.id,
        user: {
          _id: user.id,
          email: user.email
        }
      }
      res.status(200).json({admin})
    } 
    else if (user.analystID){
      let analyst = await Analyst.findById(user.analystID)
      user = await User.findById(user.userID)
      analyst = {
        ...analyst._doc,
        user: {
          _id: user.id,
          email: user.email
        }
      }
      delete analyst.__v
      res.status(200).json({analyst})
    }
    else {
      let customer = await Customer.findById(user.customerID)
      user = await User.findById(user.userID)
      customer = {
        ...customer._doc,
        user: {
          _id: user.id,
          email: user.email
        }
      }
      delete customer.__v
      res.status(200).json({customer})
    }

  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the user data" })
  }
}

module.exports = {
  getAuthorizedUserInfo,
}
