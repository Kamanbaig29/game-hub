// src/components/GameView.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../assets/gameView.module.css';

interface Game {
  _id: string;
  title: string;
  description: string;
  iconPath: string;
  zipFilePath: string;
  isActive: boolean;
}

export default function GameView() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const comingSoonGames = [
    'basket-ball-physics.png', 'Block-Sort-Puzzle.png', 'DIY-popit.png', 'Draw-To-Save.png',
    'drunken-wrestler.png', 'Fish-Eat-Fish.png', 'little-right-organizer.png', 'Magnet-world.png',
    'Nut&bolt.png', 'pc-simulator.png', 'Pixel-Art-Book.png', 'Princes-Room-Cleanup.png',
    'Robo-Sumo-Wrestler.png', 'Tap-Away-3D.png', 'Traffic-jam.png', 'tug-the-table.png', 'world-builder.png'
  ];

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`);
      if (response.ok) {
        const games = await response.json();
        const foundGame = games.find((g: Game) => g._id === id && g.isActive);
        setGame(foundGame || null);
      }
    } catch (error) {
      console.error('Failed to fetch game:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <h2>Loading game...</h2>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={styles.notFound}>
        <h2>Game Not Found</h2>
        <Link to="/" className={styles.backBtn}>Back to Games</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.homeBtn}>← Home</Link>
      
      <div className={styles.container}>
        {/* ---- LEFT SECTION (Game Screen + Info) ---- */}
        <div className={styles.leftSection}>
          {/* Game Screen */}
          <div className={styles.gameScreen}>
            <iframe
              src={`${import.meta.env.VITE_BASE_API_URL}/${game.zipFilePath.replace(/\\/g, '/')}/index.html`}
              title={game.title}
              className={styles.iframe}
              allow="fullscreen"
              loading="lazy"
            />
            <div className={styles.placeholder}>Game Screen (16:9)</div>
          </div>
          
          {/* Game Info */}
          <div className={styles.gameInfo}>
            <h1 className={styles.gameTitle}>{game.title}</h1>
            <p className={styles.gameDescription}>{game.description}</p>
          </div>
        </div>

        {/* ---- SIDEBAR (Coming Soon) ---- */}
        <div className={styles.sidebar}>
          <h3 className={styles.sidebarTitle}>Coming Soon</h3>
          <div className={styles.comingSoonGrid}>
            {comingSoonGames.map((icon, idx) => (
              <div key={idx} className={styles.comingSoonCard}>
                <div className={styles.iconWrapper}>
                  <img 
                    src={`/icons-coming-soon/${icon}`} 
                    alt="Coming Soon" 
                    className={styles.comingSoonIcon} 
                  />
                </div>
                <div className={styles.comingSoonOverlay}>
                  <span className={styles.comingSoonText}>Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}