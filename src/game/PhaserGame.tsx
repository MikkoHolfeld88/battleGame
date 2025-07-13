import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import MainScene from './scenes/MainScene';

export interface PhaserGameHandle {
    pause: () => void;
    resume: () => void;
}

interface Props {
    width: number;   // kommt zwar noch aus React, ist aber nur informativ
    height: number;
}

const PhaserGame = forwardRef<PhaserGameHandle, Props>(
    ({ width, height }, ref) => {
        const ionRef = useRef<any>(null);
        const [initialize] = useState(true);   // sofort initialisieren

        /* ---------- Cleanup ---------- */
        useEffect(
            () => () => {
                ionRef.current?.getInstance?.()?.instance?.destroy(true);
            },
            []
        );

        /* ---------- Pause / Resume ---------- */
        useImperativeHandle(ref, () => ({
            pause() {
                const game = ionRef.current?.getInstance?.()?.instance as Phaser.Game;
                game?.scene.pause('MainScene');
            },
            resume() {
                const game = ionRef.current?.getInstance?.()?.instance as Phaser.Game;
                game?.scene.resume('MainScene');
            }
        }), []);

        /* ---------- Render ---------- */

        return (
            // @ts-ignore
            <IonPhaser
                ref={ionRef}
                initialize={initialize}
                game={{
                    type: Phaser.AUTO,
                    width: width || 640,
                    height: height || 480,
                    scene: MainScene,
                    scale: {
                        mode: Phaser.Scale.RESIZE,
                        autoCenter: Phaser.Scale.CENTER_BOTH
                    },
                    backgroundColor: '#b25f5f',
                }}
            />
        );
    }
);

export default PhaserGame;
