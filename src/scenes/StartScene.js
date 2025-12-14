export class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        this.add.rectangle(400, 350, 800, 700, 0x000000);

        this.add.text(400, 250, 'Star-Catcher', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);
        

        const htp = this.add.text(400, 400, 'How to Play (click)', { fontSize: '36px', fill: '#ff0', fontStyle: 'bold' }).setOrigin(0.5);
        htp.setInteractive();
        htp.on('pointerdown', () => {
            this.scene.start('HowToPlay');
        });

        const playText = this.add.text(400, 525, 'Play', { fontSize: '48px', fill: '#0f0', fontStyle: 'bold' }).setOrigin(0.5);
        playText.setInteractive();

        playText.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('Game');
        });

        const iCText = this.add.text(400, 650, 'Item Catalogue', { fontSize: '36px', fill: '#ff0', fontStyle: 'bold' }).setOrigin(0.5);
        iCText.setInteractive();

        iCText.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('ItemCatalogue');
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('Game');
        });
        this.add.image(80, 95, 'star').setScale(3);
        this.add.image(720, 95, 'star').setScale(3);
        this.add.image(120, 100, 'star').setScale(3);
        this.add.image(680, 100, 'star').setScale(3);
        this.add.image(160, 105, 'star').setScale(3);
        this.add.image(640, 105, 'star').setScale(3);
        this.add.image(200, 110, 'star').setScale(3);
        this.add.image(600, 110, 'star').setScale(3);
        this.add.image(240, 115, 'star').setScale(3);
        this.add.image(560, 115, 'star').setScale(3);
        this.add.image(400, 100, 'dude', 4).setScale(3).setOrigin(0.5);
    }
}
