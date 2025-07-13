import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { Box } from '@mui/material';

export interface GameHandle {
    pause: () => void;
    resume: () => void;
}

interface Props {
    width: number;
    height: number;
}

const Game = forwardRef<GameHandle, Props>(({ width, height }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number | null>(null);

    // Welt- und Spieler-Zustände
    const world = useRef({ width: 2000, height: 2000 });
    const player = useRef({
        x: world.current.width / 2,
        y: world.current.height / 2,
    });
    const camera = useRef({ x: 0, y: 0 });
    const speed = 200; // px / s
    const keys = useRef<Set<string>>(new Set());

    /* ------------------------- Update-Logik ------------------------- */
    const update = (delta: number, canvas: HTMLCanvasElement) => {
        // Bewegungsvektor aus gedrückten Tasten
        let dx = 0;
        let dy = 0;
        if (keys.current.has('ArrowRight')) dx += 1;
        if (keys.current.has('ArrowLeft')) dx -= 1;
        if (keys.current.has('ArrowUp')) dy -= 1;
        if (keys.current.has('ArrowDown')) dy += 1;

        // Normieren für diagonale Bewegung
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;

        // Spielerposition aktualisieren
        player.current.x = Math.max(
            0,
            Math.min(world.current.width, player.current.x + dx * speed * delta)
        );
        player.current.y = Math.max(
            0,
            Math.min(world.current.height, player.current.y + dy * speed * delta)
        );

        /* -------- Kamera: Spieler bleibt zentriert, Welt bewegt sich -------- */
        camera.current.x = player.current.x - canvas.width / 2;
        camera.current.y = player.current.y - canvas.height / 2;

        // Kamera begrenzen – funktioniert auch, wenn Viewport größer als Welt
        const maxCamX = Math.max(0, world.current.width - canvas.width);
        const maxCamY = Math.max(0, world.current.height - canvas.height);
        camera.current.x = Math.max(0, Math.min(camera.current.x, maxCamX));
        camera.current.y = Math.max(0, Math.min(camera.current.y, maxCamY));
    };

    /* ------------------------- Zeichen-Routine ------------------------- */
    const draw = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Raster-Hintergrund
        ctx.strokeStyle = '#222';
        for (let x = 0; x <= world.current.width; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x - camera.current.x, -camera.current.y);
            ctx.lineTo(x - camera.current.x, world.current.height - camera.current.y);
            ctx.stroke();
        }
        for (let y = 0; y <= world.current.height; y += 100) {
            ctx.beginPath();
            ctx.moveTo(-camera.current.x, y - camera.current.y);
            ctx.lineTo(world.current.width - camera.current.x, y - camera.current.y);
            ctx.stroke();
        }

        // Spieler (immer im Zentrum des Viewports)
        ctx.fillStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 20, 0, 2 * Math.PI);
        ctx.fill();
    };

    /* ----------------------------- Game-Loop ----------------------------- */
    const loop = (timestamp: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
        const delta = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        update(delta, canvas);
        draw(canvas);

        animationRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
        lastTimeRef.current = null; // Reset Delta nach Resize / Fullscreen
        if (!animationRef.current) animationRef.current = requestAnimationFrame(loop);
        // Fokus für zuverlässige Keyboard-Events
        canvasRef.current?.focus();
    };
    const stop = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };

    /* --------------------------- Tastatur-Events --------------------------- */
    useEffect(() => {
        const onDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
                keys.current.add(e.code);
            }
        };
        const onUp = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
                keys.current.delete(e.code);
            }
        };
        // Auf document hört auch im Fullscreen korrekt
        document.addEventListener('keydown', onDown);
        document.addEventListener('keyup', onUp);
        return () => {
            document.removeEventListener('keydown', onDown);
            document.removeEventListener('keyup', onUp);
        };
    }, []);

    /* ---------------------- Initialisierung & Resize ---------------------- */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        start();
        return () => stop();
    }, [width, height]);

    useImperativeHandle(ref, () => ({ pause: stop, resume: start }));

    return (
        <Box width={width} height={height} sx={{ overflow: 'hidden' }}>
            <canvas ref={canvasRef} tabIndex={0} />
        </Box>
    );
});

export default Game;
