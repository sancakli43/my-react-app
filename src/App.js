import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Notes from './Pages/Notes';
import Tasks from './Pages/Tasks';
import ShoppingList from './Pages/ShoppingList';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Projelerim</h1>
          <div className="links">
            <Link to="/notes">Notlar</Link>
            <Link to="/tasks">Görevler</Link>
            <Link to="/shopping-list">Alışveriş Listesi</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path='/shopping-list' element={<ShoppingList />} />
        </Routes>
      </div>
    </Router>
  );

  function Home() {
  return (
    <div className="home">
      <h2>Hoş Geldiniz!</h2>
      <p>Projelerime göz atmak için yukarıdaki linkleri kullanın.</p>
    </div>
  );
}
}
export default App;