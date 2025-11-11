// src/components/Home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/home.module.css';

interface Game {
  _id: string;
  title: string;
  iconPath: string;
  description: string;
  zipFilePath: string;
  isActive: boolean;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveGames();
  }, []);

  const fetchActiveGames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`);
      if (response.ok) {
        const data = await response.json();
        setGames(data.filter((game: Game) => game.isActive));
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>GAME HUB</h1>
        <p className={styles.subtitle}>Play the best WebGL games instantly</p>
      </header>

      <div className={styles.grid}>
        {loading ? (
          <div className={styles.loading}>Loading games...</div>
        ) : games.length === 0 ? (
          <div className={styles.noGames}>No games available yet.</div>
        ) : (
          games.map(game => (
            <Link key={game._id} to={`/game/${game._id}`} className={styles.cardLink}>
              <div className={styles.card}>
                <img 
                  src={`${import.meta.env.VITE_BASE_API_URL}/${game.iconPath.replace(/\\/g, '/')}`} 
                  alt={game.title} 
                  className={styles.icon} 
                />
                <h3 className={styles.gameTitle}>{game.title}</h3>
                <p className={styles.description}>{game.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}