import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminUpload from './components/AdminUpload';
import AdminLogin from './components/AdminLogin';
import UserManagement from './components/UserManagement';
import AdminFeatureGames from './components/AdminFeatureGames';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><AdminUpload /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/feature-games" element={<ProtectedRoute><AdminFeatureGames /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;