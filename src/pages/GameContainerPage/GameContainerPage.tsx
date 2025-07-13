import React, {
    useCallback, useEffect, useRef, useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, IconButton, Modal, Paper, Tooltip, Typography
} from '@mui/material';
import {
    ArrowBack, Fullscreen, FullscreenExit
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GAME_START_PATH } from '../../routes';
import Footer from '../../components/Layout/Footer';
import PhaserGame, { type PhaserGameHandle } from '../../game/PhaserGame';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
};

const GameContainerPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    /* ---------- State & Refs ---------- */
    const [isPaused, setIsPaused] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const gameCanvasRef = useRef<HTMLDivElement>(null);
    const phaserRef = useRef<PhaserGameHandle>(null);

    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    /* ---------- ResizeObserver ---------- */
    useEffect(() => {
        const obs = new ResizeObserver(([entry]) => {
            setCanvasSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        });

        if (gameCanvasRef.current) {
            const { width, height } = gameCanvasRef.current.getBoundingClientRect();
            setCanvasSize({ width, height });
            obs.observe(gameCanvasRef.current);
        }
        return () => obs.disconnect();
    }, []);

    /* ---------- Fullscreen helpers ---------- */
    const requestFullscreen = useCallback(() => {
        const el = gameCanvasRef.current;
        if (!el) return;
        (el.requestFullscreen ||
            (el as any).webkitRequestFullscreen ||
            (el as any).mozRequestFullScreen ||
            (el as any).msRequestFullscreen)?.call(el);
    }, []);

    const exitFullscreen = useCallback(() => {
        if (!document.fullscreenElement) return;
        (document.exitFullscreen ||
            (document as any).webkitExitFullscreen ||
            (document as any).mozCancelFullScreen ||
            (document as any).msExitFullscreen)?.call(document);
    }, []);

    /* ---------- ESC + Fullscreen events ---------- */
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' &&
                document.fullscreenElement === gameCanvasRef.current &&
                !isPaused) {
                setIsPaused(true);
                phaserRef.current?.pause();
            }
        };
        const onFsChange = () =>
            setIsFullscreen(document.fullscreenElement === gameCanvasRef.current);

        window.addEventListener('keydown', onKeyDown);
        document.addEventListener('fullscreenchange', onFsChange);
        document.addEventListener('webkitfullscreenchange', onFsChange);
        document.addEventListener('mozfullscreenchange', onFsChange);
        document.addEventListener('MSFullscreenChange', onFsChange);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('fullscreenchange', onFsChange);
            document.removeEventListener('webkitfullscreenchange', onFsChange);
            document.removeEventListener('mozfullscreenchange', onFsChange);
            document.removeEventListener('MSFullscreenChange', onFsChange);
        };
    }, [isPaused]);

    /* ---------- Pause / Resume ---------- */
    const resume = () => {
        setIsPaused(false);
        phaserRef.current?.resume();
        if (isFullscreen && !document.fullscreenElement) requestFullscreen();
    };

    const quit = () => {
        if (document.fullscreenElement === gameCanvasRef.current) exitFullscreen();
        navigate(GAME_START_PATH);
    };

    /* ---------- Render ---------- */
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header */}
            {!isFullscreen && (
                <Box sx={{
                    p: 1, bgcolor: 'primary.main', color: 'primary.contrastText',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Tooltip title={t('gameContainerPage.header.backButton', 'Back to Menu')}>
                        <IconButton
                            onClick={() => {
                                if (isFullscreen) exitFullscreen();
                                navigate(GAME_START_PATH);
                            }}
                            color="inherit"
                        >
                            <ArrowBack />
                        </IconButton>
                    </Tooltip>

                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {t('gameContainerPage.title', 'Play Game')}
                    </Typography>

                    <Tooltip
                        title={
                            isFullscreen
                                ? t('gameContainerPage.header.exitFullscreenButton', 'Exit Fullscreen')
                                : t('gameContainerPage.header.enterFullscreenButton', 'Enter Fullscreen')
                        }
                    >
                        <IconButton
                            onClick={() => isFullscreen ? exitFullscreen() : requestFullscreen()}
                            color="inherit"
                        >
                            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Game Canvas */}
            <Box
                ref={gameCanvasRef}
                sx={{
                    flexGrow: 1,
                    bgcolor: 'black',
                    overflow: 'hidden',
                    cursor: isPaused ? 'default' : 'none'
                }}
            >
                <PhaserGame
                    ref={phaserRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                />
            </Box>

            {!isFullscreen && <Footer />}

            {/* Pause Modal */}
            <Modal
                open={isPaused}
                onClose={(_, r) =>
                    (r === 'backdropClick' || r === 'escapeKeyDown') || resume()
                }
            >
                <Paper sx={modalStyle}>
                    <Typography variant="h5" gutterBottom>
                        {t('gameContainerPage.pauseModal.title', 'Game Paused')}
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        {t(
                            'gameContainerPage.pauseModal.description',
                            'The game is currently paused. What would you like to do?'
                        )}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="contained" onClick={resume}>
                            {t('gameContainerPage.pauseModal.resumeButton', 'Resume')}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={quit}>
                            {t('gameContainerPage.pauseModal.quitButton', 'Quit to Menu')}
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
};

export default GameContainerPage;
