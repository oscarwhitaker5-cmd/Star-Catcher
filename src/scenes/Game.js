import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.input.keyboard.on('keydown-P', () => {
            this.scene.launch('PauseMenu');
            this.scene.pause();
        });
        this.cameras.main.setBackgroundColor(0x000000);
        this.add.image(400, 400, 'sky');
        this.powerupTypes = ['powerup', 'heart', 'dummy', 'megaBomb', 'missile']; //'powerup', 'heart', 'dummy', 'megaBomb', 
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 668, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 67.5, 'ground').setScale(2).setAlpha(0).refreshBody();

        this.platforms.create(600, 500, 'ground');
        this.platforms.create(50, 350, 'ground');
        this.platforms.create(750, 320, 'ground');

        this.player = new Player(this, 100, 450);

        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 150, stepX: 70 }
        });

        this.stars.children.iterate(child =>
        {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.powerups = this.physics.add.group();
        this.physics.add.collider(this.powerups, this.platforms);
        this.physics.add.collider(this.player, this.powerups, this.hitPowerup, null, this);
        
        this.hearts = this.physics.add.group();
        this.physics.add.collider(this.hearts, this.platforms);
        this.physics.add.collider(this.player, this.hearts, this.hitHeart, null, this);

        this.dummies = this.physics.add.group();
        this.physics.add.collider(this.dummies, this.platforms);
        this.physics.add.collider(this.bombs, this.dummies, this.combine, null, this);
        
        this.megaBomb = this.physics.add.group();
        this.physics.add.collider(this.megaBomb, this.bombs);

        this.missilePowerups = this.physics.add.group();
        this.physics.add.collider(this.missilePowerups, this.platforms);
        this.physics.add.overlap(this.player, this.missilePowerups, this.collectMissilePowerup, null, this);

        this.lives = 3;
        this.livesText = this.add.text(16, 65, 'Lives: ' + this.lives, {
        fontSize: '24px',
        fill: '#fff'
        });
        this.starcount = 0;
        this.starsText = this.add.text(16, 37.5, 'Stars: ' + (this.starcount), { fontSize: '24px', fill: '#fff' });
        this.starsText.setInteractive();
        this.cooldown = 0;
        this.player.body.setGravityY(500);
        this.round = 1;
        this.roundText = this.add.text(16, 10, 'Round: ' + (this.round), { fontSize: '24px', fill: '#fff' });
        this.invulnerable = 0;
        this.dummyhit = 0;
        this.gottdummy = 0;
        this.speed = 0;
        this.jumpPower = 0;
        this.keys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            e: Phaser.Input.Keyboard.KeyCodes.E
        });

        this.speedText = this.add.text(450, 10, 'Speed: ' + (this.speed + '  (FREE!)'), { fontSize: '24px', fill: '#fff' });
        this.speedText.setInteractive();
        this.speedText.on('pointerdown', () => {
            this.speedInc();
        });

        this.jumpText = this.add.text(450, 37.5, 'Jump: ' + (this.jumpPower + '  (FREE!)'), { fontSize: '24px', fill: '#fff' });
        this.jumpText.setInteractive();
        this.jumpText.on('pointerdown', () => {
            this.jumpInc();
        });
        this.livesbought = 0;
        this.extraheartsText = this.add.text(450, 65, '+1 Heart (' + (this.livesbought * 100 + 100) + ' stars)', { fontSize: '24px', fill: '#fff' });
        this.extraheartsText.setInteractive();
        this.extraheartsText.on('pointerdown', () => {
            if (this.starcount >= (this.livesbought * 100 + 100)) {
                this.lives += 1;
                this.starcount -= (this.livesbought * 100 + 100);
                this.livesbought += 1;
                this.livesText.setText('Lives: ' + this.lives);
                this.starsText.setText('Stars: ' + (this.starcount));
                this.extraheartsText.setText('+1 Heart (' + (this.livesbought * 100 + 100) + ' stars)');
            }
        });

    }

    update() {

        if (this.player.isMissile) {
            if (this.cursors.left.isDown || this.keys.a.isDown) {
                this.player.angle -= 6;
            } else if (this.cursors.right.isDown || this.keys.d.isDown) {
                this.player.angle += 6;
            }
            this.physics.velocityFromRotation(this.player.rotation, 300, this.player.body.velocity);
        }

        this.livesText.setText('Lives: ' + this.lives);
        this.speedText.setText('Speed: ' + (this.speed + '  (' + this.speed * 20 +' stars)'));
        this.jumpText.setText('Jump: ' + (this.jumpPower + '  (' + this.jumpPower * 20 + ' stars)'));
        this.extraheartsText.setText('+1 Heart (' + (this.livesbought * 100 + 100) + ' stars)');
        this.starsText.setText('Stars: ' + (this.starcount));

        if (this.cursors.left.isDown || this.keys.a.isDown) {
            this.player.moveLeft();
        }
        else if (this.cursors.right.isDown || this.keys.d.isDown) {
            this.player.moveRight();
        }
        else {
            this.player.idle();
        }

        if (this.cursors.up.isDown || this.keys.w.isDown) {
            this.player.jump();
        }
    }

    combine(bomb, dummy) {
        this.hitDummy(bomb, dummy);
        this.hitbomb2(dummy, bomb);
    }

    megaBombBoom(bomb, megabomb) {
        const explosion2 = this.add.sprite(400, 400, 'bomb').setScale(4);

        this.time.delayedCall(2000, () => {
            const bigExplosion = this.add.image(400, 400, 'boom').setScale(15);
            if (this.lives > 1) {
                this.lives -= 1;
                this.livesText.setText('Lives: ' + this.lives);
            }
        ;
            this.time.delayedCall(500, () => {
                explosion2.destroy();
                bigExplosion.destroy();
                this.bombs.children.iterate(bomb => {
                    if (bomb.active) {
                        const explosion = this.add.sprite(bomb.x, bomb.y, 'boom').setScale(0.1);
                        bomb.disableBody(true, true);
                        this.time.delayedCall(300, () => {
                            explosion.destroy();
                        }, [], this);
                    }
            }, [], this);
        }, [], this);
    })}

    speedInc () {
        if (this.starcount >= this.speed * 20) {
            this.starcount -= this.speed * 20
            this.speed += 1;
            this.player.rightSpeed = this.speed * 50 + 150;
            this.player.leftSpeed = -1 * this.player.rightSpeed;
            this.starsText.setText('Stars: ' + (this.starcount));
            this.speedText.setText('Speed: ' + (this.speed + '  (' + this.speed * 20 +' stars)'));
        }
    }

    jumpInc () {
        if (this.starcount >= this.jumpPower * 20) {
            this.starcount -= this.jumpPower * 20;
            this.jumpPower += 1;
            this.player.jumpVelocity = this.jumpPower * -20 - 630;
            this.player.body.setGravityY(500 + 5 * this.jumpPower);
            this.starsText.setText('Stars: ' + (this.starcount));
            this.jumpText.setText('Jump: ' + (this.jumpPower + '  (' + this.jumpPower * 20 + ' stars)'));
        }
    }

    collectStar(player, star)
    {
        star.disableBody(true, true);
        this.starcount += 1;
        this.starsText.setText('Stars: ' + (this.starcount));
        if (this.stars.countActive(true) === 0) {
            this.round += 1;
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 150, true, true);
            });
            this.roundedRound = Math.floor(this.round / 10 + 1);
            for (let i = 0; i < this.roundedRound; i++) {
                this.releaseBomb();
            }
            this.roundText.setText('Round: ' + (this.round));
            
            if (this.round % 3 === 0) {
                const type = Phaser.Utils.Array.GetRandom(this.powerupTypes);
                console.log(type);
                if (type === 'heart') {
                    this.releaseHeart();
                } else if (type === 'powerup') {
                    this.releasePowerup();
                } else if (type === 'dummy') {
                    this.releaseDummy();
                } else if (type === 'megaBomb') {
                    this.megaBombBoom();
                } else if (type === 'missile') {
                    this.releaseMissilePowerup();
                }
            }
        }
    }

    hitbomb2 (dummy, bomb) 
    {
        const explosion = this.add.sprite(bomb.x, bomb.y, 'boom');
        explosion.setScale(0.1);
        bomb.disableBody(true, true);
        this.time.delayedCall(300, () => {
            explosion.destroy();
        }, [], this);
    }

    releaseMissilePowerup() {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var missilePowerup = this.missilePowerups.create(x, 166, 'missile').setScale(0.1);
        missilePowerup.setBounce(1);
        missilePowerup.setCollideWorldBounds(true);
        missilePowerup.setVelocity(Phaser.Math.Between(-200, 200), 200);
    }

    collectMissilePowerup(player, powerup) {
        powerup.destroy();
        player.becomeMissile();
        this.startMissileTimer();
    }

    startMissileTimer() {
        this.missileTime = 10;
        this.missileTimerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.missileTime -= 1;
                if (this.missileTime <= 0) {
                    this.player.explodeMissile();
                    if (this.lives > 1) {
                        this.lives -= 1;
                    }
                    this.missileTimerEvent.remove();
                }
            },
            loop: true
        });
    }

    hitBomb (player, bomb)
    {
        if (player.isMissile) {
            const explosion = this.add.sprite(bomb.x, bomb.y, 'boom').setScale(0.1);
            bomb.disableBody(true, true);
            this.time.delayedCall(500, () => explosion.destroy());
        } else if (this.invulnerable == 0) {
            if (this.cooldown == 0) {
            const explosion = this.add.sprite(bomb.x, bomb.y, 'boom');
            explosion.setScale(0.1);
            bomb.disableBody(true, true);
            this.time.delayedCall(300, () => {
                explosion.destroy();
            }, [], this);
                this.cooldown += 1;
                this.lives -= 1;
                this.livesText.setText('Lives: ' + this.lives);

                if (this.lives <= 0) {
                    this.physics.pause();

                    player.setTint(0xff0000);

                    player.anims.play('turn');

                    this.time.delayedCall(2000, () =>
                    {
                        this.scene.start('GameOver');
                    });
                } else {
                    player.setTint(0xff0000);
                    this.time.delayedCall(1000, () => {
                        console.log('1 second passed!');
                        player.clearTint();
                        this.cooldown -= 1;
                    }, [], this)};
                    
            }};
    }
        
    releaseBomb ()
    {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = this.bombs.create(x, 166, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    hitPowerup (player, powerup)
    {
        powerup.destroy();
        player.setScale(1.5);
        this.invulnerable += 1;
        this.player.jump();
        this.time.delayedCall(10000, () => {
            player.setScale(1);
            this.invulnerable -= 1
        }, [], this);
    }

    releasePowerup ()
    {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var powerup = this.powerups.create(x, 166, 'powerup');
        powerup.setScale(2);
        powerup.setBounce(1);
        powerup.setCollideWorldBounds(true);
        powerup.setVelocity(-200, 200);
    }

    hitHeart (player, heart)
    {
        this.roundedRound = Math.floor(this.round / 10 + 1);
        for (let i = 0; i < this.roundedRound; i++) {
            this.lives += 1;
        }
        this.livesText.setText('Lives: ' + this.lives);
        heart.destroy();
    }

    releaseHeart ()
    {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var heart = this.hearts.create(x, 166, 'heart');
        heart.setScale(0.1);
        heart.setBounce(1);
        heart.setCollideWorldBounds(true);
        heart.setVelocity(-200, 200);
    }

    releaseDummy ()
    {
        var x = this.player.x
        var y = this.player.y

        var dummy = this.dummies.create(x, y, 'dummy');
        dummy.setVelocity(200, -400);
        dummy.setScale(0.4);
        dummy.setBounce(1);
        dummy.setCollideWorldBounds(true);
        
    }

    hitDummy (bomb, dummy)
    {
        this.dummyhit += 1
        if (this.dummyhit >= 3) {
            dummy.destroy();
            this.dummyhit = 0
        }
    }
}