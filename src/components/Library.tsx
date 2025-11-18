// src/components/Library.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameModels from "./GameModels";
import styles from '../assets/about.module.css';

interface Game {
  _id: string;
  title: string;
  iconPath: string;
  description: string;
  zipFilePath: string;
  isActive: boolean;
}

export default function Library() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const comingSoonGames = [
    'basket-ball-physics.png', 'Block-Sort-Puzzle.png', 'DIY-popit.png', 'Draw-To-Save.png',
    'drunken-wrestler.png', 'Fish-Eat-Fish.png', 'little-right-organizer.png', 'Magnet-world.png',
    'Nut&bolt.png', 'pc-simulator.png', 'Pixel-Art-Book.png', 'Princes-Room-Cleanup.png',
    'Robo-Sumo-Wrestler.png', 'Tap-Away-3D.png', 'Traffic-jam.png', 'tug-the-table.png', 'world-builder.png'
  ];

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
    <div className={styles.aboutPage}>
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
        {/*<section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Game Library</h1>
            <p className={styles.subtitle}>
              Discover and play amazing games
            </p>
          </div>
        </section>*/}

        {/* Games Grid Section */}
        <section className={styles.featuresSection}>
          <div className={styles.grid}>
            {loading ? (
              <div className={styles.loading}>Loading games...</div>
            ) : (
              <>
                {games.map(game => (
                  <Link key={game._id} to={`/game/${game._id}`} className={styles.cardLink}>
                    <div className={styles.card}>
                      <div className={styles.iconWrapper}>
                        <img
                          src={`${import.meta.env.VITE_BASE_API_URL}/${game.iconPath.replace(/\\/g, '/')}`}
                          alt={game.title}
                          className={styles.icon}
                        />
                      </div>
                      <div className={styles.overlay}>
                        <h3 className={styles.gameTitle}>{game.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}

                {comingSoonGames.map((icon, idx) => (
                  <div key={`coming-soon-${idx}`} className={styles.card}>
                    <div className={styles.iconWrapper}>
                      <img
                        src={`/icons-coming-soon/${icon}`}
                        alt="Coming Soon"
                        className={styles.icon}
                      />
                    </div>
                    <div className={styles.overlay}>
                      <h3 className={styles.gameTitle}>Coming Soon</h3>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}