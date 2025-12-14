export class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'dude');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.initAnimations();
        this.leftSpeed = -150;
        this.rightSpeed = 150;
        this.jumpVelocity = -630;
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

    becomeMissile() {
        this.isMissile = true;
        this.anims.stop()
        this.setTexture('dudefront');
        this.setScale(1.5);
        this.body.allowGravity = false;
        this.setAngle(0);
    }

    explodeMissile() {
        const explosion = this.scene.add.sprite(this.x, this.y, 'boom').setScale(0.1);
        this.scene.time.delayedCall(500, () => explosion.destroy());
        this.isMissile = false;
        this.setTexture('dude');
        this.setScale(1);
        this.body.allowGravity = true;
        this.setAngle(0);
        this.setVelocity(0, 0);
    }

    moveLeft() {
        if (!this.isMissile) {
            this.setVelocityX(this.leftSpeed);
            this.anims.play('left', true);
        }
    }

    moveRight() {
        if (!this.isMissile) {
            this.setVelocityX(this.rightSpeed);
            this.anims.play('right', true);
        }
    }

    idle() {
        if (!this.isMissile) {
            this.setVelocityX(0);
            this.anims.play('turn');
        }
    }

    jump() {
        if (!this.isMissile && this.body.blocked.down) {
            this.setVelocityY(this.jumpVelocity);
        }
    }

}
