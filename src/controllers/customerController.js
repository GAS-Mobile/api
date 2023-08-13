const { Customer } = require('../models/Customer')

const createCustomer = async (req, res) => {
  try {
    const data = req.body.customer

    const customerExists = await Customer
      .exists({$or: [{email: data.email}, {cpf: data.cpf}]})

    if (customerExists) {
      return res.status(409).json({ message: 'Customer already exists' })
    }

    await Customer.create(data)
    res.status(201).json({ message: 'Customer created successfully' })

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the customer' })
  }
}

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .select({_id: 0, __v:0, password: 0})
      
    res.status(200).json({customers})

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching customers' })
  }
}

const getCustomerByID = async (req, res) => {
  try {
    const customerID = req.params.id

    if (customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID)
      .select({_id: 0, __v:0, password: 0})

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    res.status(200).json({customer})

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateCustomerByID = async (req, res) => {
  try {
    const customerID = req.params.id
    const data = req.body.customer

    if (customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customer = await Customer.findById(customerID)

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customerWithEmailReceived = await Customer.findOne({ email: data.email })

    if (!customerWithEmailReceived) {
      customer.set(data)
      await customer.save()
      res.status(200).json({ message: 'Customer updated successfully' })

    } else if(customerWithEmailReceived.cpf === customer.cpf){
      customer.set(data)
      await customer.save()
      res.status(200).json({ message: 'Customer updated successfully' })

    } else {
      res.status(409).json({ message: 'A customer with this email already exists' })
    }

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteCustomerByID = async (req, res) => {
  try {
    const customerID = req.params.id

    if (customerID.length !== 24) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const customerExists = await Customer.exists({ _id: customerID })

    if (!customerExists) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    await Customer.deleteOne({ _id: customerID})
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
