import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Css/Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [latestNotes, setLatestNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  // API endpoint'ler
  const API_URL = 'http://127.0.0.1:8000/api/notes';
  const LATEST_NOTES_URL = 'http://127.0.0.1:8000/api/notes/latest';

  // Notları getirme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [notesResponse, latestResponse] = await Promise.all([
          axios.get(API_URL),
          axios.get(LATEST_NOTES_URL)
        ]);
        setNotes(notesResponse.data);
        setLatestNotes(latestResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Not ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, { title, body });
      setNotes([...notes, response.data]);
      // En son eklenen notu latestNotes'a da ekleyelim
      setLatestNotes(prev => {
        const newLatest = [response.data, ...prev];
        return newLatest.slice(0, 5); // En fazla 5 kayıt tutalım
      });
      setTitle('');
      setBody('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Düzenleme modunu aç
  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditBody(note.body);
  };

  // Düzenlemeyi kaydet
  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        title: editTitle,
        body: editBody
      });
      setNotes(notes.map(note => 
        note.id === id ? response.data : note
      ));
      // LatestNotes'ı da güncelleyelim
      setLatestNotes(latestNotes.map(note => 
        note.id === id ? response.data : note
      ));
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Not silme
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes(notes.filter(note => note.id !== id));
      // LatestNotes'tan da silelim
      setLatestNotes(latestNotes.filter(note => note.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  const formatDate = (dateString) => {
    const options = {
        day : "numeric",
        year : "numeric",
        month : "short",
        hour : "2-digit",
        minute : "2-digit"        
    };
    return new Date(dateString).toLocaleString("tr-TR", options);
  }

  return (
    <div className="notes-container">
      <h1>Notlarım</h1>
      
      {/* Son 5 Not Bölümü */}
      <div className="latest-notes-section">
        <h2>Son Eklenen 5 Not</h2>
        <div className="latest-notes-grid">
          {latestNotes.map((note) => (
            <div key={`latest-${note.id}`} className="latest-note-card">
              <h3>{note.title}</h3>
              <p className="latest-note-preview">
                {note.body.length > 100 ? `${note.body.substring(0, 100)}...` : note.body}
              </p>
              <div className="note-meta">
                <span className="date-info">
                  <i className="far fa-calendar-plus"></i> {formatDate(note.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yeni Not Ekleme Formu */}
      <form onSubmit={handleSubmit} className="note-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Not başlığı"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Not içeriği"
          required
        />
        <button type="submit">Not Ekle</button>
      </form>

      {/* Tüm Notlar Listesi */}
      <div className="all-notes-section">
        <h2>Tüm Notlarım</h2>
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              {editingId === note.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="edit-textarea"
                  />
                  <div className="edit-buttons">
                    <button 
                      onClick={() => handleUpdate(note.id)}
                      className="save-btn"
                    >
                      Kaydet
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="cancel-btn"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>

                  <div className="note-meta">
                    <span className="date-info">
                      <i className="far fa-calendar-plus"></i> {formatDate(note.created_at)}
                    </span>
                    {note.created_at !== note.updated_at && (
                      <span className="date-info">
                        <i className="far fa-calendar-check"></i> {formatDate(note.updated_at)}
                      </span>
                    )}
                  </div>

                  <div className="note-actions">
                    <button 
                      onClick={() => handleEdit(note)}
                      className="edit-btn"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDelete(note.id)}
                      className="delete-btn"
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;