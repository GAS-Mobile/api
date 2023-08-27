const router = require('express').Router();
const analysisController = require('../controllers/analysisController')
const { authorize } = require('../utils/auth')

router.get('/', analysisController.getAllAnalyzes)
router.get('/:id/', analysisController.getAnalysisByID)
router.patch('/:id/', authorize(['Analyst']), analysisController.updateAnalysisByID)
router.delete('/:id/', authorize(['Analyst']), analysisController.deleteAnalysisByID)

module.exports = router