import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Modal, Typography, Button, Paper, IconButton, Tooltip } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GAME_START_PATH } from '../../routes';
import Footer from '../../components/Layout/Footer'; // Import the reusable Footer

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
  const [isFullscreenActive, setIsFullscreenActive] = useState(false); // State for our game canvas fullscreen
  const gameCanvasRef = useRef<HTMLDivElement>(null);

  const requestFullscreen = useCallback(() => {
    const element = gameCanvasRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
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
      document.exitFullscreen().catch(err => console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`));
    } else if ((document as any).mozCancelFullScreen) { /* Firefox */
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) { /* Chrome, Safari and Opera */
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) { /* IE/Edge */
      (document as any).msExitFullscreen();
    }
  }, []);

  // Effect to clean up fullscreen when component unmounts
  useEffect(() => {
    return () => {
      // Check if the gameCanvasRef.current is the fullscreen element
      if (document.fullscreenElement === gameCanvasRef.current) {
        exitFullscreen();
      }
    };
  }, [exitFullscreen]);

  const handleResumeGame = () => {
    setIsPaused(false);
    // TODO: Add game loop resume logic here
    console.log("Game resumed");
    // Re-enter fullscreen for the game canvas if it was active
    if (isFullscreenActive && !document.fullscreenElement) {
        requestFullscreen();
    }
  };

  const handleQuitGame = () => {
    setIsPaused(false);
    // TODO: Add any game cleanup logic here
    console.log("Quitting game");
    if (document.fullscreenElement === gameCanvasRef.current) {
      exitFullscreen();
    }
    navigate(GAME_START_PATH);
  };

  // Effect for Keyboard (ESC) and Fullscreen Change listeners
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // If game canvas is fullscreen and game is not paused, pause it
        if (document.fullscreenElement === gameCanvasRef.current && !isPaused) {
          setIsPaused(true);
          // Game loop pause logic would go here
          console.log("Game paused via ESC key (while game canvas in fullscreen)");
        }
        // Note: Browser handles ESC to exit fullscreen automatically.
        // Our fullscreenChangeHandler will then update isFullscreenActive.
      }
    };

    const handleFullscreenChange = () => {
      // Update our state based on whether gameCanvasRef.current is the fullscreen element
      const currentlyFullscreen = document.fullscreenElement === gameCanvasRef.current;
      setIsFullscreenActive(currentlyFullscreen);
      if (!currentlyFullscreen && isPaused) {
        // If fullscreen was exited (e.g. by ESC) and game was paused,
        // it remains paused. User can resume via modal.
        console.log("Exited fullscreen, game is still paused.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Safari
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);    // Firefox
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);     // IE/Edge

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
    // Dependencies: isPaused to correctly handle ESC logic,
    // gameCanvasRef.current might be technically needed if its identity could change, but unlikely for a useRef.
  }, [isPaused, gameCanvasRef]);

  // @ts-ignore
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Actual Header */}
      {!isFullscreenActive && ( // Only show Header if not in fullscreen
        <Box
          sx={{
            p: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0, // Prevent header from shrinking
          }}
        >
          <Tooltip title={t('gameContainerPage.header.backButton', 'Back to Menu')}>
            <IconButton
              onClick={() => {
                // No need to check document.fullscreenElement here as isFullscreenActive handles it
                if (isFullscreenActive) exitFullscreen();
                navigate(GAME_START_PATH);
              }}
              color="inherit"
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {t('gameContainerPage.title', 'Play Game')}
          </Typography>
          <Tooltip title={isFullscreenActive
              ? t('gameContainerPage.header.exitFullscreenButton', 'Exit Fullscreen')
              : t('gameContainerPage.header.enterFullscreenButton', 'Enter Fullscreen')}>
            <IconButton
              onClick={() => {
                if (isFullscreenActive) {
                  exitFullscreen();
                } else {
                  requestFullscreen();
                }
              }}
              color="inherit"
            >
              {isFullscreenActive ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Game Area */}
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

      {/* Reusable Footer */}
      {!isFullscreenActive && <Footer />}

      <Modal
        open={isPaused}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleResumeGame();
        }}
        aria-labelledby="pause-modal-title"
        aria-describedby="pause-modal-description"
      >
        <Paper sx={modalStyle}>
          <Typography id="pause-modal-title" variant="h5" component="h2" gutterBottom>
            {t('gameContainerPage.pauseModal.title', 'Game Paused')}
          </Typography>
          <Typography id="pause-modal-description" sx={{ mb: 3 }}>
            {t('gameContainerPage.pauseModal.description', 'The game is currently paused. What would you like to do?')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Button variant="contained" color="primary" onClick={handleResumeGame} sx={{minWidth: '120px'}}>
              {t('gameContainerPage.pauseModal.resumeButton', 'Resume')}
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleQuitGame} sx={{minWidth: '120px'}}>
              {t('gameContainerPage.pauseModal.quitButton', 'Quit to Menu')}
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default GameContainerPage;
