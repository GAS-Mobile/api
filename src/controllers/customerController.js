const { User } = require('../models/User')
const { Customer } = require('../models/Customer')
const { Analyst } = require('../models/Analyst')

// Public route
const createCustomer = async (req, res) => {
  try {
    const data = req.body.customer

    if (!data || !data.email || !data.password || !data.name || !data.cpf){
      return res.status(400).json({ 
        message: 'To create a customer is necessary to send email, password, name and CPF'
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
    await Customer.create({
      user: newUser._id,
      name: data.name,
      cpf: data.cpf
    })

    res.status(201).json({ message: 'Customer created successfully' })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the customer' })
  }
}
// Private route for admins
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate('user', 'email _id')
      .select({__v: 0})
      
    res.status(200).json({customers})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching customers' })
  }
}

// Private route for customers
const getCustomerByID = async (req, res) => {
  try {
    const customerID = req.params.id

    if (!customerID || customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID)
      .populate('user', 'email _id')
      .select({__v: 0})

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.status(200).json({customer})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Private route for customers
const updateCustomerByID = async (req, res) => {
  try {
    const customerID = req.params.id
    const data = req.body.customer

    if (!data || (!data.email && !data.password && !data.name && !data.cpf)) {
      return res.status(400).json({ 
        message: 'To update a customer, at least one field (email, password, name, cpf) must be provided' 
      })
    }

    if (!customerID || customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID).populate('user', 'email _id')
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    if (data.email) {
      const userWithNewEmail = await User.findOne({ email: data.email })
      if (userWithNewEmail && userWithNewEmail._id.toString() !== customer.user._id.toString()) {
        return res.status(409).json({ message: 'Email is already in use by another user' })
      }
    }

    if (data.cpf) {
      const customerWithNewCPF = await Customer.findOne({ cpf: data.cpf })
      const analystWithNewCPF = await Analyst.findOne({ cpf: data.cpf })
      if ((customerWithNewCPF && customerWithNewCPF._id.toString() !== customerID) || analystWithNewCPF) {
        return res.status(409).json({ message: 'CPF is already in use by another user' })
      }
    }

    if (data.email) customer.user.email = data.email
    if (data.password) customer.user.password = data.password
    if (data.name) customer.name = data.name
    if (data.cpf) customer.cpf = data.cpf

    await customer.save()
    await customer.user.save()

    res.status(200).json({ message: 'Customer updated successfully' })
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the customer' })
  }
}

// Private route for customers
const deleteCustomerByID = async (req, res) => {
  try {
    const customerID = req.params.id

    if (!customerID || customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID)
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    await Customer.deleteOne({ _id: customerID})
    await User.deleteOne({ _id: customer.user._id})

    res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerByID,
  updateCustomerByID,
  deleteCustomerByID
}
