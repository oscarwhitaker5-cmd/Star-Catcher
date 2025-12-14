export class PauseMenu extends Phaser.Scene {
    constructor() {
        super('PauseMenu');
    }

    create() {
        this.add.rectangle(400, 350, 800, 700, 0x000000, 0.5);

        this.add.text(400, 250, 'Paused', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const resumeText = this.add.text(400, 400, 'Resume (Press P)', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);
        resumeText.setInteractive();

        resumeText.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Game');
        });

        const mainMenu = this.add.text(400, 550, 'Main Menu', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5);
        mainMenu.setInteractive();

        mainMenu.on('pointerdown', () => {
            this.scene.stop('Game');
            this.scene.stop();
            this.scene.start('StartScene');
        });

        this.input.keyboard.on('keydown-P', () => {
            this.scene.stop();
            this.scene.resume('Game');
        });
    }
}