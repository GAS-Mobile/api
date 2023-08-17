const router = require('express').Router();
const companyController = require('../controllers/adminController');

router.get('/', companyController.getAdmins);
router.post('/create/', companyController.createAdmin);
router.get('/:id/', companyController.getAdminByID);
router.put('/:id/', companyController.updateAdminByID);
router.delete('/:id/', companyController.deleteAdminByID);

module.exports = router;