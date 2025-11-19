// admin/src/components/AdminFeatureGames.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface Game {
  _id: string;
  title: string;
  iconPath: string;
  isActive: boolean;
}

interface FeatureGame {
  _id: string;
  gameId: Game;
  tag: 'hot' | 'new' | 'trending' | 'updated';
  position: number;
}

export default function AdminFeatureGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [featureGames, setFeatureGames] = useState<(FeatureGame | null)[]>(Array(6).fill(null));
  const [loading, setLoading] = useState(true);
  const [editingTile, setEditingTile] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ gameId: string; tag: 'hot' | 'new' | 'trending' | 'updated' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchFeatureGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data.filter((game: Game) => game.isActive));
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const fetchFeatureGames = async () => {
    try {
      const response = await fetch('/api/feature-games');
      if (response.ok) {
        const data = await response.json();
        // Create array with 6 positions, fill with existing feature games
        const featureGamesMap = new Map<number, FeatureGame>();
        data.forEach((fg: FeatureGame) => {
          featureGamesMap.set(fg.position, fg);
        });
        const featureGamesArray: (FeatureGame | null)[] = Array.from({ length: 6 }, (_, i) => {
          const position = i + 1;
          return featureGamesMap.get(position) || null;
        });
        setFeatureGames(featureGamesArray);
      }
    } catch (error) {
      console.error('Failed to fetch feature games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (position: number) => {
    const existingFeature = featureGames[position - 1];
    if (existingFeature) {
      setEditForm({
        gameId: existingFeature.gameId._id,
        tag: existingFeature.tag
      });
    } else {
      setEditForm({
        gameId: games.length > 0 ? games[0]._id : '',
        tag: 'new'
      });
    }
    setEditingTile(position);
  };

  const handleSave = async (position: number) => {
    if (!editForm || !editForm.gameId) {
      alert('Please select a game');
      return;
    }

    try {
      const existingFeature = featureGames[position - 1];
      const url = existingFeature 
        ? `/api/feature-games/${existingFeature._id}`
        : '/api/feature-games';
      
      const method = existingFeature ? 'PUT' : 'POST';
      const body = existingFeature
        ? { gameId: editForm.gameId, tag: editForm.tag, position }
        : { ...editForm, position };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchFeatureGames();
        setEditingTile(null);
        setEditForm(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save feature game');
      }
    } catch (error) {
      console.error('Failed to save feature game:', error);
      alert('Failed to save feature game');
    }
  };

  const handleDelete = async (position: number) => {
    const existingFeature = featureGames[position - 1];
    if (!existingFeature) return;

    if (!confirm(`Are you sure you want to delete the feature game at position ${position}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/feature-games/${existingFeature._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchFeatureGames();
      } else {
        alert('Failed to delete feature game');
      }
    } catch (error) {
      console.error('Failed to delete feature game:', error);
      alert('Failed to delete feature game');
    }
  };

  const handleCancel = () => {
    setEditingTile(null);
    setEditForm(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'hot': return '#ff4444';
      case 'new': return '#44ff44';
      case 'trending': return '#4444ff';
      case 'updated': return '#ffaa00';
      default: return '#999';
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Feature Games</h2>
        <div className={styles.headerActions}>
          <Link to="/" className={styles.uploadBtn}>
            Dashboard
          </Link>
          <Link to="/upload" className={styles.uploadBtn}>
            Upload Game
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(153, 69, 255, 0.1)', borderRadius: '8px' }}>
        <p style={{ color: '#b0b0b0', margin: 0 }}>
          Manage the 6 featured games displayed on the homepage. Each tile can be assigned a game and a tag (Hot, New, or Trending).
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>Loading feature games...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {Array.from({ length: 6 }, (_, i) => {
            const position = i + 1;
            const featureGame = featureGames[position - 1];
            const isEditing = editingTile === position;

            return (
              <div 
                key={position} 
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(153, 69, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  position: 'relative'
                }}
              >
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#b0b0b0' }}>
                  Position {position}
                </div>

                {isEditing ? (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                        Select Game:
                      </label>
                      <select
                        value={editForm?.gameId || ''}
                        onChange={(e) => setEditForm({ ...editForm!, gameId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(153, 69, 255, 0.5)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.9rem'
                        }}
                      >
                        <option value="">-- Select Game --</option>
                        {games.map(game => (
                          <option key={game._id} value={game._id}>
                            {game.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                        Select Tag:
                      </label>
                      <select
                        value={editForm?.tag || 'new'}
                        onChange={(e) => setEditForm({ ...editForm!, tag: e.target.value as 'hot' | 'new' | 'trending' | 'updated' })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(153, 69, 255, 0.5)',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.9rem'
                        }}
                      >
                        <option value="hot">Hot</option>
                        <option value="new">New</option>
                        <option value="trending">Trending</option>
                        <option value="updated">Updated</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleSave(position)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'linear-gradient(135deg, #14f195, #9945ff)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {featureGame ? (
                      <>
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                          <img
                            src={`/${featureGame.gameId.iconPath.replace(/\\/g, '/')}`}
                            alt={featureGame.gameId.title}
                            style={{
                              width: '100%',
                              aspectRatio: '1',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              background: 'rgba(0, 0, 0, 0.2)',
                              padding: '0.5rem'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                          <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>
                            {featureGame.gameId.title}
                          </h3>
                        </div>
                        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              background: getTagColor(featureGame.tag),
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}
                          >
                            {featureGame.tag}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEdit(position)}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              background: 'rgba(153, 69, 255, 0.3)',
                              border: '1px solid rgba(153, 69, 255, 0.5)',
                              borderRadius: '6px',
                              color: '#fff',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(position)}
                            style={{
                              flex: 1,
                              padding: '0.5rem',
                              background: 'rgba(255, 68, 68, 0.3)',
                              border: '1px solid rgba(255, 68, 68, 0.5)',
                              borderRadius: '6px',
                              color: '#fff',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ 
                          marginBottom: '1rem', 
                          textAlign: 'center',
                          padding: '2rem 1rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderRadius: '8px',
                          color: '#666'
                        }}>
                          No game assigned
                        </div>
                        <button
                          onClick={() => handleEdit(position)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: 'rgba(153, 69, 255, 0.3)',
                            border: '1px solid rgba(153, 69, 255, 0.5)',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          Add Game
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

