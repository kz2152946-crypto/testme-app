import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function Results() {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as any;

  const [dbResult, setDbResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (id) {
      axios.get(`http://localhost:3000/test-results/${id}`)
        .then(res => { setDbResult(res.data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else if (user.id) {
      axios.get('http://localhost:3000/test-results')
        .then(res => {
          const myResults = res.data
            .filter((r: any) => r.student?.id === user.id)
            .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
          if (myResults.length > 0) setDbResult(myResults[0]);
          setLoading(false);
        })
        .catch(err => { console.error(err); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="container"><h1>Загрузка...</h1></div>;

  if (!dbResult) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>😔 Результат не найден</h1>
          <p style={{ color: '#9b7d71', marginBottom: '30px' }}>Пройдите тест сначала.</p>
          <Link to="/tests"><button>Пройти тест</button></Link>
        </div>
      </div>
    );
  }

  const score = dbResult.score;
  const total = dbResult.maxScore;
  const percentage = Math.round((score / total) * 100);
  
  let grade = '', gradeClass = '';
  
  if (percentage >= 85) { grade = 'Отлично!'; gradeClass = 'grade-excellent'; } 
  else if (percentage >= 70) { grade = 'Хорошо!'; gradeClass = 'grade-good'; } 
  else if (percentage >= 50) { grade = 'Удовлетворительно'; gradeClass = 'grade-ok'; } 
  else { grade = 'Нужно подготовиться лучше'; gradeClass = 'grade-bad'; }

  const questions = state?.questions || [];
  const answers = state?.answers || {};

  const barColor = percentage >= 70 
    ? 'linear-gradient(90deg, #81c784, #4caf50)' 
    : percentage >= 50 
      ? 'linear-gradient(90deg, #ffb74d, #ff9800)' 
      : 'linear-gradient(90deg, #e57373, #f44336)';

  const percentColor = percentage >= 70 ? '#4caf50' : percentage >= 50 ? '#ff9800' : '#e57373';

  return (
    <div className="container">
      <div className="results-card">
        <div className="result-emoji"></div>
        
        <h1 className="result-title">
          Результаты: {dbResult.test?.title || 'Тест'}
        </h1>
        
        <div className="result-percentage" style={{ color: percentColor }}>
          {percentage}%
        </div>

        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentage}%`, background: barColor }}
          ></div>
        </div>
        
        <h2 className={`result-grade ${gradeClass}`}>{grade}</h2>
        
        <p className="result-date">
           {new Date(dbResult.completedAt).toLocaleString('ru-RU')}
        </p>
        
        {questions.length > 0 && (
          <div className="answers-review">
            <h3 className="review-title">Разбор ответов</h3>
            {questions.map((q: any, idx: number) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div 
                  key={q.id} 
                  className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="answer-header">
                    <span className="answer-number">{idx + 1}</span>
                    <span className="answer-status">{isCorrect ? '✓' : '✗'}</span>
                  </div>
                  <p className="question-text">{q.text}</p>
                  <div className="answer-details">
                    <p className="user-answer">
                      Ваш ответ: <strong>{userAnswer || 'не выбран'}</strong>
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer">
                        Правильный: <strong>{q.correctAnswer}</strong>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="result-buttons">
          <Link to="/tests"><button>К списку тестов</button></Link>
          <Link to="/"><button className="btn-secondary">На главную</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Results;

