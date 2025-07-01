import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/frontend/context/AuthContext';
import RegisterForm from '@/frontend/components/auth/RegisterForm';
import LoginForm from '@/frontend/components/auth/LoginForm';
import ForgotPasswordForm from '@/frontend/components/auth/ForgotPasswordForm';
import AuthStatus from '@/frontend/components/auth/AuthStatus';
import Button from './components/common/Button'; // Re-using our button

type AuthView = 'login' | 'register' | 'forgotPassword';

const AppContent: React.FC = () => {
  const { currentAppUser, loading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.5rem'}}>Loading Application...</div>;
  }

  if (currentAppUser) {
    return (
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <AuthStatus />
        {/* Placeholder for game content */}
        <div style={{marginTop: '2rem', padding: '1rem', backgroundColor: '#333', borderRadius: '8px'}}>
            <h2>Game Area</h2>
            <p>Hello, {currentAppUser.username}! Your ELO is {currentAppUser.elo}.</p>
            <p>Your player ID: {currentAppUser.id}</p>
            <p>More game content will go here.</p>
        </div>
      </div>
    );
  }

  // User is not logged in, show auth forms
  return (
    <div style={{maxWidth: '450px', margin: 'auto'}}>
      {authView === 'login' && (
        <>
          <LoginForm
            onSuccess={() => console.log("Login success from App.tsx")}
            onForgotPassword={() => setAuthView('forgotPassword')}
          />
          <div style={{textAlign: 'center', marginTop: '1rem'}}>
            <p>
                Don't have an account?{' '}
                <Button variant="secondary" onClick={() => setAuthView('register')}>Register here</Button>
            </p>
          </div>
        </>
      )}
      {authView === 'register' && (
        <>
          <RegisterForm onSuccess={() => setAuthView('login')} />
          <div style={{textAlign: 'center', marginTop: '1rem'}}>
            <p>
                Already have an account?{' '}
                <Button variant="secondary" onClick={() => setAuthView('login')}>Login here</Button>
            </p>
          </div>
        </>
      )}
      {authView === 'forgotPassword' && (
        <>
          <ForgotPasswordForm onSuccess={() => setAuthView('login')} />
          <div style={{textAlign: 'center', marginTop: '1rem'}}>
            <Button variant="secondary" onClick={() => setAuthView('login')}>Back to Login</Button>
          </div>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div style={{ padding: '20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{color: '#61dafb', fontSize: '2.5rem'}}>Battle Game</h1>
        </header>
        <main>
          <AppContent />
        </main>
        <footer style={{textAlign: 'center', marginTop: '3rem', color: '#aaa', fontSize: '0.9rem'}}>
            <p>&copy; {new Date().getFullYear()} Battle Game Project. All rights reserved (not really).</p>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
