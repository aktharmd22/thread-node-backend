const express = require('express');
const { getAllDesignations, getDesignationById, insertDesignation, updateDesignation, deleteDesignation } = require('../controllers/designationController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/gettingAllDesignation', authenticateToken, getAllDesignations);
router.get('/gettingDesignation/:id', authenticateToken, getDesignationById);
router.post('/insertingDesignation', authenticateToken, insertDesignation);
router.put('/updateDesignation/:id', authenticateToken, updateDesignation);
router.delete('/deleteDesignation/:id', authenticateToken, deleteDesignation);

module.exports = router;
