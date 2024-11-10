import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use any service or SMTP
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });
  }

  // Send Email function
  public sendMail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: subject,
      text: text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Failed to send email');
    }
  };
}

export default new MailerService();
