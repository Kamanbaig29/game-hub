// src/components/GameView.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import GameModels from './GameModels';
import styles from '../assets/about.module.css';

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
        {/* Hero Section */}
        <section className={styles.hero} style={{ minHeight: "auto", paddingTop: "120px", paddingBottom: "40px" }}>
          <div className={styles.heroContent}>
            <Link to="/" style={{
              display: 'inline-block',
              marginBottom: '2rem',
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
            <h1 className={styles.title}>{game.title}</h1>
            <p className={styles.subtitle}>{game.description}</p>
          </div>
        </section>

        {/* Game Section */}
        <section className={styles.featuresSection} style={{ paddingTop: "0" }}>
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            {/* Game Screen */}
            <div style={{
              flex: '1',
              minWidth: 'min(100%, 800px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(153, 69, 255, 0.3)',
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.3)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}>
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
            </div>

            {/* Sidebar - Coming Soon */}
            <div style={{
              width: '280px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(153, 69, 255, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 300px)',
              overflowY: 'auto'
            }}>
              <h3 style={{
                color: '#14f195',
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: '0 0 1.5rem 0',
                textAlign: 'center'
              }}>Coming Soon</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem'
              }}>
                {comingSoonGames.map((icon, idx) => (
                  <div key={idx} style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    border: '1px solid rgba(153, 69, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img 
                      src={`/icons-coming-soon/${icon}`} 
                      alt="Coming Soon" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: '0',
                      background: 'rgba(0, 0, 0, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: '0',
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <span style={{
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>Coming Soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}