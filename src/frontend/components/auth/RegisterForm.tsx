import React, { useState } from 'react';
import { useAuth } from '@/frontend/context/AuthContext';
import FormField from '@/frontend/components/common/FormField';
import Button from '@/frontend/components/common/Button';

interface RegisterFormProps {
  onSuccess?: () => void; // Callback on successful registration
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    if (username.trim().length < 3) {
        setError("Username should be at least 3 characters long.");
        return;
    }

    setLoading(true);
    try {
      await register(email, password, username);
      // User will be redirected or UI will change based on AuthContext state update
      console.log('Registration successful from form');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Firebase errors often have a 'code' property
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
      console.error('Registration form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', backgroundColor: '#3a3f47', borderRadius: '8px'}}>
      <h2 style={{textAlign: 'center', color: '#61dafb'}}>Register</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <FormField
        label="Username"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <FormField
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <FormField
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <FormField
        label="Confirm Password"
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} style={{width: '100%'}}>
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
