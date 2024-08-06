const db = require('../db')
const nodemailer = require('nodemailer');
require('dotenv').config();
const twilio = require('twilio');



const sendEmail = async (req, res) => {
    const { to_mail, subject, text } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to_mail,
            subject: subject,
            text: text
        };

        let info = await transporter.sendMail(mailOptions);

        res.send("Mail sent successfully");
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send("Error sending email");
    }
}
const sendWhatsapp = (req, res) => {
    

}


module.exports = { sendEmail, sendWhatsapp }