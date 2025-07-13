import React, { useRef, useEffect, useState } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import MainScene from './scenes/MainScene';

interface PhaserGameProps {
  width: number;
  height: number;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ width, height }) => {
  const gameRef = useRef(null);
  const [game, setGame] = useState<any>({
    width: width,
    height: height,
    type: Phaser.AUTO,
    scene: MainScene,
  });

  useEffect(() => {
    setGame({
      ...game,
      width: width,
      height: height,
    });
  }, [width, height]);

  return <IonPhaser ref={gameRef} game={game} initialize={true} />;
};

export default PhaserGame;
