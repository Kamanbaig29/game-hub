import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/userManagement.module.css';

interface Admin {
  _id: string;
  username: string;
  role: 'super-admin' | 'admin';
  createdAt: string;
}

export default function UserManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', role: 'admin' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; adminId: string; username: string }>({ show: false, adminId: '', username: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newAdmin.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });

      if (response.ok) {
        setNewAdmin({ username: '', password: '', role: 'admin' });
        setShowCreateForm(false);
        fetchAdmins();
        alert('Admin created successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Failed to create admin:', error);
      alert('Failed to create admin');
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users/' + deleteConfirm.adminId, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setAdmins(admins.filter(admin => admin._id !== deleteConfirm.adminId));
      }
    } catch (error) {
      console.error('Failed to delete admin:', error);
    }
    setDeleteConfirm({ show: false, adminId: '', username: '' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>User Management</h2>
        <div className={styles.headerActions}>
          <button onClick={() => setShowCreateForm(true)} className={styles.createBtn}>
            Create Admin
          </button>
          <Link to="/" className={styles.backBtn}>Back to Dashboard</Link>
        </div>
      </div>

      <div className={styles.grid}>
        {admins.map(admin => (
          <div key={admin._id} className={styles.card}>
            <div className={styles.content}>
              <div className={styles.info}>
                <h3 className={styles.username}>{admin.username}</h3>
                <span className={`${styles.role} ${admin.role === 'super-admin' ? styles.superAdmin : styles.regularAdmin}`}>
                  {admin.role}
                </span>
                <p className={styles.date}>Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
              </div>
              {admin.role !== 'super-admin' && (
                <button 
                  onClick={() => setDeleteConfirm({ show: true, adminId: admin._id, username: admin.username })}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>Create New Admin</h3>
            <form onSubmit={handleCreateAdmin} className={styles.form}>
              <input
                type="text"
                placeholder="Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                className={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                className={styles.input}
                required
              />
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                className={styles.select}
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
              <div className={styles.popupButtons}>
                <button type="button" onClick={() => setShowCreateForm(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.confirmBtn}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>Delete Admin</h3>
            <p className={styles.popupText}>Are you sure you want to delete "{deleteConfirm.username}"?</p>
            <div className={styles.popupButtons}>
              <button onClick={() => setDeleteConfirm({ show: false, adminId: '', username: '' })} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleDeleteAdmin} className={styles.confirmBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}