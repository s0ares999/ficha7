import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import AuthService from '../../services/AuthService';

export default function Register({ show, handleClose, switchToLogin }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As passwords não coincidem');
            return;
        }

        try {
            setLoading(true);
            const authService = new AuthService(); // Criar uma instância do serviço
            const result = await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            console.log('Registro bem-sucedido:', result);
            handleClose();
            window.location.reload(); // Recarrega a página para atualizar o estado de autenticação
        } catch (error) {
            console.error('Erro no registro:', error);
            setError(error.response?.data?.message || 'Erro ao registar. Tente novamente.');
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
                <Modal.Title>Registar no FilmesFlix</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
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
                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
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
                        {loading ? 'A registar...' : 'Registar'}
                    </Button>
                    <div className="text-center">
                        <p className="mb-0">Já tem uma conta?</p>
                        <Button variant="link" onClick={switchToLogin}>
                            Entrar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
} 