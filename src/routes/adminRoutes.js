const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { authorize } = require('../utils/auth')

router.get('/', authorize(['Admin']), adminController.getAllAdmins);
router.post('/create/', adminController.createAdmin);
router.get('/:id/', authorize(['Admin']), adminController.getAdminByID);
router.put('/:id/', authorize(['Admin']), adminController.updateAdminByID);
router.delete('/:id/', authorize(['Admin']), adminController.deleteAdminByID);

module.exports = router;