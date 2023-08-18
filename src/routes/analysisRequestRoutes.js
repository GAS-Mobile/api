const router = require('express').Router();
const analysisRequestController = require('../controllers/analysisRequestController')
const { authorize } = require('../utils/utils')

router.get('/', authorize(['Analyst', 'Customer']), analysisRequestController.getAllAnalysisRequests)
router.post('/create/', authorize(['Customer']), analysisRequestController.createAnalysisRequest)
router.get('/:id/', authorize(['Analyst', 'Customer']), analysisRequestController.getAnalysisRequestByID)
router.patch('/:id/', authorize(['Analyst']), analysisRequestController.updateAnalysisRequestByID)
router.delete('/:id/', authorize(['Analyst', 'Customer']), analysisRequestController.deleteAnalysisRequestByID)

module.exports = router