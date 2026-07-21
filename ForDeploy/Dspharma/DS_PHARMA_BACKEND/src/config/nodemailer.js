import nodemailer from 'nodemailer';
import { emailPassword, emailUser } from './credentials.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});
