import { Link } from 'react-router-dom';
import styles from '../assets/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo}>
            <img src="/logo.png" alt="Game Hub" />
          </Link>
          <p className={styles.copyright}>© 2025 Game Hub. All rights reserved.</p>
        </div>
        
        <div className={styles.links}>
          <Link to="/about" className={styles.link}>About</Link>
          <a href="https://contact.cryptoverse.games" className={styles.link}>Contact</a>
          <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}