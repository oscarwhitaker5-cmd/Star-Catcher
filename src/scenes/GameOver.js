export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.rectangle(400, 350, 800, 700, 0x000000);

        this.add.text(400, 250, 'Game Over', { fontSize: '48px', fill: '#f00' }).setOrigin(0.5);

        const replayText = this.add.text(400, 400, 'Retry', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);
        replayText.setInteractive();

        replayText.on('pointerdown', () => {
            this.scene.start('Game');
        });

        this.input.keyboard.on('keydown-R', () => {
            this.scene.start('Game');
        });

        const menuText = this.add.text(400, 500, 'Main Menu', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
        menuText.setInteractive();
        menuText.on('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }
}
