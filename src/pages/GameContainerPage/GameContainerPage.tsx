import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Modal, Typography, Button, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GAME_START_PATH } from '../../routes'; // Or HOME_PATH depending on final structure

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
  const gameCanvasRef = useRef<HTMLDivElement>(null); // Ref for the game area for fullscreen

  const requestFullscreen = useCallback(() => {
    const element = gameCanvasRef.current; // Or document.documentElement for the whole page
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

  // Attempt to go fullscreen on component mount
  useEffect(() => {
    requestFullscreen();
    // Cleanup function to exit fullscreen when component unmounts or before navigating away
    return () => {
      if (document.fullscreenElement) {
        exitFullscreen();
      }
    };
  }, [requestFullscreen, exitFullscreen]);

  const handleResumeGame = () => {
    setIsPaused(false);
    // TODO: Add game loop resume logic here
    console.log("Game resumed");
    requestFullscreen(); // Re-enter fullscreen if exited due to modal or other reasons
  };

  const handleQuitGame = () => {
    setIsPaused(false);
    // TODO: Add any game cleanup logic here
    console.log("Quitting game");
    exitFullscreen(); // Ensure fullscreen is exited before navigating
    navigate(GAME_START_PATH);
  };

  // Handle ESC key press for pausing
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // If game is running and ESC is pressed, pause it.
        // If game is already paused (modal is open), ESC might close the modal (browser default for some modals, or handle manually)
        // For simplicity, we'll just toggle pause state.
        // Browsers automatically exit fullscreen when an alert, prompt, or confirm dialog is shown.
        // Our modal is part of the page, so it won't inherently exit fullscreen.
        // However, user expectation for ESC is often to exit fullscreen first, then pause.
        // If already in fullscreen and not paused, pause.
        if (document.fullscreenElement && !isPaused) {
          setIsPaused(true);
          // TODO: Add game loop pause logic here
          console.log("Game paused via ESC key");
          // Note: We don't exit fullscreen here, modal will overlay.
          // If desired to exit fullscreen on pause: exitFullscreen();
        } else if (!document.fullscreenElement && isPaused) {
          // If not in fullscreen but paused (e.g., user manually exited FS then pressed ESC again)
          // This case might be complex, for now, let's assume ESC on modal means resume or is handled by modal buttons.
        } else if (!document.fullscreenElement && !isPaused) {
            // If not in fullscreen and not paused, and ESC is pressed,
            // this might mean the user wants to go back or pause if game was "running" without FS.
            // For now, we'll assume the game is only "active" in fullscreen.
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused, exitFullscreen]); // Add exitFullscreen to dependencies if used in handler

  // Hide header/footer if they are part of a global layout.
  // This is often better handled by having a separate layout for the game container page.
  // For now, we'll assume this page is rendered without typical site chrome.

  return (
    <Box
      ref={gameCanvasRef}
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: 'black', // Game background
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isPaused ? 'default' : 'none' // Hide cursor when game is active
      }}
    >
      {/* This is where the actual game canvas or components would go */}
      <Typography variant="h2">
        {t('gameContainerPage.gameAreaTitle', 'Game Area')}
      </Typography>
      <Typography variant="body1" sx={{mt: 2}}>
        {t('gameContainerPage.gameAreaInstructions', 'Your game will be rendered here.')}
      </Typography>
      <Typography variant="caption" sx={{mt: 1, color: 'grey.500'}}>
        {t('gameContainerPage.fullscreenInfo', 'Press ESC to pause.')}
      </Typography>

      {/* Pause Modal */}
      <Modal
        open={isPaused}
        onClose={(event, reason) => {
          // Prevent closing modal by clicking backdrop or pressing ESC if we want explicit button actions
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            // Optionally, allow ESC to close modal and resume:
            // handleResumeGame();
            return;
          }
          handleResumeGame(); // Default behavior if not prevented
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
          {/* Placeholder for game state information if needed */}
          {/* <Typography variant="body2" sx={{mb:2}}>Score: 12345</Typography> */}

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
