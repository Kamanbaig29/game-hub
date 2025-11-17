import { Mail, MessageCircle, Twitter, Globe } from 'lucide-react';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    if (!executeRecaptcha) {
      setSubmitStatus('reCAPTCHA not available.');
      setIsSubmitting(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha('contact_form');
      
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken })
      });

      if (response.ok) {
        setSubmitStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <header className="contact-header">
          <img src="/logo.png" alt="Crypto Verse" className="contact-logo" />
          <h1>Contact Us</h1>
        </header>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="mb-6">
              We'd love to hear from you! Whether you have a question about our games, 
              need support, or just want to say hello — we're here for you.
            </p>

            <div className="info-grid">
              <div className="info-item">
                <Mail className="icon" />
                <div>
                  <h3>Email Us</h3>
                  <a href="mailto:support@cryptoverse.com">support@cryptoverse.com</a>
                </div>
              </div>

              <div className="info-item">
                <MessageCircle className="icon" />
                <div>
                  <h3>Live Chat</h3>
                  <p>Available 24/7 on Discord</p>
                </div>
              </div>

              <div className="info-item">
                <Globe className="icon" />
                <div>
                  <h3>Community</h3>
                  <p>Join thousands of players worldwide</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#" aria-label="Twitter"><Twitter size={28} /></a>
              <a href="#" aria-label="Discord"><MessageCircle size={28} /></a>
              <a href="#" aria-label="Website"><Globe size={28} /></a>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Your Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Your Message" 
                rows={6} 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>
            {submitStatus && <p className="submit-status">{submitStatus}</p>}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}