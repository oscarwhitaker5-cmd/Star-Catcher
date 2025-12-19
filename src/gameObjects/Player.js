function getDirection(angle) {
    angle = Phaser.Math.Angle.NormalizeDegrees(angle);
    if (angle >= 45 && angle < 135) return 'south';
    if (angle >= 135 && angle < 225) return 'west';
    if (angle >= 225 && angle < 315) return 'north';
    return 'east';
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'dude');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setBounce(0);
        this.setCollideWorldBounds(true);
        this.initAnimations();
        this.leftSpeed = -150;
        this.rightSpeed = 150;
        this.jumpVelocity = -630;
        this.isMissile = false;
    }

    update() {
        if (this.isMissile) {
            this.setTexture('dudefront');


            //const dir = getDirection(this.angle);

            //if (dir === 'east' || dir === 'west') {
            //    this.body.setSize(40, 28);
            //    this.body.setOffset((this.width - 40) / 2, (this.height - 28) / 2);
            //} else {
            //    this.body.setSize(28, 40);
            //    this.body.setOffset((this.width - 28) / 2, (this.height - 40) / 2);
            //}
        }
    }

    initAnimations() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
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
        this.anims.stop();
        this.setTexture('dudefront').setOrigin(0.3, 0.7);
        this.setScale(1.5);
        this.body.allowGravity = false;
    }

    explodeMissile() {
        const explosion = this.scene.add.sprite(this.x, this.y, 'boom').setScale(0.1);
        this.scene.time.delayedCall(500, () => explosion.destroy());
        this.isMissile = false;
        this.setTexture('dude').setOrigin(0, 0);
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
