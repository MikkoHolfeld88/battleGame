import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Modal, Paper, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {GAME_START_PATH} from '../../routes';

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
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);
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

    useEffect(() => {
        requestFullscreen();
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
        requestFullscreen();
    };

    const handleQuitGame = () => {
        setIsPaused(false);
        // TODO: Add any game cleanup logic here
        console.log("Quitting game");
        if (document.fullscreenElement) { // Only exit if currently in fullscreen
            exitFullscreen();
        }
        navigate(GAME_START_PATH);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (document.fullscreenElement && !isPaused) {
                    setIsPaused(true);
                    // TODO: Add game loop pause logic here
                    console.log("Game paused via ESC key (while in fullscreen)");
                } else if (isPaused) {
                    // If already paused (modal is open), ESC could be interpreted as "Resume"
                    // For simplicity, let modal buttons handle resume/quit.
                    // Or, uncomment to make ESC resume:
                    // handleResumeGame();
                }
                // Note: Browser itself handles ESC to exit fullscreen.
                // If not in fullscreen, ESC does not trigger pause here by default.
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        const fullscreenChangeHandler = () => {
            // If exiting fullscreen and the game was paused, perhaps unpause or decide behavior.
            // For now, if modal is open due to ESC in fullscreen, it remains open.
            if (!document.fullscreenElement && isPaused) {
                console.log("Exited fullscreen, game is still paused.");
            }
        };
        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('MSFullscreenChange', fullscreenChangeHandler);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('MSFullscreenChange', fullscreenChangeHandler);
        };
    }, [isPaused, exitFullscreen, handleResumeGame]); // Added handleResumeGame if used by ESC

    // @ts-ignore
    return (
        <Box
            ref={gameCanvasRef}
            sx={{
                width: '100%', // Use 100% to fill parent width; avoids vw issues with scrollbars
                height: '100vh', // Fills viewport height. Assumes no vertical scroll on body for this page.
                                 // Or use height: '100%' if html, body, #root are set to height: 100%
                bgcolor: 'black',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden', // Prevent scrollbars within the game container itself
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

            <Modal
                open={isPaused}
                onClose={(_event, reason) => {
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
        </Box>
    );
};

export default GameContainerPage;
