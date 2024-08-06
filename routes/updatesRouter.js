const express=require("express")
const authenticateToken = require('../middleware/authMiddleware');
const { getUpdates,insertUpdates} = require('../controllers/updates');
const { route } = require("./updatesRouter");
const router = express.Router();

router.get('/get-updates',authenticateToken,getUpdates)
router.post('/insert-updates',authenticateToken,insertUpdates)

module.exports=router