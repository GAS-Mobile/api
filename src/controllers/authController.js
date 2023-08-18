require('dotenv').config()
const bcrypt = require('bcrypt')

const { User } = require('../models/User')
const { Admin } = require('../models/Admin')
const { Analyst } = require('../models/Analyst')
const { Customer } = require('../models/Customer')
const { ActiveRefreshToken } = require('../models/ActiveRefreshToken')
const { generateAccessToken, generateRefreshToken } = require('../utils/utils')

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

    const isAdmin = await Admin.exists({user: user._id})
    if (isAdmin) {
      const tokenData = { 
        userID: user._id,
        typeOfUser: 'Admin'
      }
      const accessToken = generateAccessToken(tokenData)
      const refreshToken = generateRefreshToken(tokenData)

      await ActiveRefreshToken.create({
        user: user._id,
        token: refreshToken,
      })
      return res.status(200).json({ accessToken, refreshToken })
    }

    const isAnalyst = await Analyst.exists({user: user._id})
    if (isAnalyst) {
      const tokenData = { 
        userID: user._id,
        typeOfUser: 'Analyst'
      }
      const accessToken = generateAccessToken(tokenData)
      const refreshToken = generateRefreshToken(tokenData)

      await ActiveRefreshToken.create({
        user: user._id,
        token: refreshToken,
      })
      return res.status(200).json({ accessToken, refreshToken })
    }

    const isCustomer = await Customer.exists({user: user._id})
    if (isCustomer) {
      const tokenData = { 
        userID: user._id,
        typeOfUser: 'Customer'
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

module.exports = {
  login,
}
