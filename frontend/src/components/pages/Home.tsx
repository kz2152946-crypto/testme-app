import { Link } from 'react-router-dom';

function Home() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (!user) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', marginTop: '60px', padding: '50px 40px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🌷</div>
          <h1>Система тестирования «TestMe»</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#9b7d71', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 30px' }}>
            Интерактивная платформа для прохождения тестов и анализа результатов. 
            Проверьте свои знания и узнайте что-то новое о себе!
          </p>
          <Link to="/login">
            <button style={{ fontSize: '1.1rem', padding: '15px 40px' }}>Войти в систему</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: '50px', padding: '50px 40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌷</div>
        <h1 style={{ marginBottom: '15px', wordBreak: 'break-word' }}>Добро пожаловать, {user.name}!</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#9b7d71' }}>
          Группа: {user.group}
        </p>
        <p style={{ fontSize: '1rem', color: '#9b7d71', marginBottom: '30px' }}>
          {user.role === 'admin' ? 'У вас есть доступ к админ-панели' : 'Приятного прохождения тестов!'}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/tests">
            <button style={{ fontSize: '1.1rem', padding: '15px 40px' }}>Пройти тест</button>
          </Link>
          <Link to="/my-results">
            <button style={{ fontSize: '1.1rem', padding: '15px 40px', background: 'linear-gradient(135deg, #d4a5a5 0%, #c49494 100%)' }}>
              Мои результаты
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

