// src/components/GameView.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGame();
  }, [id]);

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      setTimeout(() => {
        iframe.contentWindow?.postMessage(
          { type: 'unityResize', width: dimensions.width, height: dimensions.height },
          '*'
        );
      }, 500);
    }
  }, [dimensions]);

  const handleResize = useCallback((direction: 'right' | 'bottom', e: MouseEvent) => {
    e.preventDefault();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (direction === 'right') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.max(400, Math.min(2560, startWidth + deltaX));
        setDimensions(prev => ({ ...prev, width: newWidth }));
      } else if (direction === 'bottom') {
        const deltaY = moveEvent.clientY - startY;
        const newHeight = Math.max(300, Math.min(1440, startHeight + deltaY));
        setDimensions(prev => ({ ...prev, height: newHeight }));
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          { type: 'unityResize', width: dimensions.width, height: dimensions.height },
          '*'
        );
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [dimensions]);

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
        <div 
          ref={containerRef}
          className={styles.playerWrapper}
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transform: 'none',
            position: 'relative'
          }}
        >
          <div 
            className={styles.resizeHandle}
            data-direction="right"
            onMouseDown={(e) => handleResize('right', e.nativeEvent)}
          />
          <div 
            className={styles.resizeHandle}
            data-direction="bottom"
            onMouseDown={(e) => handleResize('bottom', e.nativeEvent)}
          />
          <iframe
            ref={iframeRef}
            src={`${import.meta.env.VITE_BASE_API_URL}/${game.zipFilePath.replace(/\\/g, '/')}/index.html`}
            title={game.title}
            className={styles.iframe}
            allow="fullscreen"
            loading="lazy"
            onLoad={handleIframeLoad}
          />
        </div>

        {/* <div className={styles.info}>
          <h1 className={styles.title}>{game.title}</h1>
          <p className={styles.description}>{game.description}</p>
          <Link to="/" className={styles.backBtn}>Back to Games</Link>
        </div> */}
      </div>
    </div>
  );
}