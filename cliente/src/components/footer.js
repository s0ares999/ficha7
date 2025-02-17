import React from 'react';

export default function Footer() {
  return (
    <footer className="footer mt-auto py-4 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <h5>FilmesFlix</h5>
            <p className="mb-0">Sua plataforma de filmes preferida</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <div className="social-links">
              <a href="/" className="text-white me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="/" className="text-white me-3">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="/" className="text-white">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <span>© {new Date().getFullYear()} FilmesFlix - Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}