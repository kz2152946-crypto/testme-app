import { useState, useEffect } from 'react';
import axios from 'axios';

function MyResults() {
  const [results, setResults] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    axios.get('http://localhost:3000/test-results')
      .then(res => {
        const myResults = res.data.filter((r: any) => r.student?.id === user.id);
        setResults(myResults);
      })
      .catch(err => console.error(err));
  }, [user.id]);

  return (
    <div className="container">
      <h1>Мои результаты</h1>
      {results.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Вы ещё не проходили тесты</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Тест</th>
              <th>Тип</th>
              <th>Результат</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => {
              const isQuiz = r.test?.type === 'quiz';
              const percentage = Math.round((r.score / r.maxScore) * 100);
              
              return (
                <tr key={r.id}>
                  <td>{new Date(r.completedAt).toLocaleDateString('ru-RU')}</td>
                  <td>{r.test?.title}</td>
                  <td>{isQuiz ? 'Тест на знания' : 'Личностный'}</td>
                  <td>
                    {isQuiz ? (
                      <span style={{ color: percentage >= 70 ? '#4caf50' : '#ff9800' }}>
                        {r.score} / {r.maxScore} ({percentage}%)
                      </span>
                    ) : (
                      <span style={{ color: '#e8b4b8' }}>
                        Пройден ✓
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyResults;

