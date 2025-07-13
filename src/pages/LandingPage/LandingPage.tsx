import React from 'react';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import Header from '../../components/Layout/Header';
import { AllPhasesGrid } from '../../components/LandingPage/Phases/PhaseCard';
import { useTranslation } from 'react-i18next';
import BlogSection from '../../components/LandingPage/BlogSection';
import Footer from '../../components/Layout/Footer'; // Import the new Footer component
import { useNavigate, useLocation } from "react-router-dom";
import { GAME_START_PATH, BLOG_BASE_PATH } from "../../routes";

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const startPlaying = () => {
        navigate(GAME_START_PATH, { replace: true });
    };

    // Check if the current path is a blog post path
    const isBlogPostView = location.pathname.startsWith(BLOG_BASE_PATH);

    if (isBlogPostView) {
        // Render only the blog section for blog post views
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
                <Header />
                <Container component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
                    <BlogSection />
                </Container>
                <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper', borderTop: '2px solid #ddd' }}>
                    <Container maxWidth="lg">
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontFamily: "'VT323', monospace" }}>
                            {t('landingPage.footer.copyright', { year: new Date().getFullYear() })}
                        </Typography>
                    </Container>
                </Box>
            </Box>
        );
    }

    // Render the full landing page
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />

            <Paper
                elevation={0}
                square
                sx={{
                    py: { xs: 4, md: 8 },
                    textAlign: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderBottom: `4px solid #000`
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h6" component="h6" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                        {t('landingPage.hero.title')}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            mr: { xs: 0, sm: 1 },
                            mb: { xs: 1, sm: 0 },
                            width: { xs: '100%', sm: 'auto' },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            py: { xs: 0.8, sm: 1 },
                        }}
                        onClick={startPlaying}>
                        <Typography variant="h5">
                            {t('landingPage.hero.playingNow', 'Playing Now')}
                        </Typography>
                    </Button>
                    <Typography variant="h5" component="p" sx={{ fontFamily: "'VT323', monospace", fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                        {t('landingPage.hero.subtitle')}
                    </Typography>
                </Container>
            </Paper>

            <Container component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
                <Typography variant="h3" component="p" sx={{ fontWeight: "light", color: "grey" }}>
                    {t('landingPage.phases.header')}
                </Typography>
                <AllPhasesGrid />
                <BlogSection />
            </Container>

            <Footer />
        </Box>
    );
};

export default LandingPage;
