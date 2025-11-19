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

interface Tag {
  _id: string;
  name: string;
  color: string;
}

interface FeatureGame {
  _id: string;
  gameId: Game;
  tagId: Tag;
  position: number;
}

export default function AdminFeatureGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [featureGames, setFeatureGames] = useState<(FeatureGame | null)[]>(Array(6).fill(null));
  const [loading, setLoading] = useState(true);
  const [editingTile, setEditingTile] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ gameId: string; tagId: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchTags();
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

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchFeatureGames = async () => {
    try {
      const response = await fetch('/api/feature-games');
      if (response.ok) {
        const data = await response.json();
        // Create array with 6 positions, fill with existing feature games
        // Filter out feature games with null gameId or tagId (deleted games/tags)
        const featureGamesMap = new Map<number, FeatureGame>();
        data.forEach((fg: FeatureGame) => {
          // Only include feature games that have valid gameId and tagId
          if (fg.gameId && fg.tagId) {
            featureGamesMap.set(fg.position, fg);
          }
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
        tagId: existingFeature.tagId._id
      });
    } else {
      setEditForm({
        gameId: games.length > 0 ? games[0]._id : '',
        tagId: tags.length > 0 ? tags[0]._id : ''
      });
    }
    setEditingTile(position);
  };

  const handleSave = async (position: number) => {
    if (!editForm || !editForm.gameId || !editForm.tagId) {
      alert('Please select both a game and a tag');
      return;
    }

    try {
      const existingFeature = featureGames[position - 1];
      
      // Always use POST for create/update, but include _id if updating
      const body: any = {
        gameId: editForm.gameId,
        tagId: editForm.tagId,
        position
      };
      
      // Include _id only if we're updating an existing feature game
      if (existingFeature) {
        body._id = existingFeature._id;
      }

      const response = await fetch('/api/feature-games', {
        method: 'POST',
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

  const getTagColor = (tag: Tag) => {
    return tag?.color || '#999';
  };

  const getTagName = (tag: Tag) => {
    return tag?.name || 'Unknown';
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

      <div style={{ 
        marginBottom: 'clamp(1rem, 3vw, 2rem)', 
        padding: 'clamp(0.75rem, 2vw, 1rem)', 
        background: 'rgba(153, 69, 255, 0.1)', 
        borderRadius: '8px' 
      }}>
        <p style={{ 
          color: '#b0b0b0', 
          margin: 0,
          fontSize: 'clamp(0.85rem, 2vw, 1rem)',
          lineHeight: '1.5'
        }}>
          Manage the 6 featured games displayed on the homepage. Each tile can be assigned a game and a tag (Hot, New, or Trending).
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>Loading feature games...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', 
          gap: 'clamp(1rem, 3vw, 1.5rem)',
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
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  marginBottom: '0.5rem', 
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', 
                  color: '#b0b0b0' 
                }}>
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
                        value={editForm?.tagId || ''}
                        onChange={(e) => setEditForm({ ...editForm!, tagId: e.target.value })}
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
                        <option value="">-- Select Tag --</option>
                        {tags.map(tag => (
                          <option key={tag._id} value={tag._id}>
                            {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                          </option>
                        ))}
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
                    {featureGame && featureGame.gameId && featureGame.tagId ? (
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
                              background: getTagColor(featureGame.tagId),
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              textTransform: 'uppercase'
                            }}
                          >
                            {getTagName(featureGame.tagId)}
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

