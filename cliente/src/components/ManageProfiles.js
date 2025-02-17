import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Array de avatares de desenhos animados usando DiceBear API
const avatarOptions = [
    { id: 1, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=1' },
    { id: 2, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=2' },
    { id: 3, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=3' },
    { id: 4, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=4' },
    { id: 5, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=5' },
    { id: 6, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=6' },
    { id: 7, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=7' },
    { id: 8, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=8' },
    { id: 9, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=9' },
    { id: 10, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=10' },
    { id: 11, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=11' },
    { id: 12, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=12' }
];

export default function ManageProfiles() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [editingProfile, setEditingProfile] = useState(null);
    const [showAvatarSelector, setShowAvatarSelector] = useState(false);
    const [editedName, setEditedName] = useState('');

    useEffect(() => {
        const savedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
        setProfiles(savedProfiles);
    }, []);

    const saveProfiles = (updatedProfiles) => {
        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
        setProfiles(updatedProfiles);
    };

    const handleEditProfile = (profile) => {
        setEditingProfile(profile);
        setEditedName(profile.name);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        const updatedProfiles = profiles.map(p => 
            p.id === editingProfile.id 
                ? { ...editingProfile, name: editedName }
                : p
        );
        saveProfiles(updatedProfiles);
        setEditingProfile(null);
        
        // Atualizar o perfil atual se for o mesmo que está sendo editado
        const currentProfile = JSON.parse(localStorage.getItem('currentProfile'));
        if (currentProfile && currentProfile.id === editingProfile.id) {
            localStorage.setItem('currentProfile', JSON.stringify({
                ...currentProfile,
                name: editedName,
                avatar: editingProfile.avatar
            }));
        }
    };

    const handleAvatarSelect = (avatarUrl) => {
        setEditingProfile(prev => ({
            ...prev,
            avatar: avatarUrl
        }));
        setShowAvatarSelector(false);
    };

    const handleCancel = () => {
        setEditingProfile(null);
        setEditedName('');
    };

    return (
        <div className="manage-profiles py-5" style={{ minHeight: '100vh', backgroundColor: '#141414' }}>
            <div className="container">
                <h1 className="text-center text-white mb-5">Gerenciar Perfis</h1>
                
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {profiles.map(profile => (
                            <div key={profile.id} 
                                className="profile-edit-item mb-4 p-4 rounded" 
                                style={{ backgroundColor: '#242424' }}
                            >
                                {editingProfile?.id === profile.id ? (
                                    <form onSubmit={handleSaveProfile} className="edit-profile-form">
                                        <div className="d-flex align-items-center gap-4">
                                            <div className="position-relative">
                                                <img
                                                    src={editingProfile.avatar}
                                                    alt="Avatar"
                                                    className="rounded-circle avatar-preview"
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px',
                                                        cursor: 'pointer',
                                                        border: `3px solid ${editingProfile.color}`
                                                    }}
                                                    onClick={() => setShowAvatarSelector(true)}
                                                />
                                                <div className="avatar-edit-badge">
                                                    <i className="bi bi-pencil-fill"></i>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-grow-1">
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-white border-0"
                                                    value={editedName}
                                                    onChange={(e) => setEditedName(e.target.value)}
                                                    placeholder="Nome do perfil"
                                                />
                                            </div>
                                            
                                            <div className="d-flex gap-2">
                                                <button type="submit" className="btn btn-primary">
                                                    <i className="bi bi-check-lg me-2"></i>
                                                    Salvar
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-secondary"
                                                    onClick={handleCancel}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="rounded-circle"
                                            style={{ 
                                                width: '100px', 
                                                height: '100px',
                                                border: `3px solid ${profile.color}`
                                            }}
                                        />
                                        <h5 className="ms-4 mb-0 flex-grow-1 text-white">
                                            {profile.name}
                                        </h5>
                                        <button 
                                            className="btn btn-outline-light"
                                            onClick={() => handleEditProfile(profile)}
                                        >
                                            <i className="bi bi-pencil me-2"></i>
                                            Editar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal de seleção de avatar */}
                {showAvatarSelector && (
                    <div className="avatar-modal">
                        <div className="avatar-modal-content">
                            <h3 className="text-white mb-4">Escolher Avatar</h3>
                            <div className="avatar-grid">
                                {avatarOptions.map((avatar) => (
                                    <img
                                        key={avatar.id}
                                        src={avatar.url}
                                        alt="Avatar option"
                                        className="avatar-option"
                                        onClick={() => handleAvatarSelect(avatar.url)}
                                    />
                                ))}
                            </div>
                            <button 
                                className="btn btn-secondary mt-4"
                                onClick={() => setShowAvatarSelector(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className="text-center mt-5">
                    <button 
                        className="btn btn-outline-light px-4 py-2"
                        onClick={() => navigate('/profiles')}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Voltar para Perfis
                    </button>
                </div>
            </div>
        </div>
    );
} 