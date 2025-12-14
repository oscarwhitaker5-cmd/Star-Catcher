import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { Preloader } from './scenes/Preloader.js';
import { PauseMenu } from './scenes/PauseMenu.js';
import { StartScene } from './scenes/StartScene.js';
import { HowToPlay } from './scenes/HowToPlay.js';
import { ItemCatalogue } from './scenes/ItemCatalogue.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 500 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        StartScene,
        Game,
        GameOver,
        PauseMenu,
        HowToPlay,
        ItemCatalogue
    ]
};

new Phaser.Game(config);
