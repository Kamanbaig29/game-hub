import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../assets/navbar.module.css';

const tickerItems = [
  "Play hard. Win harder.",
  "Lag is the real enemy.",
  "Born to play. Built to win.",
  "One more level… always.",
  "Gamers don’t quit, we respawn.",
  "Compete in Daily Tournaments"
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate ticker every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="/logo.png" alt="Cryptoverse" />
      </Link>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
        <Link to="/arena" className={styles.navLink}>Arena</Link>
        <Link to="/about" className={styles.navLink}>About</Link>
        <Link to="https://contact.cryptoverse.games" className={styles.navLink} target="_blank" rel="noopener">
          Contact
        </Link>
        <Link to="/privacy" className={styles.navLink}>Privacy Policy</Link>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.newsTicker}>
          <div className={styles.tickerWrapper}>
            {tickerItems.map((item, index) => (
              <div
                key={index}
                className={`${styles.tickerLine} ${index === currentIndex ? styles.active : ''}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hamburger Menu */}
      <button
        className={styles.hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}