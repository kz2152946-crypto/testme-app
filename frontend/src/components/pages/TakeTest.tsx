import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Test { 
  id: number; 
  title: string; 
  type: string; 
}

interface Question { 
  id: number; 
  text: string; 
  optionA: string; 
  optionB: string; 
  optionC: string; 
  optionD: string; 
  correctAnswer: string;
  test: Test;
}

function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState<Test | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/tests/${id}`)
      .then(res => setTestInfo(res.data))
      .catch(err => console.error('Ошибка загрузки теста:', err));

    axios.get(`http://localhost:3000/questions`)
      .then(res => {
        const testQuestions = res.data.filter((q: Question) => q.test?.id === parseInt(id || '0'));
        setQuestions(testQuestions);
        setLoading(false);
      })
      .catch(err => { 
        console.error('Ошибка загрузки вопросов:', err); 
        setLoading(false); 
      });
  }, [id]);

  const handleSelect = (qId: number, opt: string) => {
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = async () => {
    let score = 0;
    
    if (testInfo?.type === 'quiz') {
      questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          score++;
        }
      });
    }

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    try {
      // Отправляем результат на сервер
      const response = await axios.post('http://localhost:3000/test-results', {
        score: score,
        maxScore: questions.length,
        student: { id: user.id },
        test: { id: parseInt(id || '0') }
      });
      
      console.log('Результат сохранен в БД:', response.data);
      
      // ВАЖНО: используем реальный ID из ответа сервера
      const savedResultId = response.data.id;
      
      navigate(`/results/${savedResultId}`, { 
        state: { 
          answers: answers, 
          questions: questions, 
          testType: testInfo?.type || 'quiz', 
          testTitle: testInfo?.title,
          score: score,
          total: questions.length
        } 
      });
      
    } catch (err: any) {
      console.error('Ошибка сохранения результата:', err);
      
      // Если ошибка из-за триггера (повторное прохождение)
      if (err.response?.data?.message?.includes('уже проходил')) {
        alert('Вы уже проходили этот тест! Результаты сохранены в "Мои результаты".');
        navigate('/my-results');
      } else {
        alert('Не удалось сохранить результат. Попробуйте ещё раз.');
      }
    }
  };

  if (loading) return <div className="container"><h1>Загрузка...</h1></div>;
  if (questions.length === 0) return <div className="container"><h1>Вопросы не найдены</h1></div>;

  return (
    <div className="container">
      <h1 style={{ wordBreak: 'break-word', lineHeight: '1.3' }}>{testInfo?.title}</h1>
      <p style={{ textAlign: 'center', color: '#9b7d71', marginBottom: '30px' }}>
        Всего вопросов: {questions.length}. Выбери один вариант ответа.
      </p>
      
      {questions.map((q, i) => (
        <div key={q.id} className="card">
          <h2>Вопрос {i + 1}</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#5a4a42', lineHeight: '1.5' }}>
            {q.text}
          </p>
          <div className="options-container">
            {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, idx) => {
              if (!opt) return null;
              const isSelected = answers[q.id] === opt;
              return (
                <button
                  key={idx}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(q.id, opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '50px' }}>
        <button 
          onClick={handleSubmit} 
          style={{ fontSize: '1.1rem', padding: '15px 40px' }}
          disabled={Object.keys(answers).length < questions.length}
        >
          Завершить тест
        </button>
      </div>
    </div>
  );
}

export default TakeTest;

