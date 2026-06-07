import { useState, useEffect } from 'react';
import axios from 'axios';

function Statistics() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTest, setExpandedTest] = useState<number | null>(null);
  const [testDetails, setTestDetails] = useState<{[key: number]: any[]}>({});

  useEffect(() => {
    axios.get('http://localhost:3000/test-results')
      .then(res => {
        const results = res.data;
        const testsMap: any = {};
        
        results.forEach((r: any) => {
          const testId = r.test?.id;
          if (!testsMap[testId]) {
            testsMap[testId] = { 
              id: testId, 
              title: r.test?.title, 
              subject: r.test?.subject,
              count: 0, 
              totalScore: 0, 
              totalMax: 0 
            };
          }
          testsMap[testId].count++;
          testsMap[testId].totalScore += r.score;
          testsMap[testId].totalMax += r.maxScore;
        });

        setStats(Object.values(testsMap));
        setLoading(false);
      })
      .catch(err => { 
        console.error(err); 
        setLoading(false); 
      });
  }, []);

  const toggleDetails = async (testId: number) => {
    if (expandedTest === testId) {
      setExpandedTest(null);
      return;
    }

    if (testDetails[testId]) {
      setExpandedTest(testId);
      return;
    }

    try {
      const res = await axios.get('http://localhost:3000/test-results');
      const details = res.data
        .filter((r: any) => r.test?.id === testId)
        .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      setTestDetails(prev => ({ ...prev, [testId]: details }));
      setExpandedTest(testId);
    } catch (err) {
      console.error('Ошибка загрузки деталей:', err);
    }
  };

  if (loading) return <div className="container"><h1>Загрузка...</h1></div>;

  return (
    <div className="container">
      <h1>Статистика по тестам</h1>
      <p style={{ textAlign: 'center', color: '#9b7d71', marginBottom: '30px' }}>
        Нажмите на карточку теста, чтобы увидеть результаты студентов
      </p>

      {stats.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Пока нет данных для статистики.</p>
        </div>
      ) : (
        stats.map((s: any) => {
          const avgPercentage = s.totalMax > 0 
            ? Math.round((s.totalScore / s.totalMax) * 100) 
            : 0;
          const isExpanded = expandedTest === s.id;
          const details = testDetails[s.id] || [];

          return (
            <div key={s.id} className="card" style={{ marginBottom: '20px', cursor: 'pointer' }}>
              <div onClick={() => toggleDetails(s.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h2 style={{ marginBottom: '5px', fontSize: '1.4rem' }}>{s.title}</h2>
                    <p style={{ color: '#9b7d71', fontSize: '0.95rem' }}>
                      Предмет: {s.subject} • Прохождений: {s.count}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b6f63' }}>
                      {avgPercentage}%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#9b7d71' }}>средний балл</div>
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#d4a5a5' }}>
                  {isExpanded ? '▲ Свернуть' : '▼ Показать результаты студентов'}
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #f5e6e0', paddingTop: '20px' }}>
                  {details.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9b7d71' }}>Нет данных</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Студент</th>
                          <th>Группа</th>
                          <th>Балл</th>
                          <th>Процент</th>
                          <th>Дата</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((r: any) => {
                          const percentage = Math.round((r.score / r.maxScore) * 100);
                          return (
                            <tr key={r.id}>
                              <td>{r.student?.name}</td>
                              <td>{r.student?.group}</td>
                              <td>{r.score} / {r.maxScore}</td>
                              <td>
                                <span style={{ 
                                  color: percentage >= 70 ? '#4caf50' : percentage >= 50 ? '#ff9800' : '#e57373',
                                  fontWeight: 'bold'
                                }}>
                                  {percentage}%
                                </span>
                              </td>
                              <td>{new Date(r.completedAt).toLocaleDateString('ru-RU')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Statistics;

