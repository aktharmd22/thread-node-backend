const express = require('express');
const { getAgentList, getAgentById,updateUserDetails, deleteAgentById , getAgentByEmail} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/admin/getAgentList', authenticateToken, getAgentList);
router.get('/getUserByEmail/:email_address', authenticateToken, getAgentByEmail);
router.get('/getUserid/:email_address',  getAgentByEmail);
router.get('/admin/getAgentList/:id', authenticateToken, getAgentById);
router.put('/admin/updateUserList/:id',authenticateToken, updateUserDetails);
router.delete('/admin/deleteAgentById/:id',authenticateToken,deleteAgentById );

module.exports = router;
