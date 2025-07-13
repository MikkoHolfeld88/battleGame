import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Modal, Typography, Button, Paper, IconButton, Tooltip } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GAME_START_PATH } from '../../routes';
import Layout from '../../components/Layout/Layout';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

const GameContainerPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameCanvasRef = useRef<HTMLDivElement>(null);

  const requestFullscreen = useCallback(() => {
    const element = gameCanvasRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) { /* Firefox */
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) { /* IE/Edge */
        (element as any).msRequestFullscreen();
      }
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) { /* Firefox */
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) { /* Chrome, Safari and Opera */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) { /* IE/Edge */
      (document as any).msExitFullscreen();
    }
  }, []);

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleResumeGame = () => {
    setIsPaused(false);
  };

  const handleQuitGame = () => {
    if (isFullscreen) {
      exitFullscreen();
    }
    navigate(GAME_START_PATH);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsPaused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const gameContent = (
    <Box
      ref={gameCanvasRef}
      sx={{
        flexGrow: 1,
        bgcolor: 'black',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: isPaused ? 'default' : 'none'
      }}
    >
      <Typography variant="h2">
        {t('gameContainerPage.gameAreaTitle', 'Game Area')}
      </Typography>
      <Typography variant="body1" sx={{mt: 2}}>
        {t('gameContainerPage.gameAreaInstructions', 'Your game will be rendered here.')}
      </Typography>
      <Typography variant="caption" sx={{mt: 1, color: 'grey.500'}}>
        {t('gameContainerPage.fullscreenInfo', 'Press ESC to pause.')}
      </Typography>
    </Box>
  );

  if (isFullscreen) {
    return (
      <>
        {gameContent}
        <Modal
          open={isPaused}
          onClose={handleResumeGame}
          aria-labelledby="pause-modal-title"
          aria-describedby="pause-modal-description"
        >
          <Paper sx={modalStyle}>
            <Typography id="pause-modal-title" variant="h5" component="h2" gutterBottom>
              {t('gameContainerPage.pauseModal.title', 'Game Paused')}
            </Typography>
            <Typography id="pause-modal-description" sx={{mb: 3}}>
              {t('gameContainerPage.pauseModal.description', 'The game is currently paused. What would you like to do?')}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
              <Button variant="contained" color="primary" onClick={handleResumeGame} sx={{minWidth: '120px'}}>
                {t('gameContainerPage.pauseModal.resumeButton', 'Resume')}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleQuitGame} sx={{minWidth: '120px'}}>
                {t('gameContainerPage.pauseModal.quitButton', 'Quit to Menu')}
              </Button>
            </Box>
          </Paper>
        </Modal>
      </>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Tooltip title={t('gameContainerPage.header.backButton', 'Back to Menu')}>
          <IconButton onClick={handleQuitGame} color="inherit">
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {t('gameContainerPage.title', 'Play Game')}
        </Typography>
        <Tooltip title={t('gameContainerPage.header.enterFullscreenButton', 'Enter Fullscreen')}>
          <IconButton onClick={requestFullscreen} color="inherit">
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {gameContent}
    </Layout>
  );
};

export default GameContainerPage;
