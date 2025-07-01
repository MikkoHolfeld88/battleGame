import React from 'react';
import { useAuth } from '@/frontend/context/AuthContext';
import Button from '@/frontend/components/common/Button';

const AuthStatus: React.FC = () => {
  const { currentAppUser, logout, loading } = useAuth();

  if (loading) {
    return <p>Loading user status...</p>;
  }

  if (!currentAppUser) {
    // This component might not be rendered if user is not logged in,
    // depending on routing in App.tsx.
    // Or it could show "You are not logged in."
    return null;
  }

  return (
    <div style={{ padding: '1rem', backgroundColor: '#3a3f47', borderRadius: '8px', textAlign: 'center', marginTop: '1rem' }}>
      <p style={{margin: '0 0 1rem 0'}}>
        Welcome, <strong style={{color: '#61dafb'}}>{currentAppUser.username || currentAppUser.email}</strong>!
        (ELO: {currentAppUser.elo})
      </p>
      {currentAppUser.profileImageUrl && (
        <img
            src={currentAppUser.profileImageUrl}
            alt={`${currentAppUser.username}'s avatar`}
            style={{width: '50px', height: '50px', borderRadius: '50%', marginBottom: '1rem'}}
        />
      )}
      <Button onClick={logout} disabled={loading} variant="secondary">
        {loading ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
};

export default AuthStatus;
