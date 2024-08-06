const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const { insertNotes,getNotes,getNotesOfSingleCustomer,updateNotes,deleteNotes,getNotese } = require('../controllers/noteController');
const router = express.Router();

router.get('/getNotese', authenticateToken, getNotese);
router.get('/getNotes/:id', authenticateToken, getNotes);
router.get('/getNotesOfSingleCustomer/:customer_id', authenticateToken, getNotesOfSingleCustomer);
router.post('/insertNotes', authenticateToken, insertNotes);
router.put('/updateNotes/:id', authenticateToken, updateNotes);
router.delete('/deleteNotes/:id', authenticateToken, deleteNotes);

module.exports = router;