const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const { expires,getExpiry } = require('../controllers/expiry');
const router = express.Router();

router.get('/totalExpiry', authenticateToken, expires);
router.get('/getExpiry', authenticateToken, getExpiry);



module.exports = router;