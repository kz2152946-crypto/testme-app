import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Test {
  id: number;
  title: string;
  subject: string;
}

function TestsList() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    if (!user) return;
    axios.get('http://localhost:3000/tests')
      .then(response => {
        setTests(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки тестов:', error);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <div className="container"><h1>Сначала войдите в систему</h1></div>;
  }

  if (loading) {
    return <div className="container"><h1>Загрузка...</h1></div>;
  }

  return (
    <div className="container">
      <h1>Список тестов</h1>
      <p style={{ textAlign: 'center', color: '#9b7d71', marginBottom: '30px', fontSize: '1.1rem' }}>
        Выберите тест, чтобы проверить свои знания
      </p>
      
      {tests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#9b7d71' }}>
            Пока нет доступных тестов
          </p>
        </div>
      ) : (
        <div className="tests-grid">
          {tests.map(test => (
            <div key={test.id} className="card test-card">
              <h2 className="test-title">{test.title}</h2>
              <p className="test-subject">
                Предмет: {test.subject}
              </p>
              <Link to={`/test/${test.id}`}>
                <button>Пройти тест</button>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/">
          <button className="btn-secondary">На главную</button>
        </Link>
      </div>
    </div>
  );
}

export default TestsList;

