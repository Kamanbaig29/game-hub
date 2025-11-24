// admin/src/components/AdminCategories.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface Category {
  _id: string;
  name: string;
  description?: string;
  hideCategory?: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [hideSection, setHideSection] = useState(false);
  const [isTogglingHide, setIsTogglingHide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchHideSectionStatus();
  }, []);

  const fetchHideSectionStatus = async () => {
    try {
      const response = await fetch('/api/categories/hide-section-status');
      if (response.ok) {
        const data = await response.json();
        setHideSection(data.hideSection);
      }
    } catch (error) {
      console.error('Failed to fetch hide section status:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchCategories();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This may affect games using this category.')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
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
      const response = await fetch('/api/categories/toggle-hide-section', {
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

  const handleToggleHideCategory = async (categoryId: string, currentHideStatus: boolean) => {
    try {
      const newHideStatus = !currentHideStatus;
      const response = await fetch(`/api/categories/${categoryId}/toggle-hide`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hideCategory: newHideStatus })
      });

      if (response.ok) {
        // Update the category in the local state
        setCategories(prevCategories => 
          prevCategories.map(category => 
            category._id === categoryId 
              ? { ...category, hideCategory: newHideStatus }
              : category
          )
        );
      } else {
        alert('Failed to toggle hide category');
      }
    } catch (error) {
      console.error('Failed to toggle hide category:', error);
      alert('Failed to toggle hide category');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Manage Categories</h2>
        <div className={styles.headerActions}>
          <Link to="/" className={styles.uploadBtn}>
            Dashboard
          </Link>
          <Link to="/feature-games" className={styles.uploadBtn}>
            Feature Games
          </Link>
          <Link to="/tags" className={styles.uploadBtn}>
            Tags
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
          {showForm ? 'Cancel' : '+ Add New Category'}
        </button>

        {/* Hide Categories Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          background: categories.length === 0 
            ? 'rgba(128, 128, 128, 0.1)' 
            : hideSection 
              ? 'rgba(255, 68, 68, 0.1)' 
              : 'rgba(20, 241, 149, 0.1)',
          borderRadius: '6px',
          border: `1px solid ${
            categories.length === 0 
              ? 'rgba(128, 128, 128, 0.3)' 
              : hideSection 
                ? 'rgba(255, 68, 68, 0.3)' 
                : 'rgba(20, 241, 149, 0.3)'
          }`,
          opacity: categories.length === 0 ? 0.6 : 1
        }}>
          <input
            type="checkbox"
            id="hideSection"
            checked={hideSection}
            onChange={handleToggleHideSection}
            disabled={isTogglingHide || categories.length === 0}
            style={{
              width: '20px',
              height: '20px',
              cursor: (isTogglingHide || categories.length === 0) ? 'not-allowed' : 'pointer',
              accentColor: hideSection ? '#ff4444' : '#14f195',
              opacity: categories.length === 0 ? 0.5 : 1
            }}
          />
          <label 
            htmlFor="hideSection"
            style={{
              color: categories.length === 0 ? '#888' : '#fff',
              fontSize: '1rem',
              cursor: (isTogglingHide || categories.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              flex: 1
            }}
          >
            {categories.length === 0 
              ? 'Add at least one category to enable hide feature'
              : hideSection 
                ? 'Categories Section is Hidden' 
                : 'Categories Section is Visible'}
          </label>
          {isTogglingHide && (
            <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Updating...</span>
          )}
        </div>
        {hideSection && categories.length > 0 && (
          <p style={{
            color: '#ff9999',
            margin: 0,
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            The entire categories section will be hidden from the frontend. No categories will be deleted.
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
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              Category Name:
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
              Description (Optional):
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
              {editingCategory ? 'Update' : 'Create'}
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
        <div style={{ textAlign: 'center', padding: '2rem', color: '#b0b0b0' }}>Loading categories...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {categories.map(category => {
            const isCategoryHidden = category.hideCategory === true;
            const shouldShowOpacity = hideSection || isCategoryHidden;
            
            return (
              <div
                key={category._id}
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
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.2rem' }}>
                    {category.name}
                  </h3>
                  {category.description && (
                    <p style={{ color: '#b0b0b0', margin: 0, fontSize: '0.9rem' }}>
                      {category.description}
                    </p>
                  )}
                </div>
                
                {/* Hide Category Checkbox */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  background: isCategoryHidden ? 'rgba(255, 68, 68, 0.1)' : 'rgba(20, 241, 149, 0.1)',
                  borderRadius: '6px',
                  border: `1px solid ${isCategoryHidden ? 'rgba(255, 68, 68, 0.3)' : 'rgba(20, 241, 149, 0.3)'}`
                }}>
                  <input
                    type="checkbox"
                    id={`hideCategory-${category._id}`}
                    checked={isCategoryHidden}
                    onChange={() => handleToggleHideCategory(category._id, isCategoryHidden)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: isCategoryHidden ? '#ff4444' : '#14f195'
                    }}
                  />
                  <label 
                    htmlFor={`hideCategory-${category._id}`}
                    style={{
                      color: '#fff',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      flex: 1
                    }}
                  >
                    {isCategoryHidden ? 'Category Hidden' : 'Category Visible'}
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(category)}
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
                    onClick={() => handleDelete(category._id)}
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

