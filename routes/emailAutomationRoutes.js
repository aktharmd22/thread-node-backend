const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const {sendEmail ,sendWhatsapp } = require('../controllers/emailAutomation');
const router = express.Router();

router.post('/send-email',authenticateToken,sendEmail)
router.get('/send-whatsapp',authenticateToken,sendWhatsapp)

module.exports=router
