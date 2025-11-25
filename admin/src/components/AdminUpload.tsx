// src/components/AdminUpload.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/AdminUpload.module.css';

interface Category {
  _id: string;
  name: string;
}

interface GameData {
  title: string;
  description: string;
  icon: File | null;
  zipFile: File | null;
  categories: string[];
  orientation: 'landscape' | 'portrait';
}

export default function AdminUpload() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [gameData, setGameData] = useState<GameData>({
    title: '', description: '', icon: null, zipFile: null, categories: [], orientation: 'landscape',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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
      formData.append('orientation', gameData.orientation);
      // Append categories as comma-separated string
      if (gameData.categories.length > 0) {
        formData.append('categories', gameData.categories.join(','));
      }

      const response = await fetch('/api/games', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage({ text: 'Game uploaded successfully!', type: 'success' });
        setGameData({ title: '', description: '', icon: null, zipFile: null, categories: [], orientation: 'landscape' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
    } catch (error: any) {
      setMessage({ 
        text: error.message || 'Failed to upload game. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.topBackBtn}>← Back</Link>
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

          <div className={styles.group}>
            <label className={styles.label}>Game Orientation:</label>
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.75rem 1.5rem',
                  background: gameData.orientation === 'landscape' 
                    ? 'rgba(168, 85, 247, 0.3)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${gameData.orientation === 'landscape' 
                    ? 'rgba(168, 85, 247, 0.5)' 
                    : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name="orientation"
                  value="landscape"
                  checked={gameData.orientation === 'landscape'}
                  onChange={e => setGameData({ ...gameData, orientation: e.target.value as 'landscape' | 'portrait' })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: '#fff', fontSize: '0.9rem' }}>Landscape (1920×1080)</span>
              </label>
              <label 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.75rem 1.5rem',
                  background: gameData.orientation === 'portrait' 
                    ? 'rgba(168, 85, 247, 0.3)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${gameData.orientation === 'portrait' 
                    ? 'rgba(168, 85, 247, 0.5)' 
                    : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name="orientation"
                  value="portrait"
                  checked={gameData.orientation === 'portrait'}
                  onChange={e => setGameData({ ...gameData, orientation: e.target.value as 'landscape' | 'portrait' })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: '#fff', fontSize: '0.9rem' }}>Portrait (1080×1920)</span>
              </label>
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Categories (Select multiple):</label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              {categories.map(category => (
                <label 
                  key={category._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    background: gameData.categories.includes(category._id) 
                      ? 'rgba(168, 85, 247, 0.3)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${gameData.categories.includes(category._id) 
                      ? 'rgba(168, 85, 247, 0.5)' 
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={gameData.categories.includes(category._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setGameData({
                          ...gameData,
                          categories: [...gameData.categories, category._id]
                        });
                      } else {
                        setGameData({
                          ...gameData,
                          categories: gameData.categories.filter(id => id !== category._id)
                        });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#fff', fontSize: '0.9rem' }}>{category.name}</span>
                </label>
              ))}
            </div>
            {categories.length === 0 && (
              <p style={{ color: '#b0b0b0', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                No categories available. <Link to="/categories" style={{ color: '#a855f7' }}>Create categories first</Link>
              </p>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={!isFormValid || isUploading}>
            {isUploading ? 'Uploading...' : 'Launch Game to Hub!'}
          </button>
        </form>
      </div>
    </div>
  );
}