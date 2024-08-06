const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const{insertIssue, getIssue}=require('../controllers/issueText');

const router = express.Router();

router.get('/getTicketsissue/:customer_id', authenticateToken, getIssue)
router.post('/insert-issue',authenticateToken,insertIssue)


module.exports=router