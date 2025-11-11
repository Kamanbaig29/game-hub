// src/components/AdminUpload.tsx
import { useState } from 'react';
import styles from '../assets/AdminUpload.module.css';

interface GameData {
  title: string;
  description: string;
  icon: File | null;
  zipFile: File | null;
}

export default function AdminUpload() {
  const [gameData, setGameData] = useState<GameData>({
    title: '', description: '', icon: null, zipFile: null,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const isFormValid = gameData.title.trim() !== '' && gameData.description.trim() !== '' && gameData.icon !== null && gameData.zipFile !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', gameData.title);
      formData.append('description', gameData.description);
      formData.append('icon', gameData.icon!);
      formData.append('zipFile', gameData.zipFile!);

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage({ text: 'Game uploaded successfully!', type: 'success' });
        setGameData({ title: '', description: '', icon: null, zipFile: null });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setMessage({ text: 'Failed to upload game. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Upload New Game</h2>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Game Title:</label>
            <input
              type="text"
              value={gameData.title}
              onChange={e => setGameData({ ...gameData, title: e.target.value })}
              required
              className={styles.input}
              placeholder="Enter an awesome game title..."
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Description:</label>
            <textarea
              value={gameData.description}
              onChange={e => setGameData({ ...gameData, description: e.target.value })}
              required
              rows={4}
              className={styles.textarea}
              placeholder="Describe your amazing game..."
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Game Icon:</label>
            <div className={styles.fileWrapper}>
              <input
                type="file"
                accept="image/*"
                onChange={e => setGameData({ ...gameData, icon: e.target.files?.[0] || null })}
                required
                className={styles.fileInput}
                id="icon"
              />
              <label htmlFor="icon" className={styles.fileLabel}>
                {gameData.icon?.name || 'Choose file'}
              </label>
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Unity WebGL Build (.zip):</label>
            <div className={styles.fileWrapper}>
              <input
                type="file"
                accept=".zip,application/zip"
                onChange={e => setGameData({ ...gameData, zipFile: e.target.files?.[0] || null })}
                required
                className={styles.fileInput}
                id="zip"
              />
              <label htmlFor="zip" className={styles.fileLabel}>
                {gameData.zipFile?.name || 'Choose file'}
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={!isFormValid || isUploading}>
            {isUploading ? 'Uploading...' : 'Launch Game to Hub!'}
          </button>
        </form>
      </div>
    </div>
  );
}