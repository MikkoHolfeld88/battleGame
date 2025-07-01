import React, { useState } from 'react';
import { useAuth } from '@/frontend/context/AuthContext';
import FormField from '@/frontend/components/common/FormField';
import Button from '@/frontend/components/common/Button';

interface LoginFormProps {
  onSuccess?: () => void; // Callback on successful login
  onForgotPassword?: () => void; // Callback to switch to forgot password view
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // User will be redirected or UI will change based on AuthContext state update
      console.log('Login successful from form');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Firebase errors: auth/user-not-found, auth/wrong-password, auth/invalid-email
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to log in. Please try again.');
      }
      console.error('Login form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', backgroundColor: '#3a3f47', borderRadius: '8px'}}>
      <h2 style={{textAlign: 'center', color: '#61dafb'}}>Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <FormField
        label="Email"
        type="email"
        id="login-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormField
        label="Password"
        type="password"
        id="login-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} style={{width: '100%', marginBottom: '1rem'}}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      {onForgotPassword && (
         <Button type="button" variant="secondary" onClick={onForgotPassword} disabled={loading} style={{width: '100%'}}>
            Forgot Password?
        </Button>
      )}
    </form>
  );
};

export default LoginForm;
