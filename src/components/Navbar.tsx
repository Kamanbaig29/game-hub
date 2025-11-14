import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from '../assets/navbar.module.css';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="/logo.png" alt="Game Hub" />
      </Link>
      
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </nav>
  );
}