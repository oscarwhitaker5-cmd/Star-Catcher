export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    initAnimations ()
    {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }


    preload() {
        this.load.setPath('assets');
        this.load.image('sky', 'sky.png');
        this.load.image('ground', 'platform.png');
        this.load.image('star', 'star.png');
        this.load.image('powerup', 'powerup.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('boom', 'cartoon-blast.png');
        this.load.image('heart', 'heart.png');
        this.load.image('dummy', 'dummy.png');
        this.load.image('backarrow', 'backArrow.png');
        this.load.image('downarrow', 'downArrow.png');
        this.load.image('uparrow', 'upArrow.png');
        this.load.image('curry', 'curry.png');
        this.load.image('dudefront', 'dudefront.png');
        this.load.image('sky2', 'sky2.png');
        this.load.image('zafirBoss', 'zafirBoss.png');
        this.load.spritesheet(
            'dude',
            'dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('StartScene');
    }
}
