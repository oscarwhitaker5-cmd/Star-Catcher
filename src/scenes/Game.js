import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.timerText;
        this.input.keyboard.on('keydown-P', () => {
            this.scene.launch('PauseMenu');
            this.scene.pause();
        });
        this.cameras.main.setBackgroundColor(0x000000);
        this.sky = this.add.image(400, 400, 'sky2').setTint(0x87CEEB);

        this.powerupTypes = ['powerup', 'heart', 'dummy', 'megaBomb', 'missile']; //'powerup', 'heart', 'dummy', 'megaBomb', 'missile' 
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 668, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 67.5, 'ground').setScale(2).setAlpha(0).refreshBody();

        this.platform1 = this.platforms.create(600, 500, 'ground');
        this.platform2 = this.platforms.create(50, 350, 'ground');
        this.platform3 = this.platforms.create(750, 320, 'ground');

        this.player = new Player(this, 100, 450);

        this.collision = this.physics.add.collider(this.player, this.platforms);

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
        
        this.bossbombs = this.physics.add.group();
        this.physics.add.collider(this.player, this.bossbombs, this.hitBossBomb, null, this);

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
        this.round = 1; // DEBUG CHANGE BACK TO 1
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
        this.bossMove = 1000;
        this.bossFighting = false;
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
        this.extraheartsText = this.add.text(450, 65, '+1 Heart (' + (this.livesbought * 25 + 25) + ' stars)', { fontSize: '24px', fill: '#fff' });
        this.extraheartsText.setInteractive();
        this.extraheartsText.on('pointerdown', () => {
            if (this.starcount >= (this.livesbought * 25 + 25)) {
                this.lives += 1;
                this.starcount -= (this.livesbought * 25 + 25);
                this.livesbought += 1;
                this.livesText.setText('Lives: ' + this.lives);
                this.starsText.setText('Stars: ' + (this.starcount));
                this.extraheartsText.setText('+1 Heart (' + (this.livesbought * 25 + 25) + ' stars)');
            }
        });
        this.zafirLines = [
            "Why are you eating\nALL OF MY STARS?!!",
            "I AM THE MIGHTY \nZAFIR ... nya",
            "nya... BOW DOWN \nBEFORE MY WRATH",
            "FINE... nya... I \nWILL TAKE THE STARS \nBY FORCE" 
        ];
        this.zafirLines2 = [
            "NYA! You survived my \nwall of bombs",
            "hmmm... NYA! This is \nunexpected",
            "Will you survive the \nhoming bombs of NYA"
        ];
        this.zafirLines3 = [
            "NYAAAAAAAAAAAAAAA",
            "HOW HAVE THE STARS \nNOT SPILLED OUT OF\nYOUR CORPSE",
            "IF MY FOOLISH HOMING \nBOMBS CAN'T DO IT...",
            "MAYBE I'LL HAVE TO!!"
        ];
        this.bossVuln = false;
    }

    update() {
        this.bossbombs.children.iterate((bomb) => {
            if (bomb.update) bomb.update();
        });
        
        this.dummies.children.iterate((dummy) => { 
            if (dummy.text) { 
                dummy.text.setPosition(dummy.x, dummy.y - 60);
            } 
        });

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
        this.extraheartsText.setText('+1 Heart (' + (this.livesbought * 25 + 25) + ' stars)');
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

    hitBossBomb(player, bossbomb) {
        if (this.invulnerable == 0) {
            if (this.cooldown == 0) {
                const explosion = this.add.sprite(bossbomb.x, bossbomb.y, 'boom');
                explosion.setScale(0.1);
                bossbomb.disableBody(true, true);
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

    megaBombBoom(bomb, megabomb) {
        const explosion2 = this.add.sprite(400, 400, 'bomb').setScale(4);

        this.time.delayedCall(2000, () => {
            const bigExplosion = this.add.image(400, 400, 'boom').setScale(15);
            if (this.lives > 1 && this.round != 15) {
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

    hitBoss(player, boss) {
        if (!this.bossVuln) {
            if (this.invulnerable === 0 && this.cooldown === 0) {
                const explosion = this.add.sprite(player.x, player.y, 'boom').setScale(0.1);

                this.time.delayedCall(300, () => {
                    explosion.destroy();
                });

                this.cooldown = 1;
                this.lives -= 1;
                this.livesText.setText('Lives: ' + this.lives);

                if (this.lives <= 0) {
                    this.physics.pause();
                    player.setTint(0xff0000);
                    player.anims.play('turn');
                    this.time.delayedCall(2000, () => {
                        this.scene.start('GameOver');
                    });
                } else {
                    player.setTint(0xff0000);
                    this.time.delayedCall(1000, () => {
                        player.clearTint();
                        this.cooldown = 0;
                    });
                }
            }
        } else if (this.bossRound != 3) {
            console.log('phaseshift')
            this.player.setPosition(50, 200);
            this.whitescreen = this.add.image(400, 350, 'boom').setScale(24);
            this.bossRound += 1;
            this.tweens.add({
                targets: this.zafirBoss,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    this.zafirBoss.setPosition(400, 200);
                    this.zafirBoss.setTint(0xFF6347);
                    this.tweens.add({
                        targets: this.zafirBoss,
                        alpha: 1,
                        duration: 500,
                        ease: 'Linear',
                        onComplete: () => {
                            this.whitescreen.destroy();
                            this.bossPhase1();
                        }
                    });
                }
            });
        } else {
            console.log('endfight')
            this.tweens.add({
                targets: this.zafirBoss,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    this.zafirBoss.setPosition(400, 375);
                    this.zafirBoss.setTint(0x8B0000);
                    this.tweens.add({
                        targets: this.zafirBoss,
                        alpha: 1,
                        duration: 500,
                        ease: 'Linear',
                        onComplete: () => {
                            this.dummykill = this.add.image(50, 300, 'dummy').setScale(0.4);
                            this.tweens.add({
                                targets: this.dummykill,
                                x: 650,
                                y: 500,
                                duration: 300,
                                ease: 'Linear',
                                onComplete: () => {
                                    this.tweens.add({
                                        targets: this.dummykill,
                                        x: 650,
                                        y: 300,
                                        duration: 200,
                                        ease: 'Linear',
                                        onComplete: () => {
                                            this.tweens.add({
                                                targets: this.dummykill,
                                                x: 50,
                                                y: 500,
                                                duration: 300,
                                                ease: 'Linear',
                                                onComplete: () => {
                                                    this.tweens.add({
                                                        targets: this.dummykill,
                                                        x: 50,
                                                        y: 300,
                                                        duration: 200,
                                                        ease: 'Linear',
                                                        onComplete: () => {
                                                            this.tweens.add({
                                                                targets: this.dummykill,
                                                                x: 650,
                                                                y: 500,
                                                                duration: 300,
                                                                ease: 'Linear',
                                                                onComplete: () => {
                                                                    this.tweens.add({
                                                                        targets: this.dummykill,
                                                                        x: 650,
                                                                        y: 400,
                                                                        duration: 100,
                                                                        ease: 'Linear',
                                                                        onComplete: () => {
                                                                            this.tweens.add({
                                                                                targets: this.dummykill,
                                                                                x: 675,
                                                                                y: 400,
                                                                                duration: 2000,
                                                                                ease: 'Linear',
                                                                                onComplete: () => {
                                                                                    this.tweens.add({
                                                                                        targets: this.dummykill,
                                                                                        x: 50,
                                                                                        y: 400,
                                                                                        duration: 300,
                                                                                        ease: 'Linear',
                                                                                        onComplete: () => {
                                                                                            this.tweens.add({
                                                                                                targets: this.dummykill,
                                                                                                x: -450,
                                                                                                y: -100,
                                                                                                duration: 2000,
                                                                                                ease: 'Linear',
                                                                                                onComplete: () => {
                                                                                                    this.dummykill.destroy();

                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    collectStar(player, star)
    {   
        star.disableBody(true, true);
        this.starcount += 1;
        this.starsText.setText('Stars: ' + (this.starcount));
        if (this.stars.countActive(true) === 0) {
            this.round += 1;
            if (this.round != 15) {
                this.stars.children.iterate((child) => {
                    child.enableBody(true, Phaser.Math.FloatBetween(12, 788), Phaser.Math.FloatBetween(125, 575), true, true); //child.x. 150
                }); 
            
            
                this.roundedRound = Math.floor(this.round / 10 + 1);
                for (let i = 0; i < this.roundedRound; i++) {
                    this.releaseBomb();
                }
            
                if (this.round % 3 === 0) {                
                    let randomColor = Phaser.Display.Color.RandomRGB().color;
                    this.sky.setTint(randomColor);
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
            } else if (this.round === 15) {
                this.megaBombBoom();
                this.time.delayedCall(2499, () => {
                    this.sky.setTint(0x8A0303);
                    this.platform1.body.enable = false;
                    this.platform1.setVisible(false);
                    this.platform2.body.enable = false;
                    this.platform2.setVisible(false);
                    this.platform3.body.enable = false;
                    this.platform3.setVisible(false);
                    this.player.setPosition(50, 200)
                    this.zafirBoss = this.physics.add.sprite(400, 200, 'zafirBoss').setScale(0.15);
                    this.zafirBoss.setImmovable(true);
                    this.zafirBoss.body.allowGravity = false;
                    this.bossMove = 225;
                    this.physics.add.overlap(this.player, this.zafirBoss, this.hitBoss, null, this);
                    this.bossDialogue1();
                }, [], this);
            }

            this.roundText.setText('Round: ' + (this.round));
        } 

    }
    bossDialogue1 () {
        this.zafirText = this.add.text(650, 200, "", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#ffff00",
            align: "center"
        }).setOrigin(0.5);
        this.time.delayedCall(1000, () => {
            this.hearticon = this.add.image(this.player.x, this.player.y, 'heart').setScale(0);
            this.tweens.add({
                targets: this.hearticon,
                scale: 0.3,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    this.lives += 1; // important needs tuning
                    this.tweens.add({
                        targets: this.hearticon,
                        scale: 0,
                        duration: 500,
                        ease: 'Linear',
                    });
                }
            });
        });
        this.currentLineIndex = 0;
        this.zafirText.setText(this.zafirLines[this.currentLineIndex]);
        this.time.addEvent({ 
            delay: 4000,
            repeat: this.zafirLines.length - 1,
            callback: () => { 
                this.currentLineIndex++;  
                this.zafirText.setText(this.zafirLines[this.currentLineIndex]); 
            }
        });
        this.time.delayedCall(18000, () => {
            this.bossMove = 1000;
            this.bossRound = 1
            this.bossPhase1();
        });
    }

    bossDialogue2() {
        console.log('bossDialogue2')
        this.tweens.add({
            targets: this.zafirBoss,
            alpha: 1,
            duration: 1000,
            ease: 'Linear'
        });

        this.zafirText2 = this.add.text(650, 200, "", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#ffff00", // yellow
            align: "center"
        }).setOrigin(0.5);

        this.currentLineIndex2 = 0;
        this.zafirText2.setText(this.zafirLines2[this.currentLineIndex2]);

        // loop every 4s until all lines are shown
        this.dialogueEvent2 = this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => {
                this.currentLineIndex2++;
                if (this.currentLineIndex2 < this.zafirLines2.length) {
                    this.zafirText2.setText(this.zafirLines2[this.currentLineIndex2]);
                } else {
                    this.zafirText2.destroy();
                }
            }
        });

        this.time.delayedCall(14000, () => {
            this.bossPhase2();
        });
    }



    bossDialogue3() {
        console.log('bossDialogue3')
        this.tweens.add({
            targets: this.zafirBoss,
            alpha: 1,
            duration: 1000,
            ease: 'Linear'
        });
        this.zafirText3 = this.add.text(650, 200, "", {
            fontSize: "24px",
            fontStyle: "bold",
            color: "#ffff00",
            align: "center"
        }).setOrigin(0.5);

        this.currentLineIndex3 = 0;
        this.zafirText3.setText(this.zafirLines3[this.currentLineIndex3]);

        this.dialogueEvent3 = this.time.addEvent({
            delay: 4000,
            loop: true,
            callback: () => {
                this.currentLineIndex3++;
                if (this.currentLineIndex3 < this.zafirLines3.length) {
                    this.zafirText3.setText(this.zafirLines3[this.currentLineIndex3]);
                } else {
                    this.zafirText3.destroy();
                }
            }
        });

        this.time.delayedCall(14000, () => {
            this.bossPhase3();
        });

    }

    bossPhase1() {
        console.log('phase1')
        this.tweens.add({
            targets: this.zafirBoss,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
        });
        for (let wave = 0; wave < 5; wave++) {
            this.time.delayedCall(wave * 3000, () => {
                let gapStart = Phaser.Math.Between(0, 21);

                for (let i = 0; i < 24; i++) {
                    if (i >= gapStart && i < gapStart + 3) continue;

                    let x = 16 + i * (800 / 24); 
                    let y = 125;

                    let bossbomb = this.bossbombs.create(x, y, 'bomb');
                    bossbomb.setBounce(1);
                    bossbomb.setCollideWorldBounds(false);
                    bossbomb.body.allowGravity = false;
                    bossbomb.setVelocityY(200 + 25 * this.bossRound);
                    bossbomb.body.onWorldBounds = true; 
                }
            });
            }
        this.time.delayedCall(18000, () => {
            if (this.bossRound > 1) {
                this.bossPhase2();
            } else {
                this.bossDialogue2();
            }
        });       
    }

    bossPhase2 () {
        console.log('phase2')
        this.tweens.add({
            targets: this.zafirBoss,
            alpha: 0,
            duration: 1000,
            ease: 'Linear'
        });
        
        this.bossBombEvent = this.time.addEvent({
            delay: 2000,
            repeat: 9,
            callback: () => {
                let bossbomb = this.bossbombs.create(this.zafirBoss.x, this.zafirBoss.y, 'bomb');
                bossbomb.setTint(0x000080)
                bossbomb.setCollideWorldBounds(false);
                bossbomb.body.allowGravity = false;
                bossbomb.setVelocityY(200 + 25 * this.bossRound); 

                bossbomb.update = () => {

                    let angle = Phaser.Math.Angle.Between(bossbomb.x, bossbomb.y, this.player.x, this.player.y);

                    let targetVelocity = new Phaser.Math.Vector2();
                    this.physics.velocityFromRotation(angle, 200, targetVelocity);
                    bossbomb.body.velocity.x = Phaser.Math.Linear(
                        bossbomb.body.velocity.x,
                        targetVelocity.x,
                        0.02 + 0.1 * this.bossRound
                    );

                    bossbomb.body.velocity.y = Phaser.Math.Linear(
                        bossbomb.body.velocity.y,
                        targetVelocity.y,
                        0.02 + 0.001 * this.bossRound
                    );
                };
            }
        });
        this.time.delayedCall(25000, () => {
            this.bossbombs.children.iterate((bossbomb) => {
                if (bossbomb.active) {
                    const explosion = this.add.sprite(bossbomb.x, bossbomb.y, 'boom');
                    explosion.setScale(0.1);
                    bossbomb.disableBody(true, true);
                    this.time.delayedCall(300, () => {
                        explosion.destroy();
                    });
                }
            });
            if (this.bossRound > 1) {
                this.bossPhase3();
            } else {
                this.bossBombEvent.destroy();
                this.bossDialogue3();
            }
        });

        //plan to fire world penetrating bombs at the player every second for 20 secs following the player
    }

    bossPhase3 () {
        console.log('phase3')
        this.tweens.add({
            targets: this.zafirBoss,
            alpha: 1,
            duration: 1000,
            ease: 'Linear'
        });

        for (let cycle = 0; cycle < 5; cycle++) {
            this.time.delayedCall(cycle * 6000 - (400 * this.bossRound * 2), () => {
                this.tweens.add({
                    targets: this.zafirBoss,
                    x: this.player.x,
                    y: this.player.y,
                    duration: 2000 - 400 * this.bossRound,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.zafirBoss,
                            x: this.player.x,
                            y: this.player.y,
                            duration: 2000 - 400 * this.bossRound,
                            ease: 'Linear',
                            onComplete: () => {
                                this.tweens.add({
                                    targets: this.zafirBoss,
                                    alpha: 0,
                                    duration: 500,
                                    ease: 'Linear',
                                    onComplete: () => {
                                        this.zafirBoss.setPosition(400, 200);
                                        this.tweens.add({
                                            targets: this.zafirBoss,
                                            alpha: 1,
                                            duration: 500,
                                            ease: 'Linear',
                                        });
                                    }
                                }); 
                            }
                        });
                    }
                });
            });
        }

        this.time.delayedCall(30000 - (400 * this.bossRound * 10), () => {
            this.tweens.add({
                targets: this.zafirBoss,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    this.zafirBoss.setPosition(400, 200);
                    this.tweens.add({
                        targets: this.zafirBoss,
                        alpha: 1,
                        duration: 500,
                        ease: 'Linear',
                    });
                }
            });
            this.time.delayedCall(1000, () => {
                this.tweens.add({
                    targets: this.zafirBoss,
                    x: 400,
                    y: 600,
                    duration: 2000 - 400 * this.bossRound,
                    ease: 'Linear',
                    onComplete: () => {
                        this.zafirBoss.setTint(0x8B0000);
                        this.bossVuln = true;
                    }
                });
            });
        });
        //divebomb player from point it first saw player at (at achievsable pace)
        //then on 6 or 7th hit ground and turn red, and wait until player touches to restart and make harder
        //three waves of these three phases and at the end dummy comes in
        //and dashes in before final dive bomb and out and boss starts shaking, voicelines
        //then explodes and leaves the super ultra star or something
        //game over you win can continue in unlimited with + 5 lives.
    }
    //also at some point add storage and achievements idk somehow ask ai
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
        var missilePowerup = this.missilePowerups.create(x, 166, 'curry').setScale(2);
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
        this.timerText = this.add.text(370, 32, (this.missileTime) + '' , { fontSize: '32px', fill: '#fff' });
        this.missileIcon = this.add.image(320, 42, 'curry').setScale(2);
        this.missileTimerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.missileTime -= 1;
                this.timerText.setText(this.missileTime)
                if (this.missileTime <= 0) {
                    this.player.explodeMissile();
                    this.timerText.setText('');
                    this.missileIcon.destroy();
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
        this.startSuperStarTimer();
        this.time.delayedCall(10000, () => {
            player.setScale(1);
            this.invulnerable -= 1
        }, [], this);
    }

    startSuperStarTimer() {
        this.superStarTime = 10;
        this.timerText = this.add.text(370, 32, (this.superStarTime) + '' , { fontSize: '32px', fill: '#fff' });
        this.starIcon = this.add.image(320, 42, 'star').setScale(2);
        this.superStarTimerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.superStarTime -= 1;
                this.timerText.setText(this.superStarTime)
                if (this.superStarTime <= 0) {
                    this.timerText.setText('');
                    this.starIcon.destroy();
                }
            },
            loop: true
        });
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

    releaseDummy() { 
        var x = this.player.x; 
        var y = this.player.y; 
        var dummy = this.dummies.create(x, y, 'dummy'); 
        dummy.setVelocity(200, -400); 
        dummy.setScale(0.4); 
        dummy.setBounce(1); 
        dummy.setCollideWorldBounds(true); 

        dummy.lives = 3; 
        dummy.text = this.add.text(dummy.x, dummy.y - 60, '' + dummy.lives, { 
            fontSize: '24px', 
            fill: '#fff' 
        }).setOrigin(0.5); 
    }

    hitDummy(bomb, dummy) { 
        dummy.lives -= 1; 
        dummy.text.setText('' + dummy.lives); 
        if (dummy.lives <= 0) { 
            dummy.text.destroy(); 
            dummy.destroy(); 
        } 
    }

}
