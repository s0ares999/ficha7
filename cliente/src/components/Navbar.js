import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import AuthService from '../services/AuthService';


export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const switchToRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const switchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    const handleLogout = () => {
        AuthService.logout();
        setCurrentUser(null);
        navigate('/');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <i className="bi bi-film me-2"></i>
                        FilmesFlix
                    </Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link 
                                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                                    to="/"
                                >
                                    <i className="bi bi-house-door me-1"></i>
                                    Início
                                </Link>
                            </li>
                            {currentUser && (
                                <li className="nav-item">
                                    <Link 
                                        className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`} 
                                        to="/create"
                                    >
                                        <i className="bi bi-plus-circle me-1"></i>
                                        Registar Filme
                                    </Link>
                                </li>
                            )}
                        </ul>
                        <div className="d-flex gap-2">
                            {currentUser ? (
                                <div className="dropdown">
                                    <button 
                                        className="btn btn-outline-light dropdown-toggle" 
                                        type="button" 
                                        data-bs-toggle="dropdown"
                                    >
                                        <i className="bi bi-person-circle me-1"></i>
                                        {currentUser.user.name}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <button 
                                                className="dropdown-item text-danger" 
                                                onClick={handleLogout}
                                            >
                                                <i className="bi bi-box-arrow-right me-1"></i>
                                                Sair
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <>
                                    <button 
                                        className="btn btn-outline-light" 
                                        onClick={handleLoginClick}
                                    >
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        Entrar
                                    </button>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={handleRegisterClick}
                                    >
                                        <i className="bi bi-person-plus me-1"></i>
                                        Registar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div style={{ paddingTop: '76px' }}>
                <main className="flex-grow-1">
                    <div className={isHome ? '' : 'container py-4'}>
                        {children}
                    </div>
                </main>
            </div>

            <footer className="footer py-4">
                <div className="container text-center">
                    <span>© 2024 FilmesFlix - Todos os direitos reservados</span>
                </div>
            </footer>

            <Login 
                show={showLogin} 
                handleClose={() => setShowLogin(false)}
                switchToRegister={switchToRegister}
            />
            <Register 
                show={showRegister} 
                handleClose={() => setShowRegister(false)}
                switchToLogin={switchToLogin}
            />
        </div>
    );
}