const router = require('express').Router();
const companyController = require('../controllers/companyController');

router.get('/', companyController.getAllCompanies);
router.post('/create/', companyController.createCompany);
router.get('/:id/', companyController.getCompanyByID);
router.put('/:id/', companyController.updateCompanyByID);
router.delete('/:id/', companyController.deleteCompanyByID);

module.exports = router;
