import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/pages/Home';
import TestsList from './components/pages/TestsList';
import TakeTest from './components/pages/TakeTest';
import Results from './components/pages/Results';
import Login from './components/pages/Login';
import Admin from './components/pages/Admin';
import MyResults from './components/pages/MyResults';
import Statistics from './components/pages/Statistics';
import Profile from './components/pages/Profile';
import './App.css';

function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">TestMe</div>
      <div className="navbar-menu">
        <a href="/">Главная</a>
        <a href="/tests">Тесты</a>
        <a href="/my-results">Мои результаты</a>
        {user.role === 'admin' && <a href="/admin">Админ</a>}
        {user.role === 'admin' && <a href="/statistics">Статистика</a>}
        
        {/* Ссылка на профиль с классом для красивого наведения */}
        <Link to="/profile" className="profile-link">
          👤 {user.name}
        </Link>
        
        <button onClick={handleLogout} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
          Выйти
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/tests" element={<TestsList />} />
          <Route path="/test/:id" element={<TakeTest />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/my-results" element={<MyResults />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

