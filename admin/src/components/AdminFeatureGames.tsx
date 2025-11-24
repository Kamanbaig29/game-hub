// admin/src/components/AdminFeatureGames.tsx
import { useState, useEffect, useRef } from 'react';
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
  tagId: Tag | null;
  position: number;
}

export default function AdminFeatureGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [featureGames, setFeatureGames] = useState<FeatureGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<{ gameId: string; tagId: string; position: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; featureGame: FeatureGame | null }>({ show: false, featureGame: null });
  const [hideSection, setHideSection] = useState(false);
  const [isTogglingHide, setIsTogglingHide] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchTags();
    fetchFeatureGames();
    fetchHideSectionStatus();
  }, []);

  const fetchHideSectionStatus = async () => {
    try {
      const response = await fetch('/api/feature-games/hide-section-status');
      if (response.ok) {
        const data = await response.json();
        setHideSection(data.hideSection);
      }
    } catch (error) {
      console.error('Failed to fetch hide section status:', error);
    }
  };

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
        // Filter out feature games with null gameId (deleted games)
        // tagId can be null (None option)
        const validFeatureGames = data.filter((fg: FeatureGame) => fg.gameId);
        // Sort by position
        validFeatureGames.sort((a: FeatureGame, b: FeatureGame) => a.position - b.position);
        setFeatureGames(validFeatureGames);
      }
    } catch (error) {
      console.error('Failed to fetch feature games:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextAvailablePosition = () => {
    if (featureGames.length === 0) return 1;
    const maxPosition = Math.max(...featureGames.map(fg => fg.position));
    return maxPosition + 1;
  };

  const handleAddNew = () => {
    setEditForm({
      gameId: games.length > 0 ? games[0]._id : '',
      tagId: '', // Default to empty (None)
      position: getNextAvailablePosition()
    });
    setIsAddingNew(true);
    setEditingId(null);
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEdit = (featureGame: FeatureGame) => {
    setEditForm({
      gameId: featureGame.gameId._id,
      tagId: featureGame.tagId ? featureGame.tagId._id : '',
      position: featureGame.position
    });
    setEditingId(featureGame._id);
    setIsAddingNew(false);
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSave = async () => {
    if (!editForm || !editForm.gameId || !editForm.position) {
      alert('Please fill in game and position');
      return;
    }

    if (editForm.position < 1) {
      alert('Position must be at least 1');
      return;
    }

    try {
      const body: any = {
        gameId: editForm.gameId,
        position: editForm.position
      };
      
      // Only include tagId if it's not empty (None)
      if (editForm.tagId) {
        body.tagId = editForm.tagId;
      }
      
      // Include _id if we're updating an existing feature game
      if (editingId) {
        body._id = editingId;
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
        setEditingId(null);
        setIsAddingNew(false);
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

  const handleDeleteClick = (featureGame: FeatureGame) => {
    setDeleteConfirm({ show: true, featureGame });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.featureGame) return;

    try {
      const response = await fetch(`/api/feature-games/${deleteConfirm.featureGame._id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchFeatureGames();
        setDeleteConfirm({ show: false, featureGame: null });
      } else {
        alert('Failed to delete feature game');
        setDeleteConfirm({ show: false, featureGame: null });
      }
    } catch (error) {
      console.error('Failed to delete feature game:', error);
      alert('Failed to delete feature game');
      setDeleteConfirm({ show: false, featureGame: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, featureGame: null });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setEditForm(null);
  };

  const handleToggleHideSection = async () => {
    setIsTogglingHide(true);
    try {
      const newHideSection = !hideSection;
      const response = await fetch('/api/feature-games/toggle-hide-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hideSection: newHideSection })
      });

      if (response.ok) {
        setHideSection(newHideSection);
      } else {
        alert('Failed to toggle hide section');
      }
    } catch (error) {
      console.error('Failed to toggle hide section:', error);
      alert('Failed to toggle hide section');
    } finally {
      setIsTogglingHide(false);
    }
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
          lineHeight: '1.5',
          marginBottom: '1rem'
        }}>
          Manage featured games displayed on the homepage. Add as many feature games as you want. Each game needs a position number to determine its display order (lower numbers appear first).
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          background: featureGames.length === 0 
            ? 'rgba(128, 128, 128, 0.1)' 
            : hideSection 
              ? 'rgba(255, 68, 68, 0.1)' 
              : 'rgba(20, 241, 149, 0.1)',
          borderRadius: '6px',
          border: `1px solid ${
            featureGames.length === 0 
              ? 'rgba(128, 128, 128, 0.3)' 
              : hideSection 
                ? 'rgba(255, 68, 68, 0.3)' 
                : 'rgba(20, 241, 149, 0.3)'
          }`,
          opacity: featureGames.length === 0 ? 0.6 : 1
        }}>
          <input
            type="checkbox"
            id="hideSection"
            checked={hideSection}
            onChange={handleToggleHideSection}
            disabled={isTogglingHide || featureGames.length === 0}
            style={{
              width: '20px',
              height: '20px',
              cursor: (isTogglingHide || featureGames.length === 0) ? 'not-allowed' : 'pointer',
              accentColor: hideSection ? '#ff4444' : '#14f195',
              opacity: featureGames.length === 0 ? 0.5 : 1
            }}
          />
          <label 
            htmlFor="hideSection"
            style={{
              color: featureGames.length === 0 ? '#888' : '#fff',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              cursor: (isTogglingHide || featureGames.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              flex: 1
            }}
          >
            {featureGames.length === 0 
              ? 'Add at least one game to enable hide feature'
              : hideSection 
                ? 'Feature Section is Hidden' 
                : 'Feature Section is Visible'}
          </label>
          {isTogglingHide && (
            <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Updating...</span>
          )}
        </div>
        {hideSection && (
          <p style={{
            color: '#ff9999',
            margin: '0.5rem 0 0 0',
            fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
            fontStyle: 'italic'
          }}>
            The entire feature section will be hidden from the frontend. No games will be deleted.
          </p>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>Loading feature games...</div>
      ) : (
        <>
          {/* Add New Button */}
          {!isAddingNew && (
            <div style={{ 
              marginBottom: 'clamp(1.5rem, 3vw, 2rem)', 
              textAlign: 'center',
              padding: '0 clamp(0.5rem, 2vw, 1rem)'
            }}>
              <button
                onClick={handleAddNew}
                style={{
                  padding: 'clamp(0.6rem, 1.5vw, 0.75rem) clamp(1.5rem, 4vw, 2rem)',
                  background: 'linear-gradient(135deg, #14f195, #9945ff)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                  whiteSpace: 'nowrap'
                }}
              >
                + Add New Feature Game
              </button>
            </div>
          )}

          {/* Add/Edit Form */}
          {(isAddingNew || editingId) && editForm && (
            <div 
              ref={formRef}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(153, 69, 255, 0.3)',
                borderRadius: '12px',
                padding: 'clamp(1rem, 2vw, 1.5rem)',
                marginBottom: '2rem',
                maxWidth: '600px',
                margin: '0 auto 2rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <h3 style={{ 
                color: '#fff', 
                marginBottom: 'clamp(1rem, 2vw, 1.5rem)', 
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                textAlign: 'center'
              }}>
                {isAddingNew ? 'Add New Feature Game' : 'Edit Feature Game'}
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                  Position Number:
                </label>
                <input
                  type="number"
                  min="1"
                  value={editForm.position}
                  onChange={(e) => setEditForm({ ...editForm, position: parseInt(e.target.value) || 1 })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(153, 69, 255, 0.5)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                <small style={{ color: '#b0b0b0', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                  Lower numbers appear first. Use any number (1, 2, 3, etc.)
                </small>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                  Select Game:
                </label>
                <select
                  value={editForm.gameId}
                  onChange={(e) => setEditForm({ ...editForm, gameId: e.target.value })}
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontSize: '0.9rem' }}>
                  Select Tag:
                </label>
                <select
                  value={editForm.tagId}
                  onChange={(e) => setEditForm({ ...editForm, tagId: e.target.value })}
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
                  <option value="">None (No tag)</option>
                  {tags.map(tag => (
                    <option key={tag._id} value={tag._id}>
                      {tag.name.charAt(0).toUpperCase() + tag.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                    background: 'linear-gradient(135deg, #14f195, #9945ff)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: 'clamp(0.6rem, 1.5vw, 0.75rem)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Feature Games List */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 100%), 1fr))',
            gap: 'clamp(0.75rem, 2vw, 1rem)',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(0.5rem, 2vw, 1rem)'
          }}>
            {featureGames.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center', 
                padding: '3rem', 
                color: '#b0b0b0',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(153, 69, 255, 0.3)'
              }}>
                No feature games yet. Click "Add New Feature Game" to get started.
              </div>
            ) : (
              featureGames.map((featureGame) => {
                const isEditing = editingId === featureGame._id;

                return (
                  <div 
                    key={featureGame._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(153, 69, 255, 0.3)',
                      borderRadius: '10px',
                      padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: hideSection ? 0.4 : 1,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <div style={{ 
                      marginBottom: '0.5rem', 
                      fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', 
                      color: '#b0b0b0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.25rem'
                    }}>
                      <span>Pos {featureGame.position}</span>
                      {!isEditing && featureGame.tagId && (
                        <span style={{
                          padding: '0.2rem 0.4rem',
                          background: getTagColor(featureGame.tagId),
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: 'clamp(0.6rem, 1.2vw, 0.65rem)',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap'
                        }}>
                          {getTagName(featureGame.tagId)}
                        </span>
                      )}
                      {!isEditing && !featureGame.tagId && (
                        <span style={{
                          padding: '0.2rem 0.4rem',
                          background: 'rgba(128, 128, 128, 0.3)',
                          borderRadius: '6px',
                          color: '#b0b0b0',
                          fontSize: 'clamp(0.6rem, 1.2vw, 0.65rem)',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap'
                        }}>
                          No Tag
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <>
                        <div style={{ marginBottom: '0.5rem', textAlign: 'center', flex: '1' }}>
                          <img
                            src={`/${featureGame.gameId.iconPath.replace(/\\/g, '/')}`}
                            alt={featureGame.gameId.title}
                            style={{
                              width: '100%',
                              aspectRatio: '1',
                              objectFit: 'contain',
                              borderRadius: '6px',
                              background: 'rgba(0, 0, 0, 0.2)',
                              padding: 'clamp(0.25rem, 1vw, 0.5rem)'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                          <h3 style={{ 
                            margin: 0, 
                            color: '#fff', 
                            fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
                            lineHeight: '1.3',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {featureGame.gameId.title}
                          </h3>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
                          <button
                            onClick={() => handleEdit(featureGame)}
                            style={{
                              width: '100%',
                              padding: 'clamp(0.4rem, 1vw, 0.5rem)',
                              background: 'rgba(153, 69, 255, 0.3)',
                              border: '1px solid rgba(153, 69, 255, 0.5)',
                              borderRadius: '6px',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
                              fontWeight: '500'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(featureGame)}
                            style={{
                              width: '100%',
                              padding: 'clamp(0.4rem, 1vw, 0.5rem)',
                              background: 'rgba(255, 68, 68, 0.3)',
                              border: '1px solid rgba(255, 68, 68, 0.5)',
                              borderRadius: '6px',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: 'clamp(0.7rem, 1.3vw, 0.8rem)',
                              fontWeight: '500'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm.show && deleteConfirm.featureGame && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
            onClick={handleDeleteCancel}
            >
              <div 
                style={{
                  background: 'rgba(30, 30, 30, 0.95)',
                  border: '1px solid rgba(153, 69, 255, 0.5)',
                  borderRadius: '12px',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  maxWidth: '400px',
                  width: '100%',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ 
                  color: '#fff', 
                  marginBottom: '1rem', 
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  textAlign: 'center'
                }}>
                  Confirm Delete
                </h3>
                <p style={{ 
                  color: '#b0b0b0', 
                  marginBottom: '1.5rem',
                  fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                  lineHeight: '1.5',
                  textAlign: 'center'
                }}>
                  Are you sure you want to delete <strong style={{ color: '#fff' }}>"{deleteConfirm.featureGame.gameId.title}"</strong> from position {deleteConfirm.featureGame.position}?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleDeleteConfirm}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 68, 68, 0.8)',
                      border: '1px solid rgba(255, 68, 68, 1)',
                      borderRadius: '6px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: 'clamp(0.85rem, 1.8vw, 1rem)'
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleDeleteCancel}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: 'clamp(0.85rem, 1.8vw, 1rem)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
