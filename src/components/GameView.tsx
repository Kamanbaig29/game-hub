// src/components/GameView.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GameModels from './GameModels';
import GameCard from './GameCard';
import styles from '../assets/about.module.css';

interface Category {
  _id: string;
  name: string;
}

interface Game {
  _id: string;
  slug: string;
  title: string;
  description: string;
  iconPath: string;
  zipFilePath: string;
  isActive: boolean;
  categories?: Category[];
}

export default function GameView() {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      if (!slug) return;
      
      // Fetch both the current game and all games
      const [gameResponse, allGamesResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games/${slug}`),
        fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`)
      ]);

      if (gameResponse.ok) {
        const foundGame = await gameResponse.json();
        if (foundGame.isActive) {
          setGame(foundGame);
        } else {
          setGame(null);
        }
      } else {
        setGame(null);
      }

      if (allGamesResponse.ok) {
        const games = await allGamesResponse.json();
        // Filter out current game and show only active games
        const filteredGames = games.filter((g: Game) => 
          g.isActive && g.slug !== slug
        );
        setAllGames(filteredGames);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setGame(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.aboutPage}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>Loading game...</h1>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className={styles.aboutPage}>
        <div className={styles.container}>
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.title}>Game Not Found</h1>
              <p className={styles.subtitle}>The game you're looking for doesn't exist or is no longer available.</p>
              <Link to="/" style={{
                display: 'inline-block',
                marginTop: '2rem',
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #9945ff, #14f195)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>Back to Library</Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

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
        {/* Back Button */}
        <div style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(153, 69, 255, 0.3)',
            borderRadius: '12px',
            color: '#e2e8f0',
            textDecoration: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>← Back to Library</Link>
        </div>

        {/* Game Section */}
        <section className={styles.featuresSection} style={{ paddingTop: "0", paddingBottom: "40px" }}>
          <div className={styles.gameViewContainer}>
            {/* Main Content Area */}
            <div className={styles.gameMainContent}>
              {/* Game Screen */}
              <div className={styles.gameScreen}>
                <iframe
                  src={`${import.meta.env.VITE_BASE_API_URL}/${game.zipFilePath.replace(/\\/g, '/')}/index.html`}
                  title={game.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                  allow="fullscreen"
                  loading="lazy"
                />
              </div>
              
              {/* Game Info Below Screen */}
              <div className={styles.gameInfo}>
                <h1 className={styles.gameTitle}>{game.title}</h1>
                <p className={styles.gameDescription}>{game.description}</p>
              </div>
            </div>

            {/* Sidebar - All Games */}
            <div className={styles.gamesSidebar}>
              <h3 className={styles.sidebarTitle}>More Games</h3>
              <div className={styles.sidebarGrid}>
                {allGames.slice(0, 12).map(gameItem => (
                  <GameCard
                    key={gameItem._id}
                    game={gameItem}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}