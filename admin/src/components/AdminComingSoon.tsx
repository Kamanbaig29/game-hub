// admin/src/components/AdminComingSoon.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface ComingSoon {
  _id: string;
  name: string;
  description?: string;
  iconPath: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminComingSoon() {
  const [comingSoonGames, setComingSoonGames] = useState<ComingSoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; description: string; icon: File | null }>({
    name: '',
    description: '',  
    icon: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string; name: string }>({
    show: false,
    id: '',
    name: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchComingSoonGames();
  }, []);

  const fetchComingSoonGames = async () => {
    try {
      const response = await fetch('/api/coming-soon');
      if (response.ok) {
        const data = await response.json();
        setComingSoonGames(data);
      }
    } catch (error) {
      console.error('Failed to fetch coming soon games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (game: ComingSoon) => {
    setEditingId(game._id);
    setFormData({
      name: game.name,
      description: game.description || '',
      icon: null,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', icon: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Game name is required');
      return;
    }

    if (!editingId && !formData.icon) {
      alert('Icon file is required for new games');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name.trim());
      submitFormData.append('description', formData.description.trim());
      if (formData.icon) {
        submitFormData.append('icon', formData.icon);
      }

      const url = editingId ? `/api/coming-soon/${editingId}` : '/api/coming-soon';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitFormData
      });

      if (response.ok) {
        await fetchComingSoonGames();
        handleCancel();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save coming soon game');
      }
    } catch (error: any) {
      console.error('Failed to save coming soon game:', error);
      alert(error.message || 'Failed to save coming soon game');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/coming-soon/${deleteConfirm.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchComingSoonGames();
        setDeleteConfirm({ show: false, id: '', name: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete coming soon game');
      }
    } catch (error) {
      console.error('Failed to delete coming soon game:', error);
      alert('Failed to delete coming soon game');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Coming Soon Games</h2>
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
          Manage games that are coming soon. Upload game icons with names to showcase upcoming releases.
        </p>
      </div>

      {/* Add/Edit Form */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '1rem',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        marginBottom: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ 
          color: '#e879f9', 
          marginBottom: '1rem',
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)'
        }}>
          {editingId ? 'Edit Coming Soon Game' : 'Add New Coming Soon Game'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#fff', 
              fontWeight: '500',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              Game Name: *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: 'clamp(0.6rem, 2vw, 0.75rem)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                boxSizing: 'border-box'
              }}
              placeholder="Enter game name..."
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#fff', 
              fontWeight: '500',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              Game Description:
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: 'clamp(0.6rem, 2vw, 0.75rem)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              placeholder="Enter game description (optional)..."
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              color: '#fff', 
              fontWeight: '500',
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              Game Icon: {editingId ? '(Leave empty to keep current)' : '*'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, icon: e.target.files?.[0] || null })}
              required={!editingId}
              style={{
                width: '100%',
                padding: 'clamp(0.5rem, 1.5vw, 0.6rem)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                boxSizing: 'border-box'
              }}
            />
            {formData.icon && (
              <p style={{ color: '#b0b0b0', fontSize: 'clamp(0.8rem, 2vw, 0.85rem)', marginTop: '0.25rem' }}>
                Selected: {formData.icon.name}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              style={{
                padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.2rem, 3vw, 1.5rem)',
                background: isSubmitting || !formData.name.trim()
                  ? 'rgba(168, 85, 247, 0.3)'
                  : 'linear-gradient(45deg, #a855f7, #9333ea)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSubmitting || !formData.name.trim() ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                opacity: isSubmitting || !formData.name.trim() ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add Game'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                style={{
                  padding: 'clamp(0.6rem, 2vw, 0.75rem) clamp(1.2rem, 3vw, 1.5rem)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Games List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>
          Loading coming soon games...
        </div>
      ) : comingSoonGames.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#b0b0b0',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px'
        }}>
          No coming soon games yet. Add your first game above!
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', 
          gap: 'clamp(1rem, 3vw, 1.5rem)'
        }}>
          {comingSoonGames.map((game) => (
            <div
              key={game._id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(153, 69, 255, 0.3)',
                borderRadius: '12px',
                padding: 'clamp(0.75rem, 2vw, 1rem)',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(153, 69, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(153, 69, 255, 0.3)';
              }}
            >
              <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
                <img
                  src={`/${game.iconPath.replace(/\\/g, '/')}`}
                  alt={game.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
              <h3 style={{
                color: '#e879f9',
                margin: '0 0 0.5rem 0',
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {game.name}
              </h3>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => handleEdit(game)}
                  style={{
                    padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
                    background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm({ show: true, id: game._id, name: game.name })}
                  style={{
                    padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.8rem, 2vw, 1rem)',
                    background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>Delete Coming Soon Game</h3>
            <p className={styles.popupText}>
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className={styles.popupButtons}>
              <button
                onClick={() => setDeleteConfirm({ show: false, id: '', name: '' })}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmBtn}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

