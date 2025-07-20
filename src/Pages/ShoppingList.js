import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ShoppingList.css'

const API_URL = 'http://127.0.0.1:8000/api/shopping-list';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editItem, setEditItem] = useState('');
  const [editQuantity, setEditQuantity] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(API_URL);
        setItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newItem.trim()) return;
    
    try {
      const response = await axios.post(API_URL, {
        item: newItem,
        quantity: newQuantity,
        purchased: false
      });
      setItems([...items, response.data]);
      setNewItem('');
      setNewQuantity(1);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditItem(item.item);
    setEditQuantity(item.quantity);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditItem('');
    setEditQuantity(1);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        item: editItem,
        quantity: editQuantity,
        purchased: items.find(item => item.id === id).purchased
      });
      
      setItems(items.map(item => 
        item.id === id ? response.data : item
      ));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePurchased = async (id) => {
    try {
      const itemToUpdate = items.find(item => item.id === id);
      const response = await axios.put(`${API_URL}/${id}`, {
        ...itemToUpdate,
        purchased: !itemToUpdate.purchased
      });
      
      setItems(items.map(item => 
        item.id === id ? response.data : item
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <div className="shopping-list-container">
      <h1>Alışveriş Listesi</h1>
      
      <div className="add-item-form">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Ürün adı"
        />
        <input
          type="number"
          min="1"
          value={newQuantity}
          onChange={(e) => setNewQuantity(parseInt(e.target.value))}
        />
        <button onClick={addItem}>Ekle</button>
      </div>
      
      <ul className="items-list">
        {items.map((item) => (
          <li key={item.id} className={`item ${item.purchased ? 'purchased' : ''}`}>
            {editingId === item.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editItem}
                  onChange={(e) => setEditItem(e.target.value)}
                />
                <input
                  type="number"
                  min="1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(parseInt(e.target.value))}
                />
                <button onClick={() => saveEdit(item.id)}>Kaydet</button>
                <button onClick={cancelEditing}>İptal</button>
              </div>
            ) : (
              <>
                <span>
                  {item.item} - {item.quantity} birim
                </span>
                <div>
                  <button onClick={() => togglePurchased(item.id)}>
                    {item.purchased ? 'İptal' : 'Satın Alındı'}
                  </button>
                  <button onClick={() => startEditing(item)}>Düzenle</button>
                  <button onClick={() => deleteItem(item.id)}>Sil</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;