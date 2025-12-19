export class ItemCatalogue extends Phaser.Scene {
    constructor() {
        super('ItemCatalogue');
    }

    create() {
        this.add.rectangle(400, 350, 800, 700, 0x000000);
        this.add.text(400, 50, 'Item Catalogue', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        this.add.image(75, 150, 'dude', 4).setScale(2);
        this.add.text(75, 215, "'Jeff'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(250, 176.5, 'Jeff is a cool guy\n\nHe loves stars\n\nHe HATES bombs', {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(425, 150, 'star').setScale(2);
        this.add.text(425, 215, "'Star'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(625, 176.5, 'Star is shiny\n\nStar is shock absorbant\n\nStar is made of crack', {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(75, 300, 'bomb').setScale(2);
        this.add.text(75, 365, "'Bomb'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(245, 326.5, 'Bomb is bad\n\nBomb is full of\n\ngunpower and shit', {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(425, 300, 'powerup').setScale(3);
        this.add.text(425, 365, "'Super\n star'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(625, 326.5, 'Superstar gives growth,\n\ninvulnerability and\n\nlasts 10 seconds', {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(75, 450, 'heart').setScale(0.2);
        this.add.text(75, 515, "'Heart'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(250, 476.5, "Heart (+1 health),\n\ncures addicts\n\n(except for Jeff)", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(425, 450, 'bomb').setScale(3);
        this.add.text(425, 515, "'Nuke'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(595, 476.5, "Nuke blinds screen\n\ndestroys bombs and\n\ndamages Jeff", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(75, 600, 'dummy').setScale(0.4);
        this.add.text(75, 665, "'Dummy'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(245, 626.5, "Dummy can absorb\n\nthree bombs and\n\nis spring loaded", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);

        this.add.image(425, 600, 'curry').setScale(2);
        this.add.text(425, 665, "'Curry'", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(605, 626.5, "Flaming hot curry\n\ncauses fiery,\n\npropelling diarrhea", {fontSize: '20px', fill: '#fff'}).setOrigin(0.5);
        
        const back = this.add.image(50, 50, 'backarrow').setScale(0.05);
        back.setInteractive();
        back.setTint(0xffff00);
        back.on('pointerdown', () => {
            this.scene.stop();
            this.scene.start('StartScene');
        });
    }
}
