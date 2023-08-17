const { User } = require('../models/User')
const { Admin } = require('../models/Admin')

// Private route for admins
const createAdmin = async (req, res) => {
  try {
    const data = req.body.admin

    if (!data || !data.email || !data.password){
      return res.status(400).json({ 
        message: 'To create an admin is necessary to send email and password'
      })
    }

    const userExists = await User.exists({ email: data.email })
    if (userExists) {
      return res.status(409).json({ message: 'Email is already in use by another user' })
    }
    
    const newUser = await User.create({email: data.email, password: data.password})
    await Admin.create({
      user: newUser._id,
    })

    res.status(201).json({ message: 'Admin created successfully' })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the admin' })
  }
}
// Private route for admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .populate('user', 'email _id')
      .select({__v: 0})
      
    res.status(200).json({admins})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching admins' })
  }
}

// Private route for admins
const getAdminByID = async (req, res) => {
  try {
    const adminID = req.params.id

    if (!adminID || adminID.length !== 24) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const admin = await Admin.findById(adminID)
      .populate('user', 'email _id')
      .select({__v: 0})

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.status(200).json({admin})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for admins
const updateAdminByID = async (req, res) => {
  try {
    const adminID = req.params.id
    const data = req.body.admin

    if (!data || (!data.email && !data.password)) {
      return res.status(400).json({ 
        message: 'To update an admin, at least one field (email, password) must be provided' 
      })
    }

    if (!adminID || adminID.length !== 24) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const admin = await Admin.findById(adminID).populate('user', 'email _id')
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    if (data.email) {
      const userWithNewEmail = await User.findOne({ email: data.email })
      if (userWithNewEmail && userWithNewEmail._id.toString() !== admin.user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use by another user' })
      }
    }

    if (data.email) admin.user.email = data.email
    if (data.password) admin.user.password = data.password

    await admin.user.save()

    res.status(200).json({ message: 'Admin updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred while updating the admin' })
  }
}

// Private route for admins
const deleteAdminByID = async (req, res) => {
  try {
    const adminID = req.params.id

    if (!adminID || adminID.length !== 24) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    const admin = await Admin.findById(adminID)
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    await Admin.deleteOne({ _id: adminID})
    await User.deleteOne({ _id: admin.user._id})

    res.status(200).json({ message: 'Admin deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAdmin,
  getAdmins,
  getAdminByID,
  updateAdminByID,
  deleteAdminByID
}
