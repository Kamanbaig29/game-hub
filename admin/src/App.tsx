import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminUpload from './components/AdminUpload';
import AdminLogin from './components/AdminLogin';
import UserManagement from './components/UserManagement';
import AdminFeatureGames from './components/AdminFeatureGames';
import AdminTags from './components/AdminTags';
import AdminCategories from './components/AdminCategories';
import AdminComingSoon from './components/AdminComingSoon';
import K6Report from './components/K6Report';
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
        <Route path="/tags" element={<ProtectedRoute><AdminTags /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
        <Route path="/coming-soon" element={<ProtectedRoute><AdminComingSoon /></ProtectedRoute>} />
        <Route path="/k6" element={<ProtectedRoute><K6Report /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;