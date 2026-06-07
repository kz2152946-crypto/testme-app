import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [testsPassed, setTestsPassed] = useState(0);

  useEffect(() => {
    if (user.id) {
      axios.get('http://localhost:3000/test-results')
        .then(res => {
          const count = res.data.filter((r: any) => r.student?.id === user.id).length;
          setTestsPassed(count);
        })
        .catch(err => console.error(err));
    }
  }, [user.id]);

  if (!user.id) {
    return <div className="container"><h1>Сначала войдите в систему</h1></div>;
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🌷</div>
        <h1 style={{ marginBottom: '10px' }}>{user.name}</h1>
        <p style={{ color: '#d4a5a5', fontSize: '1.1rem', marginBottom: '30px', fontWeight: '500' }}>
          {user.role === 'admin' ? 'Администратор системы' : 'Студент'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left', marginBottom: '30px' }}>
          <div style={{ background: '#fdf6f0', padding: '20px', borderRadius: '15px' }}>
            <div style={{ color: '#9b7d71', fontSize: '0.9rem', marginBottom: '5px' }}>Группа</div>
            <div style={{ color: '#5a4a42', fontWeight: '600', fontSize: '1.1rem' }}>{user.group}</div>
          </div>
          <div style={{ background: '#fdf6f0', padding: '20px', borderRadius: '15px' }}>
            <div style={{ color: '#9b7d71', fontSize: '0.9rem', marginBottom: '5px' }}>Email</div>
            <div style={{ color: '#5a4a42', fontWeight: '600', fontSize: '1.1rem', wordBreak: 'break-all' }}>{user.email}</div>
          </div>
          <div style={{ background: '#fdf6f0', padding: '20px', borderRadius: '15px', gridColumn: 'span 2' }}>
            <div style={{ color: '#9b7d71', fontSize: '0.9rem', marginBottom: '5px' }}>Пройдено тестов</div>
            <div style={{ color: '#5a4a42', fontWeight: '600', fontSize: '1.5rem' }}>{testsPassed}</div>
          </div>
        </div>

        <Link to="/"><button className="btn-secondary">На главную</button></Link>
      </div>
    </div>
  );
}

export default Profile;

