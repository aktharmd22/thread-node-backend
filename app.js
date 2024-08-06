const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const designationRoutes = require('./routes/designationRoutes');
const noteRouter = require('./routes/noteRouter');
const customerColumnRoutes = require('./routes/customerColumnRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const expiryRoutes = require('./routes/expiryRoutes');
const ticketsRoute=require('./routes/ticketsRoute')
const issueTexRouter=require('./routes/issueTextRoute')
const notificationRouter=require('./routes/notificationRoutes')
const userVisitedRoutes= require('./routes/userVisitedRoutes')
const renewalRouter=require('./routes/renewalRouter')
const updatesRouter=require('./routes/updatesRouter')
const emailAutomationRouter=require('./routes/emailAutomationRoutes')

const app = express();

app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(customerRoutes);
app.use(serviceRoutes);
app.use(designationRoutes);
app.use(noteRouter);
app.use(customerColumnRoutes);
app.use(analyticsRoutes);
app.use(expiryRoutes)
app.use(ticketsRoute)
app.use(issueTexRouter)
app.use(notificationRouter)
app.use(userVisitedRoutes)
app.use(renewalRouter)
app.use(updatesRouter)
app.use(emailAutomationRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
