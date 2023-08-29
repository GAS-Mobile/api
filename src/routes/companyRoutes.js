const router = require('express').Router();
const companyController = require('../controllers/companyController');
const { authorize } = require('../utils/auth')

router.get('/', companyController.getAllCompanies);
router.get('/search', companyController.searchCompanies);
router.post('/create/', authorize(['Admin']), companyController.createCompany);
router.get('/:id/', companyController.getCompanyByID);
router.put('/:id/', authorize(['Admin']), companyController.updateCompanyByID);
router.delete('/:id/', authorize(['Admin']), companyController.deleteCompanyByID);
router.get('/:id/analyzes', companyController.getCompanyAnalyzes);

module.exports = router;
