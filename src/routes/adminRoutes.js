const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { authorize } = require('../utils/utils')

router.get('/', authorize(['Admin']), adminController.getAllAdmins);
router.post('/create/', authorize(['Admin']), adminController.createAdmin);
router.get('/:id/', authorize(['Admin']), adminController.getAdminByID);
router.put('/:id/', authorize(['Admin']), adminController.updateAdminByID);
router.delete('/:id/', authorize(['Admin']), adminController.deleteAdminByID);

module.exports = router;