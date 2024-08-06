const express=require("express")
const{getNotifications}=require('../controllers/notificationController')

const authenticateToken=require("../middleware/authMiddleware")

const router=express.Router()

router.get("/getnotification/:id",authenticateToken,getNotifications)


module.exports=router