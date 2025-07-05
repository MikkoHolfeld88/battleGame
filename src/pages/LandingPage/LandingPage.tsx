import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import Header from '../../components/Layout/Header';
import { AllPhasesGrid } from '../../components/LandingPage/Phases/PhaseCard'; // Import the grid component
import { useTranslation } from 'react-i18next';
import BlogSection from '../../components/LandingPage/BlogSection';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      {/* Hero Section - Simple version using Paper and Typography */}
      <Paper
        elevation={0}
        square
        sx={{
          py: { xs: 4, md: 8 }, // Responsive padding
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
          <Typography variant="h1" component="h1" gutterBottom sx={{fontSize: {xs: '2.5rem', md: '3.5rem'}}}>
            {t('landingPage.hero.title')}
          </Typography>
          <Typography variant="h5" component="p" sx={{fontFamily: "'VT323', monospace", fontSize: {xs: '1.2rem', md: '1.5rem'}}}>
            {t('landingPage.hero.subtitle')}
          </Typography>
        </Container>
      </Paper>

      <Container component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 5 } }}>
        <AllPhasesGrid /> {/* This component already has its own title and padding */}
        <BlogSection />   {/* This component also has its own title and padding */}
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper', borderTop: '2px solid #ddd' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center" sx={{fontFamily: "'VT323', monospace"}}>
            {t('landingPage.footer.copyright', { year: new Date().getFullYear() })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
