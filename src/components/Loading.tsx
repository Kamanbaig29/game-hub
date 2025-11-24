// src/components/Loading.tsx
import { PacmanLoader } from 'react-spinners';
import styles from '../assets/Loading.module.css';

interface LoadingProps {
  loading?: boolean;
  size?: number | string;
  color?: string;
}

export default function Loading({ loading = true, size = 20, color = '#9945ff' }: LoadingProps) {
  if (!loading) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContainer}>
        <PacmanLoader
          color={color}
          loading={loading}
          size={size}
          margin={2}
          speedMultiplier={1}
        />
      </div>
    </div>
  );
}

