// admin/src/components/AdminTags.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface Tag {
  _id: string;
  name: string;
  color: string;
  hideTag?: boolean;
}

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#9945ff' });
  const [showForm, setShowForm] = useState(false);
  const [hideSection, setHideSection] = useState(false);
  const [isTogglingHide, setIsTogglingHide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
    fetchHideSectionStatus();
  }, []);

  const fetchHideSectionStatus = async () => {
    try {
      const response = await fetch('/api/tags/hide-section-status');
      if (response.ok) {
        const data = await response.json();
        setHideSection(data.hideSection);
      }
    } catch (error) {
      console.error('Failed to fetch hide section status:', error);
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

  const handleToggleHideTag = async (tagId: string, currentHideStatus: boolean) => {
    try {
      const newHideStatus = !currentHideStatus;
      const response = await fetch(`/api/tags/${tagId}/toggle-hide`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hideTag: newHideStatus })
      });

      if (response.ok) {
        // Update the tag in the local state
        setTags(prevTags => 
          prevTags.map(tag => 
            tag._id === tagId 
              ? { ...tag, hideTag: newHideStatus }
              : tag
          )
        );
      } else {
        alert('Failed to toggle hide tag');
      }
    } catch (error) {
      console.error('Failed to toggle hide tag:', error);
      alert('Failed to toggle hide tag');
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

  const handleToggleHideSection = async () => {
    setIsTogglingHide(true);
    try {
      const newHideSection = !hideSection;
      const response = await fetch('/api/tags/toggle-hide-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hideSection: newHideSection })
      });

      if (response.ok) {
        setHideSection(newHideSection);
      } else {
        alert('Failed to toggle hide tags');
      }
    } catch (error) {
      console.error('Failed to toggle hide tags:', error);
      alert('Failed to toggle hide tags');
    } finally {
      setIsTogglingHide(false);
    }
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

      <div style={{ 
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
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
            fontSize: '1rem',
            alignSelf: 'flex-start'
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Tag'}
        </button>

        {/* Hide Tags Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          background: tags.length === 0 
            ? 'rgba(128, 128, 128, 0.1)' 
            : hideSection 
              ? 'rgba(255, 68, 68, 0.1)' 
              : 'rgba(20, 241, 149, 0.1)',
          borderRadius: '6px',
          border: `1px solid ${
            tags.length === 0 
              ? 'rgba(128, 128, 128, 0.3)' 
              : hideSection 
                ? 'rgba(255, 68, 68, 0.3)' 
                : 'rgba(20, 241, 149, 0.3)'
          }`,
          opacity: tags.length === 0 ? 0.6 : 1
        }}>
          <input
            type="checkbox"
            id="hideTagsSection"
            checked={hideSection}
            onChange={handleToggleHideSection}
            disabled={isTogglingHide || tags.length === 0}
            style={{
              width: '20px',
              height: '20px',
              cursor: (isTogglingHide || tags.length === 0) ? 'not-allowed' : 'pointer',
              accentColor: hideSection ? '#ff4444' : '#14f195',
              opacity: tags.length === 0 ? 0.5 : 1
            }}
          />
          <label 
            htmlFor="hideTagsSection"
            style={{
              color: tags.length === 0 ? '#888' : '#fff',
              fontSize: '1rem',
              cursor: (isTogglingHide || tags.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              flex: 1
            }}
          >
            {tags.length === 0 
              ? 'Add at least one tag to enable hide feature'
              : hideSection 
                ? 'Tags are Hidden from Feature Section' 
                : 'Tags are Visible in Feature Section'}
          </label>
          {isTogglingHide && (
            <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Updating...</span>
          )}
        </div>
        {hideSection && tags.length > 0 && (
          <p style={{
            color: '#ff9999',
            margin: 0,
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            All tags will be hidden from the feature section on the frontend. Tags will still be visible in the admin panel.
          </p>
        )}
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
          {tags.map(tag => {
            const isTagHidden = tag.hideTag === true;
            const shouldShowOpacity = hideSection || isTagHidden;
            
            return (
              <div
                key={tag._id}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  opacity: shouldShowOpacity ? 0.4 : 1,
                  transition: 'opacity 0.3s ease'
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
                
                {/* Hide Tag Checkbox */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  background: isTagHidden ? 'rgba(255, 68, 68, 0.1)' : 'rgba(20, 241, 149, 0.1)',
                  borderRadius: '6px',
                  border: `1px solid ${isTagHidden ? 'rgba(255, 68, 68, 0.3)' : 'rgba(20, 241, 149, 0.3)'}`
                }}>
                  <input
                    type="checkbox"
                    id={`hideTag-${tag._id}`}
                    checked={isTagHidden}
                    onChange={() => handleToggleHideTag(tag._id, isTagHidden)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: isTagHidden ? '#ff4444' : '#14f195'
                    }}
                  />
                  <label 
                    htmlFor={`hideTag-${tag._id}`}
                    style={{
                      color: '#fff',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      flex: 1
                    }}
                  >
                    {isTagHidden ? 'Tag Hidden' : 'Tag Visible'}
                  </label>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

