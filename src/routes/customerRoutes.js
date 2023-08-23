const router = require('express').Router();
const customerController = require('../controllers/customerController')
const { authorize } = require('../utils/utils')

router.get('/', authorize(['Admin']), customerController.getAllCustomers)
router.post('/create/', customerController.createCustomer)
router.get('/:id/', authorize(['Customer']), customerController.getCustomerByID)
router.put('/:id/', authorize(['Customer']), customerController.updateCustomerByID)
router.delete('/:id/', authorize(['Customer']), customerController.deleteCustomerByID)

module.exports = router