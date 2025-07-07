import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Modal,
    TextField,
    Stack,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Google as GoogleIcon,
    Email as EmailIcon,
    Close as CloseIcon,
    AccountCircle,
} from '@mui/icons-material';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { auth, googleProvider } from '../../firebaseConfig';
import { useTranslation } from 'react-i18next';
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    User,
} from 'firebase/auth';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: '4px 4px 0px #aaaaaa',
    p: 4,
};

const Header: React.FC = () => {
    const { t } = useTranslation();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info' as 'success' | 'error' | 'info' | 'warning',
    });

    const userMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
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

    const handleCloseAuthModal = () => setOpenAuthModal(false);
    const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleUserMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        setAuthLoading(true);
        try {
            await signOut(auth);
            handleUserMenuClose();
            setSnackbar({ open: true, message: t('logout.success'), severity: 'success' });
        } catch (error: any) {
            console.error('Logout error:', error);
            setSnackbar({
                open: true,
                message: t('logout.failure', { message: error.message }),
                severity: 'error',
            });
        } finally {
            setAuthLoading(false);
        }
    };

    const validateForm = () => {
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
            }
            handleCloseAuthModal();
        } catch (error: any) {
            console.error('Email auth error:', error);
            if (error.code === 'auth/email-already-in-use') {
                setEmailError(t('validation.emailInUse'));
            } else if (
                ['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(
                    error.code,
                )
            ) {
                setSnackbar({ open: true, message: t('login.invalidCredentials'), severity: 'error' });
            } else {
                setSnackbar({
                    open: true,
                    message: t('error.general', { message: error.message }),
                    severity: 'error',
                });
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setAuthLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            setSnackbar({ open: true, message: t('login.googleSuccess'), severity: 'success' });
            handleCloseAuthModal();
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            setSnackbar({
                open: true,
                message: t('login.googleFailure', { message: error.message }),
                severity: 'error',
            });
        } finally {
            setAuthLoading(false);
        }
    };

    const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, fontFamily: "'Press Start 2P', cursive" }}
                    >
                        {t('header.title')}
                    </Typography>
                    <CircularProgress color="inherit" size={24} />
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{ borderBottom: '3px solid #333' }}
            >
                <Toolbar
                    sx={{
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            flexGrow: { sm: 1 },
                            fontSize: { xs: '1.5rem', sm: '1.8rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                            width: { xs: '100%', sm: 'auto' },
                            mb: { xs: 1, sm: 0 },
                        }}
                    >
                        {t('header.title')}
                    </Typography>

                    {/* controls */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'nowrap',
                            ml: { xs: 'auto', sm: 0 },
                            mr: { xs: 'auto', sm: 0 },
                        }}
                    >
                        <LanguageSwitcher />

                        {user ? (
                            <>
                                <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.main',
                                            width: 32,
                                            height: 32,
                                            fontFamily: "'Press Start 2P', cursive",
                                        }}
                                    >
                                        {user.displayName
                                            ? user.displayName[0].toUpperCase()
                                            : user.email?.[0].toUpperCase() || <AccountCircle />}
                                    </Avatar>
                                </IconButton>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={userMenuOpen}
                                    onClose={handleUserMenuClose}
                                    PaperProps={{
                                        sx: {
                                            borderRadius: 0,
                                            border: '2px solid #333',
                                            boxShadow: '3px 3px 0px #aaaaaa',
                                            mt: 1,
                                        },
                                    }}
                                >
                                    <MenuItem disabled sx={{ fontFamily: "'VT323', monospace" }}>
                                        {user.displayName || user.email}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={handleLogout}
                                        disabled={authLoading}
                                        sx={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.9rem' }}
                                    >
                                        {authLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                                        {t('header.logout')}
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: 'center',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleSignIn}
                                    disabled={authLoading}
                                    sx={{
                                        mr: { xs: 0, sm: 1 },
                                        mb: { xs: 1, sm: 0 },
                                        width: { xs: '100%', sm: 'auto' },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        py: { xs: 0.8, sm: 1 },
                                    }}
                                >
                                    {t('header.googleSignIn')}
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<EmailIcon />}
                                    onClick={() => handleOpenAuthModal(true)}
                                    disabled={authLoading}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        py: { xs: 0.8, sm: 1 },
                                    }}
                                >
                                    {t('header.emailSignIn')}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* auth modal */}
            <Modal open={openAuthModal} onClose={handleCloseAuthModal}>
                <Box sx={modalStyle}>
                    <IconButton
                        aria-label={t('aria.closeModal')}
                        onClick={handleCloseAuthModal}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h3" sx={{ mb: 2, textAlign: 'center' }}>
                        {isLogin ? t('authModal.loginTitle') : t('authModal.signUpTitle')}
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label={t('authModal.emailLabel')}
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                            fullWidth
                            disabled={authLoading}
                        />

                        <TextField
                            label={t('authModal.passwordLabel')}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            fullWidth
                            disabled={authLoading}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleEmailAuth}
                            disabled={authLoading}
                            sx={{ mt: 1, py: 1.5 }}
                        >
                            {authLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : isLogin ? (
                                t('authModal.loginButton')
                            ) : (
                                t('authModal.signUpButton')
                            )}
                        </Button>

                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => setIsLogin(prev => !prev)}
                            disabled={authLoading}
                            sx={{ fontFamily: "'VT323', monospace" }}
                        >
                            {isLogin ? t('authModal.switchToSignUp') : t('authModal.switchToLogin')}
                        </Button>

                        <Typography sx={{ textAlign: 'center', my: 1, fontFamily: "'VT323', monospace" }}>
                            {t('authModal.orSeparator')}
                        </Typography>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={handleGoogleSignIn}
                            disabled={authLoading}
                        >
                            {!authLoading ? t('authModal.googleContinue') : <CircularProgress size={24} />}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%', fontFamily: "'VT323', monospace', border: '2px solid", borderRadius: 0 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Header;
