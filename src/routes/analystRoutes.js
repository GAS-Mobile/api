const router = require('express').Router();
const analystController = require('../controllers/analystController')

router.get('/', analystController.getAnalysts)
router.post('/create/', analystController.createAnalyst)
router.get('/:id/', analystController.getAnalystByID)
router.patch('/:id/', analystController.updateAnalystByID)
router.delete('/:id/', analystController.deleteAnalystByID)

module.exports = router