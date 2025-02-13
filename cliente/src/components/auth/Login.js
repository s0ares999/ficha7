import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../services/AuthService';

export default function Login({ show, handleClose, switchToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await AuthService.login(formData.email, formData.password);
            console.log('Login bem-sucedido:', response);
            handleClose();
            window.location.reload();
        } catch (error) {
            console.error('Erro no login:', error);
            setError('Email ou senha inválidos');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Entrar no FilmesFlix</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                    <div className="text-center">
                        <p className="mb-0">Não tem uma conta?</p>
                        <Button variant="link" onClick={switchToRegister}>
                            Registrar-se
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
} 