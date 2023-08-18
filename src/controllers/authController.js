require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models/User')
const { Admin } = require('../models/Admin')
const { Analyst } = require('../models/Analyst')
const { Customer } = require('../models/Customer')
const { ActiveRefreshToken } = require('../models/ActiveRefreshToken')
const { generateAccessToken, generateRefreshToken } = require('../utils/utils')

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

const login = async (req, res) => {
  try {
    const data = req.body.user

    if (!data || !data.email || !data.password){
      return res.status(400).json({ 
        message: 'To login is necessary to send email and password'
      })
    }
    
    const user = await User.findOne({ email: data.email })
    if (!user) {
      return res.status(401).json({ message: 'No active account found with the given credentials' })
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'No active account found with the given credentials' })
    }

    await ActiveRefreshToken.findOneAndDelete({ user: user._id })

    const admin = await Admin.findOne({user: user._id})
    if (admin) {
      const tokenData = { 
        userID: user._id,
        adminID: admin._id,
      }
      const accessToken = generateAccessToken(tokenData)
      const refreshToken = generateRefreshToken(tokenData)

      await ActiveRefreshToken.create({
        user: user._id,
        token: refreshToken,
      })
      return res.status(200).json({ accessToken, refreshToken })
    }

    const analyst = await Analyst.findOne({user: user._id})
    if (analyst) {
      const tokenData = { 
        userID: user._id,
        analystID: analyst._id,
      }
      const accessToken = generateAccessToken(tokenData)
      const refreshToken = generateRefreshToken(tokenData)

      await ActiveRefreshToken.create({
        user: user._id,
        token: refreshToken,
      })
      return res.status(200).json({ accessToken, refreshToken })
    }

    const customer = await Customer.findOne({user: user._id})
    if (customer) {
      const tokenData = { 
        userID: user._id,
        customerID: customer._id,
      }
      const accessToken = generateAccessToken(tokenData)
      const refreshToken = generateRefreshToken(tokenData)

      await ActiveRefreshToken.create({
        user: user._id,
        token: refreshToken,
      })
      return res.status(200).json({ accessToken, refreshToken })
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during login' })
  }
}

const refreshTokens = (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(400).json({ 
      message: 'Please provide a valid refresh token'
    })
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (error, decodedData) => {
    if (error) {
      return res.status(401).json({ message: "The provided refresh token is invalid or expired" })
    }

    await ActiveRefreshToken.findOneAndDelete({ user: decodedData.data.userID })

    const accessToken = generateAccessToken(decodedData.data)
    const refreshToken = generateRefreshToken(decodedData.data)

    await ActiveRefreshToken.create({
      user: decodedData.data.userID,
      token: refreshToken,
    })

    return res.status(200).json({ accessToken, refreshToken })
  })
}

module.exports = {
  login,
  refreshTokens,
}