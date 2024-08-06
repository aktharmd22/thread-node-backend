const express = require('express');
const {updateCustomerServiceList, insertingCustomerInformation,updateCustomerInformation, getCustomerDetails,getUpdateCustomerServiceDetails,insertingCustomerDetails,deleteCustomerEachService,   updateCustomerDetails, deleteCustomerDetails,getCustomerDetail,getServicesListOwnedbyCustomer,customer,getCustomerInformation,getSingleCustomerServices} = require('../controllers/customerController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/getcustomerDetails', authenticateToken, getCustomerDetails);
router.get('/getUpdateCustomerServiceDetails/:customer_services_id', authenticateToken, getUpdateCustomerServiceDetails);
router.get('/getServicesListOwnedbyCustomer', authenticateToken, getServicesListOwnedbyCustomer);
router.get('/customerDetails', authenticateToken, customer);
router.get('/getSingleCustomerServices/:id', authenticateToken, getSingleCustomerServices);
router.get('/getcustomerinformation/:id', authenticateToken, getCustomerInformation);
router.get('/getCustomerDetail/:id/:service_name', authenticateToken, getCustomerDetail);

router.put('/updateCustomerServiceList/:id', authenticateToken, updateCustomerServiceList);
router.put('/updateCustomerInformation/:id', authenticateToken, updateCustomerInformation);
router.put('/updateCustomerDetails/:id', authenticateToken, updateCustomerDetails);
router.delete('/deleteCustomerDetails/:id', authenticateToken, deleteCustomerDetails);
router.delete('/deleteCustomerEachService/:id', authenticateToken,deleteCustomerEachService );

router.post('/insertingCustomerDetails', authenticateToken, insertingCustomerDetails);
router.post('/insertingCustomerInformation', authenticateToken, insertingCustomerInformation);

module.exports = router;
