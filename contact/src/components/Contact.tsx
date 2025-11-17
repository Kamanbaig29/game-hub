import { Mail, MessageCircle, Twitter, Globe } from 'lucide-react';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import GameModels from './GameModels';
import styles from '../assets/contact.module.css';

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
    <div className={styles.contactPage}>
      {/* Background Models */}
      <div className={styles.backgroundModels}>
        <GameModels type="blockchain" className={styles.model1} />
        <GameModels type="crypto" className={styles.model2} />
        <GameModels type="web3" className={styles.model3} />
        <GameModels type="nft" className={styles.model4} />
        <GameModels type="solana" className={styles.model5} />
        <GameModels type="token" className={styles.model6} />
        <GameModels type="wallet" className={styles.model7} />
        <GameModels type="gamepad" className={styles.model8} />
        <GameModels type="dice" className={styles.model9} />
        <GameModels type="coin" className={styles.model10} />
        <GameModels type="trophy" className={styles.model11} />
        <GameModels type="controller" className={styles.model12} />
        <GameModels type="headset" className={styles.model13} />
        <GameModels type="keyboard" className={styles.model14} />
        <GameModels type="mouse" className={styles.model15} />
        <GameModels type="joystick" className={styles.model16} />
      </div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Get in Touch</h1>
            <p className={styles.subtitle}>
              Connect with the Cryptoverse community. We're here to help you on your Web3 gaming journey.
            </p>
          </div>
          <div className={styles.heroModels}>
            <GameModels type="wallet" className={styles.heroModel1} />
            <GameModels type="solana" className={styles.heroModel2} />
          </div>
        </section>

        {/* Contact Content */}
        <section className={styles.contactSection}>
          <div className={styles.contactGrid}>
            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <h2>Connect With Us</h2>
              <p>
                Whether you need support, have questions about our games, or want to join our community — we're here for you.
              </p>

              <div className={styles.infoCards}>
                <div className={styles.infoCard}>
                  <Mail className={styles.icon} />
                  <div>
                    <h3>Email Support</h3>
                    <a href="mailto:support@cryptoverse.com">support@cryptoverse.com</a>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <MessageCircle className={styles.icon} />
                  <div>
                    <h3>Discord Community</h3>
                    <p>Join 50K+ players worldwide</p>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <Globe className={styles.icon} />
                  <div>
                    <h3>Global Network</h3>
                    <p>Available in 100+ countries</p>
                  </div>
                </div>
              </div>

              <div className={styles.socialLinks}>
                <a href="#" aria-label="Twitter"><Twitter size={24} /></a>
                <a href="#" aria-label="Discord"><MessageCircle size={24} /></a>
                <a href="#" aria-label="Website"><Globe size={24} /></a>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formContainer}>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <h3>Send us a Message</h3>
                
                <div className={styles.formGroup}>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <textarea 
                    placeholder="Your Message" 
                    rows={6} 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                
                {submitStatus && <p className={styles.submitStatus}>{submitStatus}</p>}
                
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Gaming?</h2>
            <p>Join thousands of players earning crypto rewards in the Cryptoverse</p>
            <a href="https://cryptoverse.games" target="_blank" className={styles.ctaBtn}>Start Playing Now</a>
          </div>
          <GameModels type="gamepad" className={styles.ctaModel} />
        </section>
      </div>
    </div>
  );
}