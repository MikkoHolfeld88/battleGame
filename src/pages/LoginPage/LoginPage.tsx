import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../auth/AuthContext';
import { HOME_PATH } from '../../routes';
import { Button, Container, Paper, Typography, Box, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { showSnackbar } from '../../store/slices/snackbarSlice'; // Import showSnackbar action

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, loading } = useAuth();
  const dispatch = useDispatch(); // Initialize useDispatch

  const [error, setError] = React.useState<string | null>(null); // For local error display
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const from = location.state?.from?.pathname || HOME_PATH;

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Logged in user:', user);
      dispatch(showSnackbar({
        title: 'Login Successful',
        message: `Welcome back, ${user.displayName || 'User'}!`,
        severity: 'success'
      }));
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      const errorMessage = err.message || 'Failed to sign in with Google. Please try again.';
      setError(errorMessage); // Set local error for display within login form
      dispatch(showSnackbar({
        title: 'Login Failed',
        message: errorMessage,
        severity: 'error'
      }));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If user is already logged in (and not in auth loading state), redirect them.
  // This is also handled by PublicOnlyRoute in App.tsx, but good for robustness.
  React.useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, loading, navigate, from]);

  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography sx={{ml: 2}}>Verifying session...</Typography>
        </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Paper elevation={6} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -8 }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Login
        </Typography>
        {error && ( // Display error directly in the form as well
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isLoggingIn || isLoggedIn} // Disable if already logged in too
          sx={{ py: 1.5 }}
        >
          {isLoggingIn ? 'Logging in...' : 'Sign In with Google'}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{mt: 3}}>
            You will be redirected after successful login.
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
