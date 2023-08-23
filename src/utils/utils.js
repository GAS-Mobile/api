require('dotenv').config()
const jwt = require('jsonwebtoken')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

const generateAccessToken = (data) => {
  return jwt.sign({data}, ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}

const generateRefreshToken = (data) => {
  return jwt.sign({data}, REFRESH_TOKEN_SECRET, { expiresIn: '6h' })
}

const authorize = (typeOfUsersAuthorized) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized access" })
    }

    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, decodedData) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized access" })
      }

      req.user = decodedData.data

      if (typeOfUsersAuthorized.includes('Admin') && decodedData.data.adminID) {
        return next()
      } else if (typeOfUsersAuthorized.includes('Analyst') && decodedData.data.analystID) {
        return next()
      } else if (typeOfUsersAuthorized.includes('Customer') && decodedData.data.customerID) {
        return next()
      }

      return res.status(403).json({ message: "You do not have sufficient privileges to access this route" })
    })
  }
}


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  authorize,
}