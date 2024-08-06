const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/registernewuser', registerUser);
router.post('/userlogin', loginUser);

module.exports = router;
