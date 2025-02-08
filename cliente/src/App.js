import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Form from './view/form';
import List from './view/list';
import Edit from './view/edit';

function App() {
  return (
    <Router>
      <div className="App">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="https://www.estgv.ipv.pt/"
            style={{ color: 'red', fontWeight: 'bold' }}>www.estgv.ipv.pt</a>
          <button class="navbar-toggler" type="button" datatoggle="collapse" data-target="#navbarSupportedContent" ariacontrols="navbarSupportedContent" aria-expanded="false" arialabel="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse"
            id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <Link class="nav-link" to="/"> Employee List </Link>
              </li>
            </ul>
            <Link class="btn btn-success " to="/form">Add
              Employee</Link>
          </div>
        </nav>
        <div class="container py-4">
          <div class="row">
            <Routes>
              <Route path="/" element={<List />} />
              <Route path="/form" element={<Form />} />
              <Route path="/edit/:FilmeId" element={<Edit />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
export default App;