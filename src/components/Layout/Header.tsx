import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Modal, TextField, Stack, IconButton, Avatar, Menu, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Google as GoogleIcon, Email as EmailIcon, Close as CloseIcon, AccountCircle } from '@mui/icons-material';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'; // Import LanguageSwitcher
import { auth, googleProvider } from '../../firebaseConfig'; // Ensure this path is correct
import { useTranslation } from 'react-i18next'; // Import useTranslation
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
  const { t } = useTranslation(); // Initialize useTranslation
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
      setSnackbar({ open: true, message: t('logout.success'), severity: 'success' });
    } catch (error: any) {
      console.error('Logout error:', error);
      setSnackbar({ open: true, message: t('logout.failure', { message: error.message }), severity: 'error' });
    }
    setAuthLoading(false);
  };

  const validateForm = (): boolean => {
    let valid = true;
    if (!email) {
      setEmailError(t('validation.emailRequired'));
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t('validation.emailInvalid'));
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError(t('validation.passwordRequired'));
      valid = false;
    } else if (password.length < 6) {
      setPasswordError(t('validation.passwordMinLength', { length: 6 }));
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
        setSnackbar({ open: true, message: t('login.emailSuccess'), severity: 'success' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setSnackbar({ open: true, message: t('signup.emailSuccess'), severity: 'success' });
        // Consider auto-login or redirect after signup if desired
      }
      handleCloseAuthModal();
    } catch (error: any) {
      console.error('Email auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setEmailError(t('validation.emailInUse'));
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setSnackbar({ open: true, message: t('login.invalidCredentials'), severity: 'error' });
      } else {
        setSnackbar({ open: true, message: t('error.general', { message: error.message }), severity: 'error' });
      }
    }
    setAuthLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSnackbar({ open: true, message: t('login.googleSuccess'), severity: 'success' });
      handleCloseAuthModal(); // Close modal if it was open for email
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setSnackbar({ open: true, message: t('login.googleFailure', { message: error.message }), severity: 'error' });
    }
    setAuthLoading(false);
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (event && event.defaultPrevented) {
      return; // Ignore the event if it has already been handled
    }

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
            {t('header.title')}
          </Typography>
          <CircularProgress color="inherit" size={24} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '3px solid #333' }}>
        <Toolbar sx={{
          flexWrap: 'wrap', // Allow items to wrap on smaller screens
          justifyContent: 'space-between', // Distribute space
          px: { xs: 1, sm: 2 } // Reduce padding on xs screens
        }}>
          <Typography
            variant="h1"
            component="div"
            sx={{
              flexGrow: {sm: 1}, // Allow title to grow on sm+ screens
              fontSize: {xs: '1.5rem', sm: '1.8rem'}, // Slightly smaller title on xs
              textAlign: {xs: 'center', sm: 'left'}, // Center title on xs if it wraps alone
              width: {xs: '100%', sm: 'auto'}, // Full width on xs if other items wrap
              mb: {xs: 1, sm: 0} // Margin bottom if items wrap
            }}
          >
            {t('header.title')}
          </Typography>
          {/* Box to group switcher and auth controls for better wrapping behavior */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', ml: {xs: 'auto', sm: 0}, mr: {xs: 'auto', sm: 0} }}>
            <LanguageSwitcher /> {/* Add LanguageSwitcher component here */}
            {user ? (
            <>
              <IconButton onClick={handleUserMenuOpen} color="inherit" sx={{ ml: 1 }}> {/* Added ml: 1 for spacing */}
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
                  {authLoading ? <CircularProgress size={20} sx={{mr:1}}/> : null} {t('header.logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' }, // Stack on xs, row on sm and up
              alignItems: 'center', // Center items when stacked
            }}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleGoogleSignIn}
                startIcon={<GoogleIcon />}
                sx={{
                  mr: { xs: 0, sm: 1 }, // No margin right on xs, 1 on sm and up
                  mb: { xs: 1, sm: 0 }, // Margin bottom on xs, 0 on sm and up
                  width: { xs: '100%', sm: 'auto' }, // Full width on xs
                  fontSize: {xs: '0.75rem', sm: '0.875rem'}, // Smaller font on xs
                  py: {xs: 0.8, sm: 1}, // Adjust padding
                }}
                disabled={authLoading}
              >
                {t('header.googleSignIn')}
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => handleOpenAuthModal(true)}
                startIcon={<EmailIcon />}
                sx={{
                  width: { xs: '100%', sm: 'auto' }, // Full width on xs
                  fontSize: {xs: '0.75rem', sm: '0.875rem'}, // Smaller font on xs
                  py: {xs: 0.8, sm: 1}, // Adjust padding
                }}
                disabled={authLoading}
              >
                {t('header.emailSignIn')}
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
            aria-label={t('aria.closeModal')}
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
            {isLogin ? t('authModal.loginTitle') : t('authModal.signUpTitle')}
          </Typography>
          <Stack spacing={2}>
            <TextField
              label={t('authModal.emailLabel')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              fullWidth
              disabled={authLoading}
            />
            <TextField
              label={t('authModal.passwordLabel')}
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
              {authLoading ? <CircularProgress size={24} color="inherit"/> : (isLogin ? t('authModal.loginButton') : t('authModal.signUpButton'))}
            </Button>
            <Button
              variant="text"
              onClick={() => setIsLogin(!isLogin)}
              fullWidth
              disabled={authLoading}
              sx={{ fontFamily: "'VT323', monospace" }}
            >
              {isLogin ? t('authModal.switchToSignUp') : t('authModal.switchToLogin')}
            </Button>
            <Typography sx={{ textAlign: 'center', my:1, fontFamily: "'VT323', monospace" }}>{t('authModal.orSeparator')}</Typography>
            <Button
                variant="outlined"
                onClick={handleGoogleSignIn}
                startIcon={<GoogleIcon />}
                fullWidth
                disabled={authLoading}
              >
                {authLoading && !isLogin ? <CircularProgress size={24} color="inherit"/> : t('authModal.googleContinue')}
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
