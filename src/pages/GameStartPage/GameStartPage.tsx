import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, Paper, Typography} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import {useTranslation} from 'react-i18next';
import {signOut} from 'firebase/auth';
import {auth} from '../../firebaseConfig';
import {GAME_CONTAINER_PATH, LOGIN_PATH} from '../../routes';
import {useDispatch} from 'react-redux';
import {showSnackbar} from '../../store/slices/snackbarSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import Footer from '../../components/Layout/Footer'; // Import the new Footer component

// Placeholder images - replace with actual paths or import statements if available
const placeholderImage1 = 'https://via.placeholder.com/300x200.png?text=Exciting+Game+Scene+1';
const placeholderImage2 = 'https://via.placeholder.com/300x200.png?text=Game+Feature+Highlight';

const GameStartPage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const handleStartGame = () => {
        navigate(GAME_CONTAINER_PATH);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(showSnackbar({
                title: t('snackbar.logoutSuccessTitle', 'Logged Out'),
                message: t('snackbar.logoutSuccessMessage', 'You have been successfully logged out.'),
                severity: 'success'
            }));
            navigate(LOGIN_PATH, {replace: true});
        } catch (error: any) {
            console.error("Logout Error:", error);
            dispatch(showSnackbar({
                title: t('snackbar.logoutErrorTitle', 'Logout Failed'),
                message: error.message || t('snackbar.logoutErrorMessage', 'An error occurred during logout.'),
                severity: 'error'
            }));
        }
    };

    // @ts-ignore
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <Container component="main" maxWidth="md" sx={{mt: 8, mb: 4, flexGrow: 1, position: 'relative'}}>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<LogoutIcon/>}
                    onClick={handleLogout}
                    sx={{position: 'absolute', top: 0, right: 16, zIndex: 1}}
                >
                    {t('gameStartPage.logoutButton', 'Logout')}
                </Button>
                <Paper elevation={3} sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2 /* Add margin top to not be overlapped by button */
                }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{textAlign: 'center'}}>
                        {t('gameStartPage.title', 'Welcome to the Game!')}
                    </Typography>

                    <Typography variant="h5" component="p" sx={{mt: 2, mb: 3, textAlign: 'center'}}>
                        {t('gameStartPage.intro', 'Get ready for an exciting adventure. Click the button below to begin your journey.')}
                    </Typography>

                    <Box sx={{my: 4}}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleStartGame}
                            sx={{minWidth: '200px', py: 1.5, fontSize: '1.2rem'}}
                        >
                            {t('gameStartPage.startGameButton', 'Start Game')}
                        </Button>
                    </Box>

                    <Grid2 container spacing={4} sx={{mt: 3, justifyContent: 'center'}}>
                        <Grid2 size={{xs: 12, sm: 6, md: 5}}>
                            <Box sx={{textAlign: 'center'}}>
                                <img src={placeholderImage1} alt={t('gameStartPage.imageAlt1', 'Exciting game scene')}
                                     style={{maxWidth: '100%', borderRadius: '8px'}}/>
                                <Typography variant="body1" sx={{mt: 1}}>
                                    {t('gameStartPage.imageCaption1', 'Explore vast worlds and uncover secrets.')}
                                </Typography>
                            </Box>
                        </Grid2>
                        <Grid2 size={{xs: 12, sm: 6, md: 5}}>
                            <Box sx={{textAlign: 'center'}}>
                                <img src={placeholderImage2}
                                     alt={t('gameStartPage.imageAlt2', 'Game feature highlight')}
                                     style={{maxWidth: '100%', borderRadius: '8px'}}/>
                                <Typography variant="body1" sx={{mt: 1}}>
                                    {t('gameStartPage.imageCaption2', 'Master unique abilities and challenges.')}
                                </Typography>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Paper>
            </Container>

            <Footer/>
        </Box>
    );
};

export default GameStartPage;
