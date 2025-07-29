require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const os = require('os'); // Kept if you have other uses for getNetworkIPs, but not strictly for deployed CORS

const app = express();
const PORT = process.env.PORT || 3000;

// --- CORRECTED CORS CONFIGURATION ---
// The origin header from the browser when accessing your Nginx server
const deployed_origin = 'http://34.100.243.199'; 

// For local development if you ever run frontend and backend separately
const local_dev_origin_frontend = 'http://localhost:5173'; 

app.use(cors({
  origin: function (origin, callback) {
    // origin will be undefined for non-browser requests (e.g. curl) or the actual origin
    if (!origin || origin === deployed_origin || origin === local_dev_origin_frontend) {
      console.log('Allowed by CORS:', origin); // Log allowed origin
      callback(null, true);
    } else {
      console.log('Blocked by CORS! Origin was:', origin); // Log blocked origin
      callback(new Error('Not allowed by CORS! Origin: ' + origin));
    }
  },
  methods: ['POST', 'GET', 'OPTIONS'], // Add GET if you plan to have GET API routes
  credentials: true // Set to true if you're dealing with cookies or sessions
}));
// --- END OF CORS CONFIGURATION ---

app.use(express.json());

// Email endpoint with improved error handling
app.post('/api/send-email', async (req, res) => {
  // This console log helps see if the request gets past CORS
  console.log('Email request received. Body:', req.body, 'Origin:', req.headers.origin); 
  
  const { user_name, user_email, user_phone, user_company, message } = req.body;

  // Enhanced validation
  if (!user_name || !user_email || !message) {
    console.log('Validation failed: Name, email, or message missing.');
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required fields'
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Make sure this is in your .env
        pass: process.env.EMAIL_PASS  // Make sure this is in your .env (App Password for Gmail)
      },
      // It's better to let Nodemailer handle TLS for Gmail without this,
      // unless you have very specific network reasons.
      // tls: {
      //   rejectUnauthorized: false 
      // }
    });

    const mailOptions = {
      from: `"RR Business Group" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,       // Make sure this is in your .env
      replyTo: user_email,
      subject: `New Contact Form Submission: ${user_name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        ${user_phone ? `<p><strong>Phone:</strong> ${user_phone}</p>` : ''}
        ${user_company ? `<p><strong>Company:</strong> ${user_company}</p>` : ''}
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    console.log('Attempting to send email with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! Message ID:', info.messageId);
    
    res.status(200).json({ 
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email sending failed. Error details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please check server logs.',
      // Sending back error.message can be helpful for debugging but consider security implications for production
      error: error.message 
    });
  }
});

// Start server on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}. NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`Ready to accept requests from defined origins, including ${deployed_origin}`);
  // The getNetworkIPs and its logging can be removed if not needed for other debugging
  // const networkIPs = getNetworkIPs();
  // console.log(`  - Local:    http://localhost:${PORT}`);
  // console.log(`  - Network:  ${networkIPs.map(ip => `http://${ip}:${PORT}`).join('\n             ')}`);
});

// You can remove the getNetworkIPs function if it's no longer used for CORS or other logging
// function getNetworkIPs() { ... }
