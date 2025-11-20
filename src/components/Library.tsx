import { useState, useEffect, useRef } from 'react';
import GameModels from "./GameModels";
import GameCard from "./GameCard";
import SectionHeader from "./SectionHeader";
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
  title: string;
  iconPath: string;
  description: string;
  categories: Category[];
  isActive: boolean;
}

interface FeatureGame {
  _id: string;
  gameId: Game;
  tagId: Tag;
  position: number;
}

interface ComingSoon {
  _id: string;
  name: string;
  iconPath: string;
}

export default function Library() {
  const [games, setGames] = useState<Game[]>([]);
  const [featureGames, setFeatureGames] = useState<FeatureGame[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comingSoonGames, setComingSoonGames] = useState<ComingSoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const featureScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const featureContainerRef = useRef<HTMLDivElement>(null);

  // Adjust container width based on sidebar state
  useEffect(() => {
    const updateContainerWidth = () => {
      const sidebar = document.querySelector('nav[class*="fixed"]') as HTMLElement;
      const contentArea = document.querySelector('div[style*="marginLeft"]') as HTMLElement;
      
      if (sidebar && contentArea) {
        const sidebarWidth = sidebar.offsetWidth;
        const viewportWidth = window.innerWidth;
        // Calculate available width: viewport - sidebar - container padding
        const containerPadding = 40; // 20px on each side of container
        const availableWidth = viewportWidth - sidebarWidth - containerPadding;
        const maxWidth = Math.min(1200, Math.max(300, availableWidth)); // Ensure minimum width
        
        // Update main container
        if (containerRef.current) {
          containerRef.current.style.maxWidth = `${maxWidth}px`;
          containerRef.current.style.width = '100%';
        }
        
        // Update feature container to use FULL viewport width (minus sidebar)
        if (featureContainerRef.current && containerRef.current) {
          // Get the content area to calculate proper width
          const contentAreaRect = contentArea.getBoundingClientRect();
          // Use content area width directly (it already accounts for sidebar)
          const fullAvailableWidth = contentAreaRect.width;
          
          // Calculate left offset to align with content area start
          const contentAreaLeft = contentAreaRect.left;
          const containerRect = containerRef.current.getBoundingClientRect();
          const containerLeft = containerRect.left;
          const offset = containerLeft - contentAreaLeft;
          
          featureContainerRef.current.style.position = 'relative';
          featureContainerRef.current.style.maxWidth = `${fullAvailableWidth}px`;
          featureContainerRef.current.style.width = `${fullAvailableWidth}px`;
          featureContainerRef.current.style.boxSizing = 'border-box';
          
          // Position it to start from content area's left edge
          featureContainerRef.current.style.marginLeft = `-${offset}px`;
        }
        
        // Ensure the grid can scroll properly
        if (featureScrollRef.current) {
          // Force a reflow to ensure scroll calculation is correct
          setTimeout(() => {
            if (featureScrollRef.current) {
              // Ensure overflow is set to auto for scrolling
              featureScrollRef.current.style.overflowX = 'auto';
              // Force browser to recalculate scroll width
              featureScrollRef.current.style.display = 'flex';
            }
          }, 150);
        }
      }
    };

    // Initial update with a small delay to ensure DOM is ready
    const initialTimeout = setTimeout(updateContainerWidth, 100);

    // Update on resize
    window.addEventListener('resize', updateContainerWidth);
    
    // Use MutationObserver to watch for sidebar width changes
    const observer = new MutationObserver(() => {
      // Small delay to ensure layout has updated
      setTimeout(updateContainerWidth, 50);
    });
    
    const sidebar = document.querySelector('nav[class*="fixed"]');
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['style']
      });
    }

    // Also observe the main content area margin changes
    const contentArea = document.querySelector('div[style*="marginLeft"]');
    if (contentArea) {
      observer.observe(contentArea, {
        attributes: true,
        attributeFilter: ['style']
      });
    }

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', updateContainerWidth);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, featureRes, categoriesRes, comingSoonRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`),
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/feature-games/active`),
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/categories`),
          fetch(`${import.meta.env.VITE_BASE_API_URL}/api/coming-soon`)
        ]);

        if (gamesRes.ok) {
          const data = await gamesRes.json();
          setGames(data.filter((g: Game) => g.isActive));
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

  // Helper to check if a category has active games
  const getGamesByCategory = (categoryId: string) => {
    return games.filter(game =>
      game.categories.some(cat => cat._id === categoryId)
    );
  };

  const activeCategories = categories.filter(cat => getGamesByCategory(cat._id).length > 0);

  const scrollFeatureLeft = () => {
    if (featureScrollRef.current) {
      featureScrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollFeatureRight = () => {
    if (featureScrollRef.current) {
      featureScrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Handle hover-based arrow visibility
  useEffect(() => {
    const container = featureContainerRef.current;
    if (!container) return;

    let hoverTimeout: number | undefined;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      // Calculate mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const containerWidth = rect.width;
      
      // Don't proceed if container has no width
      if (containerWidth <= 0) return;
      
      // Define threshold zones - wider zones for better UX
      const leftThreshold = containerWidth * 0.2; // Show left arrow in left 20% of container
      const rightThreshold = containerWidth * 0.8; // Show right arrow in right 20% of container

      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = undefined;
      }

      // Check if mouse is within container bounds
      if (mouseX >= 0 && mouseX <= containerWidth) {
        // Check if mouse is in left zone
        if (mouseX < leftThreshold) {
          setShowLeftArrow(true);
          setShowRightArrow(false);
        } 
        // Check if mouse is in right zone
        else if (mouseX > rightThreshold) {
          setShowLeftArrow(false);
          setShowRightArrow(true);
        }
        // Middle zone - hide both arrows
        else {
          setShowLeftArrow(false);
          setShowRightArrow(false);
        }
      }
    };

    const handleMouseLeave = () => {
      // Clear any existing timeout
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      // Small delay before hiding to prevent flickering
      hoverTimeout = window.setTimeout(() => {
        setShowLeftArrow(false);
        setShowRightArrow(false);
        hoverTimeout = undefined;
      }, 200);
    };

    const handleMouseEnter = () => {
      // Clear any pending hide timeout when entering
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = undefined;
      }
    };

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [featureGames]); // Re-run when feature games change

  // Ensure arrows stay within viewport when sidebar state changes
  useEffect(() => {
    const ensureArrowsVisible = () => {
      if (!featureContainerRef.current || !containerRef.current) return;

      const sidebar = document.querySelector('nav[class*="fixed"]') as HTMLElement;
      const contentArea = document.querySelector('div[style*="marginLeft"]') as HTMLElement;
      
      if (!sidebar || !contentArea) return;

      const container = featureContainerRef.current;
      const viewportWidth = window.innerWidth;
      const contentAreaRect = contentArea.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Use content area width directly (it already accounts for sidebar)
      const fullAvailableWidth = contentAreaRect.width;
      
      // Calculate left offset to position correctly relative to content area
      const contentAreaLeft = contentAreaRect.left;
      const containerLeft = containerRect.left;
      const leftOffset = containerLeft - contentAreaLeft;
      
      // Update container to use full width and position correctly
      container.style.maxWidth = `${fullAvailableWidth}px`;
      container.style.width = `${fullAvailableWidth}px`;
      container.style.marginLeft = `-${leftOffset}px`;
      
      // Verify it doesn't overflow viewport
      const finalRight = contentAreaLeft + fullAvailableWidth;
      if (finalRight > viewportWidth - 2) {
        const overflow = finalRight - viewportWidth + 2;
        const adjustedWidth = Math.max(300, fullAvailableWidth - overflow);
        container.style.maxWidth = `${adjustedWidth}px`;
        container.style.width = `${adjustedWidth}px`;
      }
    };

    // Initial check
    const initialTimeout = setTimeout(ensureArrowsVisible, 300);

    // Update on resize
    window.addEventListener('resize', ensureArrowsVisible);
    
    // Watch for container and scroll area changes
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(ensureArrowsVisible, 100);
    });
    
    if (featureContainerRef.current) {
      resizeObserver.observe(featureContainerRef.current);
    }

    if (featureScrollRef.current) {
      resizeObserver.observe(featureScrollRef.current);
    }

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', ensureArrowsVisible);
      resizeObserver.disconnect();
    };
  }, [featureGames]); // Re-run when feature games change

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

      <div ref={containerRef} className={styles.container}>
        {loading ? (
          <div className={styles.loading}>Loading library...</div>
        ) : (
          <>
            {/* 1. Featured Games Section */}
            {featureGames.length > 0 && (
              <section className={styles.libraryFeatureSection}>
                <SectionHeader
                  title="Featured Games"
                  subtitle="Hand-picked highlights just for you"
                />
                <div ref={featureContainerRef} className={styles.libraryFeatureContainer}>
                  <button
                    className={`${styles.scrollArrow} ${styles.scrollArrowLeft} ${showLeftArrow ? styles.visible : ''}`}
                    onClick={scrollFeatureLeft}
                    aria-label="Scroll left"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div 
                    ref={featureScrollRef}
                    className={styles.libraryFeatureGrid}
                  >
                    {featureGames.map(fg => (
                      <GameCard
                        key={fg._id}
                        game={fg.gameId}
                        badge={{ text: fg.tagId.name, color: fg.tagId.color }}
                      />
                    ))}
                  </div>
                  <button
                    className={`${styles.scrollArrow} ${styles.scrollArrowRight} ${showRightArrow ? styles.visible : ''}`}
                    onClick={scrollFeatureRight}
                    aria-label="Scroll right"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
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
          </>
        )}
      </div>
    </div>
  );
}