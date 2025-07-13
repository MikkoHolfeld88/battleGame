import React from 'react';
import {Box, Button, Container, Paper, Typography} from '@mui/material';
import Header from '../../components/Layout/Header';
import {AllPhasesGrid} from '../../components/LandingPage/Phases/PhaseCard'; // Import the grid component
import {useTranslation} from 'react-i18next';
import BlogSection from '../../components/LandingPage/BlogSection';
import {useNavigate} from "react-router-dom";
import {GAME_START_PATH} from "../../routes";
import Footer from '../../components/Layout/Footer'; // Import the new Footer component

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    const startPlaying = () => {
        navigate(GAME_START_PATH, {replace: true})
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default'}}>
            <Header/>

            <Paper
                elevation={0}
                square
                sx={{
                    py: {xs: 4, md: 8}, // Responsive padding
                    textAlign: 'center',
                    backgroundColor: 'primary.main', // Using primary color from theme
                    color: 'primary.contrastText', // Text color that contrasts with primary
                    // backgroundImage: `url(placeholder_hero_bg.png)`, // Optional: if you want a subtle pattern or image
                    // backgroundSize: 'cover',
                    // backgroundPosition: 'center',
                    borderBottom: `4px solid #000` // Pixel border
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h6" component="h6" gutterBottom sx={{fontSize: {xs: '2.5rem', md: '3.5rem'}}}>
                        {t('landingPage.hero.title')}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            mr: {xs: 0, sm: 1},
                            mb: {xs: 1, sm: 0},
                            width: {xs: '100%', sm: 'auto'},
                            fontSize: {xs: '0.75rem', sm: '0.875rem'},
                            py: {xs: 0.8, sm: 1},
                        }}
                        onClick={startPlaying}>
                        <Typography variant="h5">
                            {t('landingPage.hero.playingNow', 'Playing Now')}
                        </Typography>
                    </Button>
                    <Typography variant="h5" component="p"
                                sx={{fontFamily: "'VT323', monospace", fontSize: {xs: '1.2rem', md: '1.5rem'}}}>
                        {t('landingPage.hero.subtitle')}
                    </Typography>
                </Container>
            </Paper>

            <Container component="main" sx={{flexGrow: 1, py: {xs: 3, md: 5}}}>
                <Typography variant="h3" component="p" sx={{fontWeight: "light", color: "grey"}}>
                    {t('landingPage.phases.header')}
                </Typography>
                <AllPhasesGrid/> {/* This component already has its own title and padding */}
                <BlogSection/> {/* This component also has its own title and padding */}
            </Container>

            <Footer />
        </Box>
    );
};

export default LandingPage;
