import { Link } from 'react-router-dom';
import styles from '../assets/about.module.css';

interface Category {
    _id: string;
    name: string;
}

interface Game {
    _id: string;
    slug?: string;
    title?: string;
    name?: string; // For coming soon games
    iconPath: string;
    description?: string;
    categories?: Category[];
}

interface GameCardProps {
    game: Game;
    badge?: {
        text: string;
        color: string;
    };
    isComingSoon?: boolean;
}

export default function GameCard({ game, badge, isComingSoon = false }: GameCardProps) {
    const gameTitle = game.title || game.name || 'Untitled Game';
    
    const CardContent = () => (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <img
                    src={`${import.meta.env.VITE_BASE_API_URL}/${game.iconPath.replace(/\\/g, '/')}`}
                    alt={gameTitle}
                    className={styles.icon}
                    loading="lazy"
                />
                {badge && (
                    <div
                        className={styles.badge}
                        style={{ backgroundColor: badge.color, boxShadow: `0 0 10px ${badge.color}80` }}
                    >
                        {badge.text}
                    </div>
                )}
                {isComingSoon && (
                    <div className={styles.comingSoonOverlay}>
                        <span className={styles.comingSoonTitle}>{gameTitle}</span>
                        <span className={styles.comingSoonText}>Coming Soon</span>
                    </div>
                )}
            </div>
            <div className={styles.overlay}>
                <h3 className={styles.gameTitle}>{gameTitle}</h3>
                {!isComingSoon && game.categories && game.categories.length > 0 && (
                    <div className={styles.categories}>
                        {game.categories.slice(0, 2).map((cat, index) => (
                            <span key={`${cat._id}-${index}`} className={styles.categoryTag}>{cat.name}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    if (isComingSoon) {
        return (
            <div className={styles.cardWrapper}>
                <CardContent />
            </div>
        );
    }

    return (
        <Link to={`/game/${game.slug || game._id}`} className={styles.cardLink}>
            <CardContent />
        </Link>
    );
}
