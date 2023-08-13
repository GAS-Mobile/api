const router = require('express').Router();
const analysisRequestController = require('../controllers/analysisRequestController')

router.get('/', analysisRequestController.getAnalysisRequests)
router.post('/create/', analysisRequestController.createAnalysisRequest)
router.get('/:id/', analysisRequestController.getAnalysisRequestByID)
router.delete('/:id/', analysisRequestController.deleteAnalysisRequestByID)

module.exports = router