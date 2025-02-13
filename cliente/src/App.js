import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FilmeForm from './view/FilmeForm';
import FilmeList from './view/FilmeList';
import FilmeEdit from './view/FilmeEdit';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">CinemaDB</Link>
            <button className="navbar-toggler" type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Lista de Filmes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create">Novo Filme</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<FilmeList />} />
            <Route path="/create" element={<FilmeForm />} />
            <Route path="/edit/:id" element={<FilmeEdit />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;