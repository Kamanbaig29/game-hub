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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchGame();
  }, [id]);

  // FIX: Force Unity resize after load
  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) {
      // Send resize message to Unity
      const iframe = iframeRef.current;
      setTimeout(() => {
        iframe.contentWindow?.postMessage(
          { type: 'unityResize', width: iframe.offsetWidth, height: iframe.offsetHeight },
          '*'
        );
      }, 500);

      // Resize observer for dynamic viewport changes
      const resizeObserver = new ResizeObserver(() => {
        iframe.contentWindow?.postMessage(
          { type: 'unityResize', width: iframe.offsetWidth, height: iframe.offsetHeight },
          '*'
        );
      });
      resizeObserver.observe(iframe);
    }
  }, []);

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
      <div className={styles.container}>
        <div className={styles.playerWrapper}>
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

        <div className={styles.info}>
          <h1 className={styles.title}>{game.title}</h1>
          <p className={styles.description}>{game.description}</p>
          <Link to="/" className={styles.backBtn}>Back to Games</Link>
        </div>
      </div>
    </div>
  );
}