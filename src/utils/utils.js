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

module.exports = {
  generateAccessToken,
  generateRefreshToken,
}