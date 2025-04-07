import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import AuthService from '../services/AuthService';
import { Dropdown } from 'react-bootstrap';

export default function Layout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const isAuthenticated = AuthService.isAuthenticated();
    const currentProfile = JSON.parse(localStorage.getItem('currentProfile')) || null;
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        setCurrentUser(user);
    }, []);

    const handleLoginClick = () => {
        setShowLogin(true);
        setShowRegister(false);
        if (dropdownRef.current) {
            dropdownRef.current.click();
        }
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
        if (dropdownRef.current) {
            dropdownRef.current.click();
        }
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

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <div
            ref={ref}
            onClick={onClick}
            className="d-flex align-items-center nav-link"
            style={{ cursor: 'pointer' }}
        >
            {currentProfile && (
                <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="rounded-circle me-2"
                    style={{ 
                        width: '32px', 
                        height: '32px',
                        border: `2px solid ${currentProfile.color}`,
                        objectFit: 'cover'
                    }}
                />
            )}
            {children}
        </div>
    ));

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
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {isAuthenticated && (
                                <>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`} to="/create">
                                            <i className="bi bi-plus-circle-fill me-2"></i>
                                            Adicionar Filme
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${location.pathname === '/generos' ? 'active' : ''}`} to="/generos">
                                            <i className="bi bi-tags me-2"></i>
                                            Gerir Gêneros
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <ul className="navbar-nav">
                            {!isAuthenticated ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" onClick={handleLoginClick}>
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" onClick={handleRegisterClick}>
                                            <i className="bi bi-person-plus-fill me-2"></i>
                                            Registrar
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item dropdown">
                                    <Dropdown align="end">
                                        <Dropdown.Toggle as={CustomToggle} ref={dropdownRef}>
                                            {currentProfile?.name || 'Perfil'}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="dropdown-menu-dark">
                                            <Dropdown.Item as={Link} to="/profiles">
                                                <i className="bi bi-people me-2"></i>
                                                Trocar Perfil
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/manage-profiles">
                                                <i className="bi bi-gear me-2"></i>
                                                Gerenciar Perfis
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout}>
                                                <i className="bi bi-box-arrow-right me-2"></i>
                                                Sair
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            )}
                        </ul>
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