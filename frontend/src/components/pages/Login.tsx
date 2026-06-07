import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  onLogin: (user: any) => void;
}

function Login({ onLogin }: LoginProps) {
  const [students, setStudents] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
      
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(emailInput.toLowerCase()) || 
    s.email.toLowerCase().includes(emailInput.toLowerCase())
  );

  const handleSelectStudent = (email: string) => {
    setEmailInput(email);
    setShowSuggestions(false);
  };

  const handleLogin = async () => {
    setError('');
    if (!emailInput || !password) {
      setError('Введите email и пароль!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/students/login', {
        email: emailInput,
        password: password
      });

      const user = response.data;
      const role = user.email.includes('admin') ? 'admin' : 'student';
      
      onLogin({ ...user, role });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный email или пароль!');
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '450px', margin: '60px auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌷</div>
          <h1>Вход в TestMe</h1>
          <p style={{ color: '#9b7d71', marginBottom: '30px', fontSize: '1.1rem' }}>
            Введите свои данные для входа
          </p>

          {error && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '12px', 
              borderRadius: '10px', 
              marginBottom: '20px',
              fontSize: '0.95rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'left' }} ref={wrapperRef}>
            <label style={{ color: '#8b6f63', fontWeight: '500', marginBottom: '5px', display: 'block' }}>
              Email или Имя
            </label>
            
            {/* Обертка для поля ввода и выпадающего списка */}
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Начните вводить имя или email..." 
                value={emailInput} 
                onChange={e => {
                  setEmailInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
                style={{ width: '100%', marginBottom: 0 }}
              />
              
              {/* Выпадающий список теперь позиционируется ровно под полем ввода */}
              {showSuggestions && emailInput && filteredStudents.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '5px',
                  background: 'white',
                  border: '1px solid #f5e6e0',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {filteredStudents.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => handleSelectStudent(s.email)}
                      style={{
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f5e6e0',
                        color: '#5a4a42'
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = '#fdf6f0')}
                      onMouseOut={e => (e.currentTarget.style.background = 'white')}
                    >
                      <div style={{ fontWeight: '500' }}>{s.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9b7d71' }}>{s.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label style={{ color: '#8b6f63', fontWeight: '500', marginBottom: '5px', display: 'block', marginTop: '15px' }}>
              Пароль
            </label>
            <input 
              type="password" 
              placeholder="Введите пароль" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="new-password"
            />
          </div>

          <button 
            onClick={handleLogin}
            style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '20px' }}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

