// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Arena from './components/Arena';
import Library from './components/Library';
import About from './components/About';
import Privacy from './components/Privacy';
import GameView from './components/GameView';
import NotFound from './components/NotFound';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <Sidebar>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/arena" element={<Arena />} />
              <Route path="/game/:slug" element={<GameView />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Sidebar>
    </Router>
  );
}

export default App;