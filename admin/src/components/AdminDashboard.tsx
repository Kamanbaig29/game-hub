// src/components/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface Category {
  _id: string;
  name: string;
}

interface Game {
  _id: string;
  title: string;
  description: string;
  iconPath: string;
  isActive: boolean;
  categories?: Category[];
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; gameId: string; gameTitle: string }>({ show: false, gameId: '', gameTitle: '' });
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; description: string; categories: string[]; icon: File | null; zipFile: File | null } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchCategories();
    fetchUserProfile();
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

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const toggleGameStatus = async (id: string) => {
    try {
      console.log('Toggling game ID:', id);
      const url = `/api/games/${id}/toggle`;
      console.log('Toggle URL:', url);
      const response = await fetch(url, {
        method: 'PATCH'
      });
      if (response.ok) {
        const updatedGame = await response.json();
        setGames(games.map(g => g._id === id ? updatedGame : g));
      }
    } catch (error) {
      console.error('Failed to toggle game status:', error);
    }
  };

  const showDeleteConfirm = (id: string, title: string) => {
    setDeleteConfirm({ show: true, gameId: id, gameTitle: title });
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting game ID:', deleteConfirm.gameId);
      const url = `/api/games/${deleteConfirm.gameId}`;
      console.log('Delete URL:', url);
      const response = await fetch(url, {
        method: 'DELETE'
      });
      if (response.ok) {
        setGames(games.filter(g => g._id !== deleteConfirm.gameId));
      }
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
    setDeleteConfirm({ show: false, gameId: '', gameTitle: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, gameId: '', gameTitle: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const truncateDescription = (text: string, maxWords: number = 2): string => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const handleEdit = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      if (response.ok) {
        const game = await response.json();
        setEditingGame(game);
        setEditForm({
          title: game.title,
          description: game.description,
          categories: game.categories ? game.categories.map((c: Category) => c._id) : [],
          icon: null,
          zipFile: null
        });
      }
    } catch (error) {
      console.error('Failed to fetch game:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingGame || !editForm) return;

    if (!editForm.title.trim()) {
      alert('Title is required');
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title.trim());
      formData.append('description', editForm.description.trim());
      
      if (editForm.icon) {
        formData.append('icon', editForm.icon);
      }
      if (editForm.zipFile) {
        formData.append('zipFile', editForm.zipFile);
      }
      if (editForm.categories.length > 0) {
        formData.append('categories', editForm.categories.join(','));
      } else {
        formData.append('categories', '');
      }

      const response = await fetch(`/api/games/${editingGame._id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const updatedGame = await response.json();
        setGames(games.map(g => g._id === editingGame._id ? updatedGame : g));
        setEditingGame(null);
        setEditForm(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update game');
      }
    } catch (error: any) {
      console.error('Failed to update game:', error);
      alert(error.message || 'Failed to update game');
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditingGame(null);
    setEditForm(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Admin Dashboard</h2>
        <div className={styles.headerActions}>
          <Link to="/upload" className={styles.uploadBtn}>
            Upload New Game
          </Link>
          <Link to="/feature-games" className={styles.uploadBtn}>
            Feature Games
          </Link>
          <Link to="/tags" className={styles.uploadBtn}>
            Tags
          </Link>
          <Link to="/categories" className={styles.uploadBtn}>
            Categories
          </Link>
          {userRole === 'super-admin' && (
            <Link to="/users" className={styles.usersBtn}>
              Manage Users
            </Link>
          )}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <div>Loading games...</div>
        ) : games.length === 0 ? (
          <div>No games uploaded yet.</div>
        ) : (
          games.map(game => (
            <div key={game._id} className={styles.card}>
              <div className={styles.content}>
                <img 
                  src={`/${game.iconPath.replace(/\\/g, '/')}`} 
                  alt={game.title} 
                  className={styles.icon} 
                />
                <div className={styles.info}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <p className={styles.desc}>{truncateDescription(game.description, 2)}</p>
                  {game.categories && game.categories.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '0.25rem', 
                      marginTop: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      {game.categories.map(category => (
                        <span
                          key={category._id}
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            background: 'rgba(168, 85, 247, 0.2)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            borderRadius: '12px',
                            color: '#c084fc',
                            fontSize: '0.7rem',
                            fontWeight: '500'
                          }}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className={`${styles.status} ${game.isActive ? styles.active : styles.inactive}`}>
                    {game.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className={styles.actions}>
                  <button 
                    onClick={() => handleEdit(game._id)}
                    style={{
                      padding: 'clamp(4px, 1.5vw, 8px) clamp(8px, 3vw, 16px)',
                      background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '1rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: 'clamp(0.6rem, 2vw, 0.85rem)',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => toggleGameStatus(game._id)} 
                    className={`${styles.toggleBtn} ${game.isActive ? styles.deactivateBtn : styles.activateBtn}`}
                  >
                    {game.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => showDeleteConfirm(game._id, game.title)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirm.show && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>Delete Game</h3>
            <p className={styles.popupText}>Are you sure you want to delete "{deleteConfirm.gameTitle}"?</p>
            <div className={styles.popupButtons}>
              <button onClick={cancelDelete} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleDelete} className={styles.confirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {editingGame && editForm && (
        <div className={styles.overlay}>
          <div style={{
            background: 'rgba(139, 69, 19, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '1.5rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 className={styles.popupTitle} style={{ marginBottom: '1.5rem' }}>Edit Game</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '500' }}>
                Title: *
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '500' }}>
                Description: *
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '500' }}>
                Game Icon (Leave empty to keep current):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditForm({ ...editForm, icon: e.target.files?.[0] || null })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
              {editForm.icon && (
                <p style={{ color: '#b0b0b0', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  New file: {editForm.icon.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '500' }}>
                Unity Build (.zip) (Leave empty to keep current):
              </label>
              <input
                type="file"
                accept=".zip,application/zip"
                onChange={(e) => setEditForm({ ...editForm, zipFile: e.target.files?.[0] || null })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
              {editForm.zipFile && (
                <p style={{ color: '#b0b0b0', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                  New file: {editForm.zipFile.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: '500' }}>
                Categories (Select multiple):
              </label>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
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
                      background: editForm.categories.includes(category._id) 
                        ? 'rgba(168, 85, 247, 0.3)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${editForm.categories.includes(category._id) 
                        ? 'rgba(168, 85, 247, 0.5)' 
                        : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editForm.categories.includes(category._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditForm({
                            ...editForm,
                            categories: [...editForm.categories, category._id]
                          });
                        } else {
                          setEditForm({
                            ...editForm,
                            categories: editForm.categories.filter(id => id !== category._id)
                          });
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelEdit}
                disabled={isUpdating}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  opacity: isUpdating ? 0.5 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !editForm.title.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isUpdating || !editForm.title.trim() 
                    ? 'rgba(168, 85, 247, 0.3)' 
                    : 'linear-gradient(45deg, #14f195, #9945ff)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isUpdating || !editForm.title.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: isUpdating || !editForm.title.trim() ? 0.6 : 1
                }}
              >
                {isUpdating ? 'Updating...' : 'Update Game'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}