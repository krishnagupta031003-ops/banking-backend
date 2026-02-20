require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
     console.log("SENDING EMAIL TO:", to);
    const info = await transporter.sendMail({
      from: `"Banking Backend " <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegisterationEmail(userEmail,name){

    console.log("EMAIL FUNCTION CALLED for:", userEmail);


    const subject = "welcome to the Banking backend"
    const text = `Hello ${name},\n\nThank you for registering at Backing backend.
    we're excited to have you on board!\n\nBest regards,\nThe Banking Backend Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Backing backend.
    we're excited to have you on board!</p><p>Best regards,<br>The Banking Backend Team</p>`

    await sendEmail(userEmail,subject,text,html)
}

module.exports = {
    sendRegisterationEmail
};