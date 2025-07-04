import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Modal, TextField, Stack, IconButton, Avatar, Menu, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Google as GoogleIcon, Email as EmailIcon, Close as CloseIcon, AccountCircle } from '@mui/icons-material';
import { auth, googleProvider } from '../../firebaseConfig'; // Ensure this path is correct
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000', // Matches theme MuiCard border
  boxShadow: '4px 4px 0px #aaaaaa', // Matches theme MuiCard boxShadow
  p: 4,
};

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true for login, false for signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenAuthModal = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setOpenAuthModal(true);
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
  };

  const handleCloseAuthModal = () => {
    setOpenAuthModal(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      handleUserMenuClose();
      setSnackbar({ open: true, message: 'Logged out successfully.', severity: 'success' });
    } catch (error: any) {
      console.error('Logout error:', error);
      setSnackbar({ open: true, message: `Logout failed: ${error.message}`, severity: 'error' });
    }
    setAuthLoading(false);
  };

  const validateForm = (): boolean => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleEmailAuth = async () => {
    if (!validateForm()) return;
    setAuthLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSnackbar({ open: true, message: 'Logged in successfully!', severity: 'success' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSnackbar({ open: true, message: 'Account created successfully! Please log in.', severity: 'success' });
        // Consider auto-login or redirect after signup if desired
      }
      handleCloseAuthModal();
    } catch (error: any) {
      console.error('Email auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email is already in use. Try logging in.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setSnackbar({ open: true, message: 'Invalid email or password.', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' });
      }
    }
    setAuthLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSnackbar({ open: true, message: 'Logged in with Google successfully!', severity: 'success' });
      handleCloseAuthModal(); // Close modal if it was open for email
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setSnackbar({ open: true, message: `Google Sign-In failed: ${error.message}`, severity: 'error' });
    }
    setAuthLoading(false);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "'Press Start 2P', cursive" }}>
            BattleGame
          </Typography>
          <CircularProgress color="inherit" size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '3px solid #333' }}>
        <Toolbar>
          <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontSize: '1.8rem' /* Adjusted in theme, but can override */ }}>
            BattleGame
          </Typography>
          {user ? (
            <>
              <IconButton onClick={handleUserMenuOpen} color="inherit">
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontFamily: "'Press Start 2P', cursive" }}>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : <AccountCircle />)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'user-menu-button',
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 0,
                        border: '2px solid #333',
                        boxShadow: '3px 3px 0px #aaaaaa',
                        mt: 1
                    }
                }}
              >
                <MenuItem disabled sx={{ fontFamily: "'VT323', monospace" }}>{user.displayName || user.email}</MenuItem>
                {/* Add other menu items like "Profile", "Settings" here if needed */}
                <MenuItem onClick={handleLogout} sx={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9rem' }} disabled={authLoading}>
                  {authLoading ? <CircularProgress size={20} sx={{mr:1}}/> : null} Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button
                color="primary"
                variant="contained"
                onClick={handleGoogleSignIn}
                startIcon={<GoogleIcon />}
                sx={{ mr: 1 }}
                disabled={authLoading}
              >
                Google
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => handleOpenAuthModal(true)}
                startIcon={<EmailIcon />}
                disabled={authLoading}
              >
                Email
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Modal
        open={openAuthModal}
        onClose={handleCloseAuthModal}
        aria-labelledby="auth-modal-title"
      >
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={handleCloseAuthModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="auth-modal-title" variant="h3" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              fullWidth
              disabled={authLoading}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              disabled={authLoading}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEmailAuth}
              fullWidth
              disabled={authLoading}
              sx={{ mt: 1, py: 1.5 }}
            >
              {authLoading ? <CircularProgress size={24} color="inherit"/> : (isLogin ? 'Login' : 'Sign Up')}
            </Button>
            <Button
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
              fullWidth
              disabled={authLoading}
              sx={{ fontFamily: "'VT323', monospace" }}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Button>
            <Typography sx={{ textAlign: 'center', my:1, fontFamily: "'VT323', monospace" }}>OR</Typography>
            <Button
                variant="outlined"
                onClick={handleGoogleSignIn}
                startIcon={<GoogleIcon />}
                fullWidth
                disabled={authLoading}
              >
                {authLoading && !isLogin ? <CircularProgress size={24} color="inherit"/> : `Continue with Google`}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', fontFamily: "'VT323', monospace", border: '2px solid', borderRadius:0 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
