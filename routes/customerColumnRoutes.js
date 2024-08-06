const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

const {getCustomerColumnName,addColumns, updateColumnNames,deleteColumn}= require('../controllers/customerColumnController');

router.get('/getCustomerColumnName', authenticateToken, getCustomerColumnName);
router.post('/addcolumns', authenticateToken, addColumns);
router.put('/updateColumnNames', authenticateToken, updateColumnNames);
router.delete('/deleteColumn', authenticateToken, deleteColumn);

module.exports = router;