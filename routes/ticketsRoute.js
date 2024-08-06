const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const{insertTickets,getTicketsById,updateTickets}=require('../controllers/ticketsController')
const router = express.Router();

router.get("/get-tickets/:customer_id/:email_address",authenticateToken,getTicketsById)
router.post("/insert-new-tickets",authenticateToken,insertTickets)
router.put("/update-tickets",authenticateToken,updateTickets)

module.exports=router