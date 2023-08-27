const router = require('express').Router();
const analystController = require('../controllers/analystController')
const { authorize } = require('../utils/auth')

router.get('/', authorize(['Admin']), analystController.getAllAnalysts)
router.post('/create/', authorize(['Admin']), analystController.createAnalyst)
router.get('/:id/', authorize(['Analyst', 'Admin']), analystController.getAnalystByID)
router.patch('/:id/', authorize(['Analyst', 'Admin']), analystController.updateAnalystByID)
router.delete('/:id/', authorize(['Analyst', 'Admin']), analystController.deleteAnalystByID)

module.exports = router