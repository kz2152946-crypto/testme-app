import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [students, setStudents] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [tab, setTab] = useState('students');

  const [newStudent, setNewStudent] = useState({ name: '', group: '', email: '', password: '' });
  const [newTest, setNewTest] = useState({ title: '', subject: '', type: 'quiz' });
  const [newQuestion, setNewQuestion] = useState({
    text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '', testId: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios.get('http://localhost:3000/students').then(r => setStudents(r.data)).catch(err => console.error(err));
    axios.get('http://localhost:3000/tests').then(r => setTests(r.data)).catch(err => console.error(err));
    axios.get('http://localhost:3000/questions').then(r => setQuestions(r.data)).catch(err => console.error(err));
  };

  const addStudent = () => {
    if (!newStudent.name || !newStudent.group || !newStudent.email || !newStudent.password) {
      alert('Заполните все поля, включая пароль!');
      return;
    }
    axios.post('http://localhost:3000/students', newStudent)
      .then(() => { 
        loadData(); 
        setNewStudent({ name: '', group: '', email: '', password: '' });
        alert('Студент успешно добавлен!');
      })
      .catch(err => alert('Ошибка: ' + err.message));
  };

  const addTest = () => {
    if (!newTest.title || !newTest.subject) {
      alert('Заполните все поля!');
      return;
    }
    axios.post('http://localhost:3000/tests', newTest)
      .then(() => { 
        loadData(); 
        setNewTest({ title: '', subject: '', type: 'quiz' });
        alert('Тест добавлен!');
      })
      .catch(err => alert('Ошибка: ' + err.message));
  };

  const addQuestion = () => {
    if (!newQuestion.text || !newQuestion.optionA || !newQuestion.correctAnswer) {
      alert('Заполните текст вопроса, вариант A и правильный ответ!');
      return;
    }
    axios.post('http://localhost:3000/questions', {
      ...newQuestion,
      test: { id: newQuestion.testId }
    })
      .then(() => { 
        loadData(); 
        setNewQuestion({ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '', testId: 1 });
        alert('Вопрос добавлен!');
      })
      .catch(err => alert('Ошибка: ' + err.message));
  };

  const deleteStudent = (id: number) => {
    if (confirm('Удалить студента?')) {
      axios.delete(`http://localhost:3000/students/${id}`).then(loadData).catch(err => alert('Ошибка: ' + err.message));
    }
  };

  const deleteTest = (id: number) => {
    if (confirm('Удалить тест?')) {
      axios.delete(`http://localhost:3000/tests/${id}`).then(loadData).catch(err => alert('Ошибка: ' + err.message));
    }
  };

  const deleteQuestion = (id: number) => {
    if (confirm('Удалить вопрос?')) {
      axios.delete(`http://localhost:3000/questions/${id}`).then(loadData).catch(err => alert('Ошибка: ' + err.message));
    }
  };

  return (
    <div className="container">
      <h1>Админ-панель</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('students')} style={tab === 'students' ? {} : { background: '#f5e6e0', color: '#5a4a42' }}>
          Студенты ({students.length})
        </button>
        <button onClick={() => setTab('tests')} style={tab === 'tests' ? {} : { background: '#f5e6e0', color: '#5a4a42' }}>
          Тесты ({tests.length})
        </button>
        <button onClick={() => setTab('questions')} style={tab === 'questions' ? {} : { background: '#f5e6e0', color: '#5a4a42' }}>
          Вопросы ({questions.length})
        </button>
      </div>

      {tab === 'students' && (
        <div>
          <div className="card">
            <h2>Добавить студента</h2>
            <input placeholder="Имя" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
            <input placeholder="Группа" value={newStudent.group} onChange={e => setNewStudent({...newStudent, group: e.target.value})} />
            <input placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
            <input 
              type="password" 
              placeholder="Пароль для входа" 
              value={newStudent.password} 
              onChange={e => setNewStudent({...newStudent, password: e.target.value})} 
            />
            <button onClick={addStudent}>Добавить</button>
          </div>
          <table>
            <thead><tr><th>ID</th><th>Имя</th><th>Группа</th><th>Email</th><th>Действие</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.name}</td><td>{s.group}</td><td>{s.email}</td>
                  <td><button onClick={() => deleteStudent(s.id)} style={{ background: '#ff6b6b', padding: '8px 15px' }}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'tests' && (
        <div>
          <div className="card">
            <h2>Добавить тест</h2>
            <input placeholder="Название" value={newTest.title} onChange={e => setNewTest({...newTest, title: e.target.value})} />
            <input placeholder="Предмет" value={newTest.subject} onChange={e => setNewTest({...newTest, subject: e.target.value})} />
            <select value={newTest.type} onChange={e => setNewTest({...newTest, type: e.target.value})}>
              <option value="quiz">Тест на знания (quiz)</option>
              <option value="personality">Личностный тест (personality)</option>
            </select>
            <button onClick={addTest}>Добавить</button>
          </div>
          <table>
            <thead><tr><th>ID</th><th>Название</th><th>Предмет</th><th>Тип</th><th>Действие</th></tr></thead>
            <tbody>
              {tests.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td><td>{t.title}</td><td>{t.subject}</td><td>{t.type}</td>
                  <td><button onClick={() => deleteTest(t.id)} style={{ background: '#ff6b6b', padding: '8px 15px' }}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'questions' && (
        <div>
          <div className="card">
            <h2>Добавить вопрос</h2>
            <input placeholder="Текст вопроса" value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} />
            <input placeholder="Вариант A" value={newQuestion.optionA} onChange={e => setNewQuestion({...newQuestion, optionA: e.target.value})} />
            <input placeholder="Вариант B" value={newQuestion.optionB} onChange={e => setNewQuestion({...newQuestion, optionB: e.target.value})} />
            <input placeholder="Вариант C" value={newQuestion.optionC} onChange={e => setNewQuestion({...newQuestion, optionC: e.target.value})} />
            <input placeholder="Вариант D (необязательно)" value={newQuestion.optionD} onChange={e => setNewQuestion({...newQuestion, optionD: e.target.value})} />
            <input placeholder="Правильный ответ" value={newQuestion.correctAnswer} onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})} />
            <select value={newQuestion.testId} onChange={e => setNewQuestion({...newQuestion, testId: parseInt(e.target.value)})}>
              {tests.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title} (ID: {t.id})
                </option>
              ))}
            </select>
            <button onClick={addQuestion}>Добавить вопрос</button>
          </div>
          <table>
            <thead><tr><th>ID</th><th>Вопрос</th><th>Правильный ответ</th><th>Тест</th><th>Действие</th></tr></thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td style={{ maxWidth: '300px' }}>{q.text}</td>
                  <td>{q.correctAnswer}</td>
                  <td>{q.test?.title || `Тест #${q.test?.id}`}</td>
                  <td><button onClick={() => deleteQuestion(q.id)} style={{ background: '#ff6b6b', padding: '8px 15px' }}>Удалить</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;

