export class HowToPlay extends Phaser.Scene {
    constructor() {
        super('HowToPlay')
    }

    create() {
        this.add.rectangle(400, 350, 800, 700, 0x000000);

        const instructions = [
            'P to pause',
            'WAD or Arrow keys to move and jump',
            'Collect all of the stars to progress',
            'Stars can be used in the shop',
            'Shop in the corner (click to purchase)',
            'Dodge the bombs that spawn each round',
            'Powerups spawn every three rounds',
            'Link to powerup explanation screen (coming soon)',
            ' ',
            '**HAVE FUN AND CLIMB THE ROUNDS**'
        ];

        this.add.text(400, 100, 'How to Play', { fontSize: '36px', fill: '#ff0', fontStyle: 'bold'}).setOrigin(0.5);

        let y = 175;
        instructions.forEach(line => {
            const style = line.startsWith('**')
                ? { fontSize: '28px', fill: '#0f0', fontStyle: 'bold' }
                : { fontSize: '24px', fill: '#fff' };

            const displayLine = line.replace(/\*\*/g, '');

            this.add.text(400, y, displayLine, style).setOrigin(0.5);
            y += 40;
        });
        const back = this.add.text(400, 625, 'Back', { fontSize: '36px', fill: '#ff0', fontStyle: 'bold'}).setOrigin(0.5);
        back.setInteractive();

        back.on('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }
}