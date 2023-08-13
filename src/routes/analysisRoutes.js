const router = require('express').Router();
const analysisController = require('../controllers/analysisController')

router.get('/', analysisController.getAnalyzes)
router.post('/create/', analysisController.createAnalysis)
router.get('/:id/', analysisController.getAnalysisByID)
router.patch('/:id/', analysisController.updateAnalysisByID)
router.delete('/:id/', analysisController.deleteAnalysisByID)

module.exports = router