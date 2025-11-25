import { useState, useEffect, useRef } from 'react';
import GameModels from "./GameModels";
import GameCard from "./GameCard";
import SectionHeader from "./SectionHeader";
import Loading from "./Loading";
import styles from '../assets/about.module.css';

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface Game {
  _id: string;
  slug?: string;
  title: string;
  iconPath: string;
  description: string;
  categories: Category[];
  isActive: boolean;
  uploadDate?: string | Date;
}

interface FeatureGame {
  _id: string;
  gameId: Game;
  tagId: Tag | null;
  position: number;
}

interface ComingSoon {
  _id: string;
  name: string;
  description?: string;
  iconPath: string;
}

export default function Library() {
  const [games, setGames] = useState<Game[]>([]);
  const [featureGames, setFeatureGames] = useState<FeatureGame[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comingSoonGames, setComingSoonGames] = useState<ComingSoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComingSoon, setSelectedComingSoon] = useState<ComingSoon | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, featureRes, categoriesRes, comingSoonRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`),
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/feature-games/active`),
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/categories/active`),
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/coming-soon/active`)
        ]);

        if (gamesRes.ok) {
          const data = await gamesRes.json();
          const activeGames = data.filter((g: Game) => g.isActive);
          // Sort by uploadDate (newest first)
          activeGames.sort((a: Game, b: Game) => {
            const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
            const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
            return dateB - dateA; // Descending order (newest first)
          });
          setGames(activeGames);
        }
        if (featureRes.ok) setFeatureGames(await featureRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
        if (comingSoonRes.ok) setComingSoonGames(await comingSoonRes.json());

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to check if a category has active games (sorted by newest first)
  const getGamesByCategory = (categoryId: string) => {
    return games
      .filter(game =>
        game.categories.some(cat => cat._id === categoryId)
      )
      .sort((a, b) => {
        const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0;
        const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });
  };

  const activeCategories = categories.filter(cat => getGamesByCategory(cat._id).length > 0);

  const handleComingSoonClick = (game: ComingSoon) => {
    setSelectedComingSoon(game);
  };

  const closeModal = () => {
    setSelectedComingSoon(null);
  };

  return (
    <>
      <Loading loading={loading} />
      {!loading && (
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

          <div ref={containerRef} className={styles.container}>
            {/* 1. Featured Games Section */}
            {featureGames.length > 0 && (
              <section className={styles.featuresSection}>
                <SectionHeader
                  title="Featured Games"
                  subtitle="Hand-picked highlights just for you"
                />
                <div className={styles.grid}>
                  {featureGames.map(fg => (
                    <GameCard
                      key={fg._id}
                      game={fg.gameId}
                      badge={fg.tagId ? { text: fg.tagId.name, color: fg.tagId.color } : undefined}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2. Categories Section */}
            {activeCategories.length > 0 && (
              <section className={styles.featuresSection}>
                <SectionHeader
                  title="Browse by Category"
                  subtitle="Find your favorite genre"
                />
                {activeCategories.map(category => (
                  <div key={category._id} className={styles.categorySection}>
                    <h3 className={styles.categoryTitle}>{category.name}</h3>
                    <div className={styles.categoryGrid}>
                      {getGamesByCategory(category._id).map(game => (
                        <GameCard key={game._id} game={game} />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* 3. All Games Section */}
            <section className={styles.featuresSection}>
              <SectionHeader
                title="All Games"
                subtitle="Explore our complete collection"
              />
              <div className={styles.grid}>
                {games.map(game => (
                  <GameCard key={game._id} game={game} />
                ))}
              </div>
            </section>

            {/* 4. Coming Soon Section */}
            {comingSoonGames.length > 0 && (
              <section className={styles.featuresSection}>
                <SectionHeader
                  title="Coming Soon"
                  subtitle="Get ready for these upcoming titles"
                />
                <div className={styles.grid}>
                  {comingSoonGames.map(game => (
                    <div
                      key={game._id}
                      onClick={() => handleComingSoonClick(game)}
                      style={{ cursor: 'pointer' }}
                    >
                      <GameCard
                        game={game as unknown as Game} // Casting because GameCard expects Game interface but we only use icon/title here
                        isComingSoon={true}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {selectedComingSoon && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 20, 80, 0.95) 100%)',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '20px',
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              maxWidth: '350px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(147, 51, 234, 0.5)',
              position: 'relative',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 68, 68, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ×
            </button>

            {/* Game Icon */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <img
                src={`${import.meta.env.VITE_BASE_API_URL}/${selectedComingSoon.iconPath.replace(/\\/g, '/')}`}
                alt={selectedComingSoon.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(147, 51, 234, 0.4)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.5rem'
                }}
              />
            </div>

            {/* Game Name */}
            <h2
              style={{
                color: '#e879f9',
                fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                fontWeight: '700',
                margin: '0 0 0.75rem 0',
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(232, 121, 249, 0.5)'
              }}
            >
              {selectedComingSoon.name}
            </h2>

            {/* Coming Soon Badge */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: '1rem'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                  color: '#fff',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}
              >
                Coming Soon
              </span>
            </div>

            {/* Description */}
            {selectedComingSoon.description && selectedComingSoon.description.trim() && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '0.75rem'
                }}
              >
                <h3
                  style={{
                    color: '#fff',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    fontWeight: '600',
                    margin: '0 0 0.5rem 0'
                  }}
                >
                  About This Game
                </h3>
                <p
                  style={{
                    color: '#e2e8f0',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    lineHeight: '1.5',
                    margin: 0,
                    maxHeight: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {selectedComingSoon.description}
                </p>
              </div>
            )}

            {!selectedComingSoon.description && (
              <p
                style={{
                  color: '#b0b0b0',
                  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  marginTop: '0.75rem'
                }}
              >
                More details coming soon!
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}