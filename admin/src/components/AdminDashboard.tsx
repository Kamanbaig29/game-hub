// src/components/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../assets/adminDashboard.module.css';

interface Game {
  _id: string;
  title: string;
  description: string;
  iconPath: string;
  isActive: boolean;
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; gameId: string; gameTitle: string }>({ show: false, gameId: '', gameTitle: '' });
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
    fetchUserProfile();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games`);
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
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/admin/profile`, {
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
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games/${id}/toggle`, {
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
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/games/${deleteConfirm.gameId}`, {
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

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Admin Dashboard</h2>
        <div className={styles.headerActions}>
          <Link to="/upload" className={styles.uploadBtn}>
            Upload New Game
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
                  src={`${import.meta.env.VITE_BASE_API_URL}/${game.iconPath.replace(/\\/g, '/')}`} 
                  alt={game.title} 
                  className={styles.icon} 
                />
                <div className={styles.info}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <p className={styles.desc}>{game.description}</p>
                  <span className={`${styles.status} ${game.isActive ? styles.active : styles.inactive}`}>
                    {game.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className={styles.actions}>
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
    </div>
  );
}