import React, { useState } from 'react';
import { useAuth } from '@/frontend/context/AuthContext';
import FormField from '@/frontend/components/common/FormField';
import Button from '@/frontend/components/common/Button';

interface ForgotPasswordFormProps {
  onSuccess?: () => void; // Callback on successful email submission
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage('Password reset email sent! Please check your inbox.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No user found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      }else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
      console.error('Forgot password form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', backgroundColor: '#3a3f47', borderRadius: '8px'}}>
      <h2 style={{textAlign: 'center', color: '#61dafb'}}>Forgot Password</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
      <FormField
        label="Email Address"
        type="email"
        id="forgot-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} style={{width: '100%'}}>
        {loading ? 'Sending...' : 'Send Reset Email'}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
