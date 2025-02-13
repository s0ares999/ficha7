import React from 'react';
import AuthService from '../../services/AuthService';

export default function Logout({ onLogout }) {
    const handleLogout = () => {
        console.log('Iniciando logout...');
        AuthService.logout();
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            className="btn btn-outline-danger"
            style={{ marginLeft: '10px' }}
        >
            Sair
        </button>
    );
} 