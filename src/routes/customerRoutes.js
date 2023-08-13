const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')

router.get('/', customerController.getCustomers)
router.post('/create/', customerController.createCustomer)
router.get('/:id/', customerController.getCustomerByID)
router.put('/:id/', customerController.updateCustomerByID)
router.delete('/:id/', customerController.deleteCustomerByID)

module.exports = router