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

            {/* 3. Coming Soon Section */}
            {comingSoonGames.length > 0 && (
              <section className={styles.featuresSection}>
                <SectionHeader
                  title="Coming Soon"
                  subtitle="Get ready for these upcoming titles"
                />
                <div className={styles.grid}>
                  {comingSoonGames.map(game => (
                    <GameCard
                      key={game._id}
                      game={game as unknown as Game} // Casting because GameCard expects Game interface but we only use icon/title here
                      isComingSoon={true}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 4. All Games Section */}
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
          </div>
        </div>
      )}
    </>
  );
}