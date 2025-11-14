import express, { type Request, type Response } from 'express';

const router = express.Router();



interface ContactRequest {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
}

const sendEmail = async (name: string, email: string, message: string) => {
  const url = "https://api.resend.com/emails";
  
  const headers = {
    "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };
  
  const data = {
    from: "send@support.tokenmap.io",
    to: ["support@cryptoverse.com"],
    subject: `Contact Form: Message from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
  };
  
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  
  return response;
};

const verifyRecaptcha = async (token: string) => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  const data = await response.json();
  return data.success;
};

router.post('/send', async (req: Request, res: Response) => {
  try {
    const { name, email, message, recaptchaToken }: ContactRequest = req.body;
    
    if (!name || !email || !message || !recaptchaToken) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }
    
    const response = await sendEmail(name, email, message);
    const result = await response.json();
    
    if (response.ok) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send email', details: result });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;