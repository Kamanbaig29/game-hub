// admin/src/components/AdminTags.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface Tag {
  _id: string;
  name: string;
  color: string;
}

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#9945ff' });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTag ? `/api/tags/${editingTag._id}` : '/api/tags';
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchTags();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save tag');
      }
    } catch (error) {
      console.error('Failed to save tag:', error);
      alert('Failed to save tag');
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag? This may affect featured games using this tag.')) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchTags();
      } else {
        alert('Failed to delete tag');
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert('Failed to delete tag');
    }
  };

  const resetForm = () => {
    setEditingTag(null);
    setFormData({ name: '', color: '#9945ff' });
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Tags</h2>
        <div className={styles.headerActions}>
          <Link to="/" className={styles.uploadBtn}>
            Dashboard
          </Link>
          <Link to="/feature-games" className={styles.uploadBtn}>
            Feature Games
          </Link>
          <Link to="/categories" className={styles.uploadBtn}>
            Categories
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(45deg, #a855f7, #9333ea)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Tag'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#e879f9', marginBottom: '1rem' }}>
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              Tag Name:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              Color (Hex):
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#9945ff"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(45deg, #14f195, #9945ff)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingTag ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>Loading tags...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {tags.map(tag => (
            <div
              key={tag._id}
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: tag.color,
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', textTransform: 'capitalize' }}>
                    {tag.name}
                  </h3>
                  <p style={{ color: '#b0b0b0', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                    {tag.color}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(tag)}
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
                  onClick={() => handleDelete(tag._id)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

