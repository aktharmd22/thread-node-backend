const authenticateToken = require('../middleware/authMiddleware');
const express = require('express');
const { basedOnSpecificDate,basedOnMonth,basedOnYear,overAll,servicesCount,thisMontRenewal} = require('../controllers/analytics');
const router = express.Router();


router.get('/analyticsToday',basedOnSpecificDate)
router.get('/analyticsMonth',basedOnMonth)
router.get('/analyticsYear',basedOnYear)
router.get('/TotalPurchase',overAll)
router.get('/TotalServicesCount',servicesCount)


router.get('/this-month-renewal',thisMontRenewal)




module.exports = router;