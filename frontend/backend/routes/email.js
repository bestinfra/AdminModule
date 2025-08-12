import express from 'express';
import { sendLoginCredentialsEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-credentials', sendLoginCredentialsEmail);

export default router; 