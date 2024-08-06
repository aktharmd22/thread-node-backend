const express= require('express')
const router=express.Router()
const authenticateToken=require('../middleware/authMiddleware')
const {insertRenewal,getRenewal}=require('../controllers/renewal')

router.get('/get-renewal/:customer_id',authenticateToken,getRenewal)
router.post("/insert-renewal",authenticateToken,insertRenewal)



module.exports=router