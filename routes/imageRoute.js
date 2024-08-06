const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {toShow,toUpload}=require('./controllers/userImage')

router.get('/toShowImage', authenticateToken, toShow);
router.post('/insertFile', authenticateToken, toUpload);

module.exports = router;