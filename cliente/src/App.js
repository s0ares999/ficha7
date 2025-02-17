import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FilmeList from './view/FilmeList';
import FilmeForm from './view/FilmeForm';
import FilmeEdit from './view/FilmeEdit';
import FilmeDetails from './view/FilmeDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import ProfileSelector from './components/ProfileSelector';
import ManageProfiles from './components/ManageProfiles';
import Footer from './components/footer';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/profiles" element={<ProfileSelector />} />
          <Route path="/manage-profiles" element={<ManageProfiles />} />
          <Route
            path="/*"
            element={
              <Navbar>
                <Routes>
                  <Route path="/" element={<FilmeList />} />
                  <Route path="/filmes" element={<FilmeList />} />
                  <Route path="/create" element={<FilmeForm />} />
                  <Route path="/edit/:id" element={<FilmeEdit />} />
                  <Route path="/filme/:id" element={<FilmeDetails />} />
                </Routes>
                <Footer />
              </Navbar>
            }
          />
        </Routes>
      </Router>
  );
}

export default App;