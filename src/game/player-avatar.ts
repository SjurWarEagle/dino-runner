import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';
import SceneKeys from '~/consts/SceneKeys';
import {PlayerState} from '~/game/PlayerState';
import {GameConfiguration} from '~/helper/game-configuration';

export default class PlayerAvatar extends Phaser.GameObjects.Container {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private player: Phaser.GameObjects.Sprite;
    private mouseState = PlayerState.Running;
    private playerBody: Phaser.Physics.Arcade.Body;
    private overlay: any;
    private sceneWidth = 0;
    private sceneHeight = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        const imageScale = 1 / 2;

        this.player = scene.add
            .sprite(0, 0, TextureKeys.DinoIdle1)
            // .setOrigin(0.25, 0.25)
            .setOrigin(0.25, 1)
            .setScale(imageScale)
            .play(AnimationKeys.DinoRun);

        this.add(this.player);
        // this.add(this.gameOverFlames);

        scene.physics.add.existing(this);
        // this.body = this.body as Phaser.Physics.Arcade.Body;

        // adjust physics body size and offset
        this.playerBody = this.body as Phaser.Physics.Arcade.Body;
        this.playerBody.setSize(this.player.width, this.player.height);

        // get a CursorKeys instance
        this.cursors = scene.input.keyboard.createCursorKeys();

        this.playerBody.setSize(
            this.player.width * imageScale * 0.4,
            this.player.height * imageScale * 0.9
        );
        this.playerBody.setOffset(
            (-this.player.width * imageScale) / 4 + 50,
            this.player.height * -imageScale + 10
        );

        this.overlay = scene.add
            .graphics({
                x: 0,
                y: 0,
            })
            .fillStyle(0xff0000, 0.75)
            .fillEllipse(0, -65, 60, 80)
            // .fillRect(-30,-100,60,100)
            .setAlpha(0);
        this.add(this.overlay);
    }

    public setDimensions(height: number, width: number) {
        this.sceneHeight = height;
        this.sceneWidth = width;
    }

    preUpdate() {
        this.body = this.body as Phaser.Physics.Arcade.Body;
        // console.log(this.body.y, (2 * this.sceneHeight / 3));

        switch (this.mouseState) {
            case PlayerState.Jumping:
                if (this.body.y < this.sceneHeight * 0.2) {
                    console.log('down');
                    this.body.setAccelerationY(-10);
                    this.body.setVelocityY(10);
                }
                if (this.body.velocity.y > 0) {
                    this.mouseState = PlayerState.Falling;
                    this.player.play(AnimationKeys.DinoFall, true);
                }
                break;
            case PlayerState.Falling:
                this.body.setVelocityY(this.body.velocity.y + 20);
                if (this.body.blocked.down) {
                    this.player.play(AnimationKeys.DinoRun, true);
                    this.body.setVelocityX(GameConfiguration.getRunForwardSpeed());
                }
                break;
            case PlayerState.Running:
                if (this.body.blocked.down) {
                    this.player.play(AnimationKeys.DinoRun, true);
                } else if (this.body.velocity.y > 0) {
                    // this.player.play(AnimationKeys.DinoFall, false);
                    this.mouseState = PlayerState.Falling;
                    this.player.play(AnimationKeys.DinoFall, true);
                    // console.log(1)
                }
                // don't forget the break statement
                break;
            case PlayerState.Killed: {
                // // this.gameOverFlames.setVisible(true);
                // // reduce velocity to 99% of current value
                this.playerBody.velocity.x *= 0.99;
                // // once less than 5 we can say stop
                if (this.playerBody.velocity.x <= 50) {
                    this.mouseState = PlayerState.Dead;
                } else if (this.playerBody.velocity.x <= 100) {
                    this.player.play(AnimationKeys.DinoDead);
                    // this.player.play(AnimationKeys.DinoDead, true);
                }
                break;
            }
            case PlayerState.Dead: {
                // make a complete stop
                this.playerBody.setVelocity(0, 0);
                this.scene.scene.run(SceneKeys.GameOver);
                break;
            }
        }
    }

    jump(active: boolean) {
        if (this.mouseState === PlayerState.Jumping
            || this.mouseState === PlayerState.Dead
            || this.mouseState === PlayerState.Killed) {
            return;
        }
        this.body = this.body as Phaser.Physics.Arcade.Body;
        if (active) {
            if (!this.body.blocked.down) {
                return;
            }
            this.playerBody.setVelocityY(-600);
            this.playerBody.setVelocityX(GameConfiguration.getJumpForwardSpeed());
            // this.playerBody.setAccelerationY(200);
            this.mouseState = PlayerState.Jumping;
            this.player.play(AnimationKeys.DinoJump, true);
        }
    }

    hit() {
        // this.playerBody.set
        // this.player.setTint(0xffff00);
        this.scene.tweens.add({
            targets: this.overlay,
            alpha: 0.75,
            ease: 'Cubic.easeOut',
            duration: 100,
            repeat: 0,
            yoyo: true,
        });
    }

    kill() {
        if (
            this.mouseState === PlayerState.Killed ||
            this.mouseState === PlayerState.Dead
        ) {
            return;
        }
        this.mouseState = PlayerState.Killed;
        // console.log("killed called");
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAccelerationY(0);
        body.setVelocity(400, 0);
    }

    setVisible(value: boolean): this {
        return super.setVisible(value);
    }
}
