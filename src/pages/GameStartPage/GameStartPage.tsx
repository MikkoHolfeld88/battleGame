import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GAME_CONTAINER_PATH } from '../../routes'; // Assuming routes.ts is in src

// Placeholder images - replace with actual paths or import statements if available
const placeholderImage1 = 'https://via.placeholder.com/300x200.png?text=Exciting+Game+Scene+1';
const placeholderImage2 = 'https://via.placeholder.com/300x200.png?text=Game+Feature+Highlight';

const GameStartPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStartGame = () => {
    navigate(GAME_CONTAINER_PATH);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          {t('gameStartPage.title', 'Welcome to the Game!')}
        </Typography>

        <Typography variant="h5" component="p" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
          {t('gameStartPage.intro', 'Get ready for an exciting adventure. Click the button below to begin your journey.')}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartGame}
            sx={{ minWidth: '200px', py: 1.5, fontSize: '1.2rem' }}
          >
            {t('gameStartPage.startGameButton', 'Start Game')}
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 3, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={5}>
            <Box sx={{ textAlign: 'center' }}>
              <img src={placeholderImage1} alt={t('gameStartPage.imageAlt1', 'Exciting game scene')} style={{ maxWidth: '100%', borderRadius: '8px' }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {t('gameStartPage.imageCaption1', 'Explore vast worlds and uncover secrets.')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <Box sx={{ textAlign: 'center' }}>
              <img src={placeholderImage2} alt={t('gameStartPage.imageAlt2', 'Game feature highlight')} style={{ maxWidth: '100%', borderRadius: '8px' }} />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {t('gameStartPage.imageCaption2', 'Master unique abilities and challenges.')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 5, textAlign: 'center' }}>
          {t('gameStartPage.footerNote', 'Ensure you have a stable internet connection for the best experience.')}
        </Typography>
      </Paper>
    </Container>
  );
};

export default GameStartPage;
