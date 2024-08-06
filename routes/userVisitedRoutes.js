const express= require('express')
const router=express.Router()
const authenticateToken=require('../middleware/authMiddleware')
const {insertUserVisitedTime,getUserVisitedDetails}=require('../controllers/userVisitedTime')

router.get('/get-user-visited-time',authenticateToken,getUserVisitedDetails)
router.post('/insert-visitedtime',authenticateToken,insertUserVisitedTime)

module.exports = router