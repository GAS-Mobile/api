const { User } = require('../models/User')
const { Analyst } = require('../models/Analyst')
const { Customer } = require('../models/Customer')

// Private route for admins
const createAnalyst = async (req, res) => {
  try {
    const data = req.body.analyst

    if (!data || !data.email || !data.password || !data.name || !data.cpf){
      return res.status(400).json({ 
        message: 'To create an analyst is necessary to send email, password, name and CPF'
      })
    }

    const userExists = await User.exists({ email: data.email })
    if (userExists) {
      return res.status(409).json({ message: 'Email is already in use by another user' })
    }

    const customerExists = await Customer.exists({cpf: data.cpf})
    if (customerExists) {
      return res.status(409).json({ message: 'CPF is already in use by another user' })
    }

    const analystExists = await Analyst.exists({cpf: data.cpf})
    if (analystExists) {
      return res.status(409).json({ message: 'CPF is already in use by another user' })
    }
    
    const newUser = await User.create({email: data.email, password: data.password})
    await Analyst.create({
      user: newUser._id,
      name: data.name,
      cpf: data.cpf
    })

    res.status(201).json({ message: 'Analyst created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the analyst' })
  }
}

// Private route for admins
const getAnalysts = async (req, res) => {
  try {
    const analysts = await Analyst.find()
    .populate('user', 'email _id')
    .select({__v: 0})
      
    res.status(200).json({analysts})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching analysts' })
  }
}

// Private route for admins
const getAnalystByID = async (req, res) => {
  try {
    const analystID = req.params.id

    if (!analystID || analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID)
      .populate('user', 'email _id')
      .select({__v: 0})

    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    res.status(200).json({ analyst })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for admins
const updateAnalystByID = async (req, res) => {
  try {
    const analystID = req.params.id
    const data = req.body.analyst

    if (!data || (!data.email && !data.password && !data.name && !data.cpf)) {
      return res.status(400).json({ 
        message: 'To update an analyst, at least one field (email, password, name, cpf) must be provided' 
      })
    }

    if (!analystID || analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID).populate('user', 'email _id')
    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    if (data.email) {
      const userWithNewEmail = await User.findOne({ email: data.email })
      if (userWithNewEmail && userWithNewEmail._id.toString() !== analyst.user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use by another user' })
      }
    }

    if (data.cpf) {
      const customerWithNewCPF = await Customer.findOne({ cpf: data.cpf })
      const analystWithNewCPF = await Analyst.findOne({ cpf: data.cpf })
      if ((analystWithNewCPF && analystWithNewCPF._id.toString() !== analystID) || customerWithNewCPF) {
        return res.status(409).json({ message: 'CPF is already in use by another user' })
      }
    }

    if (data.email) analyst.user.email = data.email
    if (data.password) analyst.user.password = data.password
    if (data.name) analyst.name = data.name
    if (data.cpf) analyst.cpf = data.cpf

    await analyst.save()
    await analyst.user.save()

    res.status(200).json({ message: 'Analyst updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the analyst' })
  }
}

// Private route for admins
const deleteAnalystByID = async (req, res) => {
  try {
    const analystID = req.params.id

    if (!analystID || analystID.length !== 24) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    const analyst = await Analyst.findById(analystID)
    if (!analyst) {
      return res.status(404).json({ message: 'Analyst not found' })
    }

    await Analyst.deleteOne({ _id: analystID})
    await User.deleteOne({ _id: analyst.user._id})

    res.status(200).json({ message: 'Analyst deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAnalyst,
  getAnalysts,
  getAnalystByID,
  updateAnalystByID,
  deleteAnalystByID
}
