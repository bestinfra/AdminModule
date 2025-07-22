import nodemailer from 'nodemailer';
import { getLoginCredentialsEmailHtml } from '../utils/emailTemplates.js';

// POST /api/send-credentials
export async function sendLoginCredentialsEmail(req, res) {
  const { to, username, password } = req.body;
  if (!to || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields: to, username, password' });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Read and fill the HTML template
  let html;
  try {
    html = await getLoginCredentialsEmailHtml({ username, password });
  } catch (err) {
    console.error('Error reading email template:', err);
    return res.status(500).json({ error: 'Failed to read email template' });
  }

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your BestInfra Login Credentials',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Login credentials email sent successfully' });
  } catch (error) {
    console.error('Error sending login credentials email:', error);
    res.status(500).json({ error: 'Failed to send login credentials email' });
  }
} 