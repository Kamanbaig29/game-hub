// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import AdminUpload from './components/AdminUpload';
import GameView from './components/GameView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<GameView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;