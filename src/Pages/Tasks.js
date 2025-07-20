import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Notes.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = 'http://localhost:8000/api/tasks';

  // Tüm görevleri çek
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(api);
        setTasks(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Yeni görev ekle
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api, { title });
      setTasks([...tasks, response.data]);
      setTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  // görevi tamamla / güncelle

    const toggleTask = async (task) => {
  try {
    const updatedTask = { ...task, completed: !task.completed };
    
    // Önce arayüzü güncelle
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    
    // API'ye istek gönder
    await axios.put(`${api}/${task.id}`, updatedTask);
    
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    // Hata durumunda geri al
    setTasks(tasks.map(t => t.id === task.id ? task : t));
  }
};
  // Görevi sil
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${api}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <div className='notes-container'>
      <h1>Görev Listesi</h1>
      
      <form className='note-form' onSubmit={addTask}>
        <input
          type="text"
          placeholder="Yeni görev"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Ekle</button>
      </form>

      <div className="notes-list">
        {tasks.map(task => (
          <div key={task.id} className="note-card">
            <span
              className={`task-title ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task)}
            >
              {task.title}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }} 
              className="delete-btn"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;