const express = require('express');
const { getServiceList, getServiceById, insertService, updateService, deleteService } = require('../controllers/serviceController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getserviceList', authenticateToken, getServiceList);
router.get('/getservice/:id', authenticateToken, getServiceById);
router.post('/insertingServiceList', authenticateToken, insertService);
router.put('/updatingService/:id', authenticateToken, updateService);
router.delete('/deletingService/:id', authenticateToken, deleteService);

module.exports = router;
