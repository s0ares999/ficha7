import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultProfiles = [
    {
        id: 1,
        name: 'Utilizador 1',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=1',
        color: '#E50914'
    },
    {
        id: 2,
        name: 'Utilizador 2',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
        color: '#17B187'
    },
    {
        id: 3,
        name: 'Utilizador 3',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=3',
        color: '#4B7BEC'
    },
    {
        id: 4,
        name: 'Utilizador 4',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=4',
        color: '#FFA502'
    },
    {
        id: 5,
        name: 'Utilizador 5',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=5',
        color: '#9B59B6'
    }
];

export default function ProfileSelector() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [hoveredProfile, setHoveredProfile] = useState(null);

    useEffect(() => {
        // Carregar perfis do localStorage ou usar os perfis padrão
        const savedProfiles = JSON.parse(localStorage.getItem('profiles'));
        if (!savedProfiles) {
            localStorage.setItem('profiles', JSON.stringify(defaultProfiles));
            setProfiles(defaultProfiles);
        } else {
            setProfiles(savedProfiles);
        }
    }, []);

    const selectProfile = (profile) => {
        localStorage.setItem('currentProfile', JSON.stringify(profile));
        navigate('/');
    };

    return (
        <div className="profile-selector">
            <div className="container">
                <h1 className="text-center mb-5">Quem está a assistir?</h1>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="d-flex flex-wrap justify-content-center gap-4">
                            {profiles.map((profile) => (
                                <div
                                    key={profile.id}
                                    className="profile-item text-center"
                                    onMouseEnter={() => setHoveredProfile(profile.id)}
                                    onMouseLeave={() => setHoveredProfile(null)}
                                    onClick={() => selectProfile(profile)}
                                >
                                    <div 
                                        className="profile-avatar mb-3"
                                        style={{
                                            transform: hoveredProfile === profile.id ? 'scale(1.1)' : 'scale(1)',
                                            border: hoveredProfile === profile.id ? `4px solid ${profile.color}` : '4px solid transparent'
                                        }}
                                    >
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="rounded-circle w-100 h-100"
                                        />
                                    </div>
                                    <h5 
                                        className="profile-name"
                                        style={{
                                            color: hoveredProfile === profile.id ? profile.color : '#fff'
                                        }}
                                    >
                                        {profile.name}
                                    </h5>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <button 
                                onClick={() => navigate('/manage-profiles')}
                                className="btn btn-outline-light px-4 py-2"
                            >
                                Gerir Perfis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 