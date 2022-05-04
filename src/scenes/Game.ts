import Phaser from 'phaser';
import SceneKeys from "~/consts/SceneKeys";
import TextureKeys from '~/consts/TextureKeys';
import PlayerAvatar from "~/game/player-avatar";
import LiveDisplay from "~/game/LiveDisplay";
import AnimationKeys from "~/consts/AnimationKeys";
import {LootBubble} from "~/game/loot-bubble";
import {ConstOrdering} from "~/helper/const-ordering";

export default class Game extends Phaser.Scene {
    private CNT_COINS = 10;
    private CNT_EAGLES = 4;
    // create the background class property
    private player!: PlayerAvatar;
    private sky!: Phaser.GameObjects.TileSprite;
    private foreground!: Phaser.GameObjects.TileSprite;
    private midground!: Phaser.GameObjects.TileSprite;
    private bubbles: LootBubble[] = [];

    private scoreLabel!: Phaser.GameObjects.Text;
    private score = 0;
    private lifes = 3;
    private eagles!: Phaser.Physics.Arcade.StaticGroup;
    private liveDisplay!: LiveDisplay;

    public init() {
        this.score = 0;
        this.lifes = 3;
    }

    constructor() {
        super(SceneKeys.Game);
    }

    public create() {
        const height = this.scale.height;
        const width = this.scale.width;
        const heightForeground = 60;

        this.scale.displaySize.setAspectRatio(width / height);
        this.scale.refresh();

        this.sky = this.add.tileSprite(0, 0, width, height, TextureKeys.Sky1)
            .setOrigin(0, 0)
            .setScrollFactor(0, 0)
            .setDepth(ConstOrdering.FAR_BACKGROUND)
        ;
        this.midground = this.add.tileSprite(0, 0, width, height, TextureKeys.MidGroud1)
            .setOrigin(0, 0)
            .setScrollFactor(0, 0)
            .setDepth(ConstOrdering.BACKGROUND)
        ;
        this.foreground = this.add.tileSprite(0, height - 2*heightForeground, width, height, TextureKeys.Foreground)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setScale(1,2)
            .setDepth(ConstOrdering.FOREGROUND)
        ;

        this.foreground.height = heightForeground;
        // this.foreground.z = -5;
        // this.sky.z = 20;
        // this.midground.z = -10;
        // this.foreground.scaleX = 2;

        this.liveDisplay = new LiveDisplay(this);

        this.add.existing(this.liveDisplay);

        // this.bubbles = this.physics.add.staticGroup();
        this.spawnBubbles();

        this.eagles = this.physics.add.staticGroup();
        this.spawnEagles();

        // add new RocketMouse
        this.player = new PlayerAvatar(this, width * 0.25, height - 100);
        this.player.setDepth(ConstOrdering.PLAYER);
        this.add.existing(this.player);

        // error happens here
        const body = this.player.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setVelocityX(200);

        const marginWorld = height * (1 / 100);
        this.physics.world.setBounds(
            0, marginWorld, // x, y
            Number.MAX_SAFE_INTEGER,  // width
            height - 2 * marginWorld // height
        );

        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(-width * 0.35, 0);
        this.cameras.main.setBounds(100, 0, Number.MAX_SAFE_INTEGER, height);

        // this.physics.add.overlap(
        //     this.laserObstacle.top,
        //     this.player,
        //     this.handleTouchedGateBorder,
        //     undefined,
        //     this
        // );
        //

        this.physics.add.overlap(
            this.bubbles,
            this.player,
            this.handleCollectCoin,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.eagles,
            this.player,
            this.handleTouchedEagle,
            undefined,
            this
        );

        this.scoreLabel = this.add.text(10, 10, `Score: ${this.score}`, {
            fontSize: '24px',
            color: '#d3d2d2',
            shadow: {fill: true, blur: 2, offsetX: 2, offsetY: 2, color: '#000000'},
            // padding: {left: 15, right: 15, top: 10, bottom: 10}
        }).setScrollFactor(0);

        // this.liveLabel = this.add.text(10, 50, `Lives: ${this.lifes}`, {
        //     fontSize: '12px',
        //     color: '#bbbbbb',
        //     backgroundColor: '#2646c6',
        //     shadow: {fill: true, blur: 0, offsetY: 0},
        //     padding: {left: 15, right: 15, top: 10, bottom: 10}
        // }).setScrollFactor(0)
        this.liveDisplay.updateLifes(this.lifes);

        this.input.mouse.disableContextMenu();
        this.input.mouse.enabled = true;
        this.input.on('pointerdown', () => {
            this.player.jump(true);
        });
        this.input.on('pointerup', () => {
            this.player.jump(false);
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.player.jump(true);
        });
        this.input.keyboard.on('keyup-SPACE', () => {
            this.player.jump(false);
        });

    }

    private handleTouchedEagle(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        //const player = obj1 as Phaser.Physics.Arcade.Sprite;
        const eagle = obj2 as Phaser.Physics.Arcade.Sprite;

        if (eagle.getData('touched')) {
            return;
        }
        eagle.body.enable = false;

        this.lifes--;
        this.player.hit();
        this.liveDisplay.updateLifes(this.lifes);

        if (this.lifes <= 0) {
            this.player.kill();
        }
    }

    // noinspection JSUnusedLocalSymbols
    private handleCollectCoin(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        // eslint-disable-next-line
        const bubble = obj1 as Phaser.Physics.Arcade.Sprite;
        const player = obj2 as Phaser.Physics.Arcade.Sprite;
        // use the group to hide it
        //console.log(player);
        //console.log(bubble);
        //FIXME this.coins.killAndHide(coin);

        // and turn off the physics body
        bubble.body.enable = false;
        bubble.setVisible(false);

        this.score++;
        this.scoreLabel.text = `Score: ${this.score}`;
    }


    private spawnEagles() {
        this.eagles.children.each(child => {
            const eagle = child as Phaser.Physics.Arcade.Sprite;
            this.eagles.killAndHide(eagle);
            eagle.body.enable = false;
        });
        for (let cnt = 0; cnt < this.CNT_EAGLES; cnt++) {
            this.spawnEagle();
        }
    }

    private spawnEagle() {
        const width = this.scale.width;
        const height = this.scale.height;

        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        const x = rightEdge + Phaser.Math.Between(0, 2 * width);
        const y = Phaser.Math.Between(50, height - 50);

        const eagle = (this.eagles.get(x, y, TextureKeys.EagleFly) as Phaser.Physics.Arcade.Sprite)
            .setFlipX(true)
            .setOrigin(0.5, 1)
            .setScale(0.25)
            .play(AnimationKeys.EagleFly);
        // this.isOverlappingExistingEntry(eagle);

        eagle.setData('touched', false);

        const body = eagle.body as Phaser.Physics.Arcade.StaticBody;
        // body.setAccelerationY(-200);
        // body.setVelocityX(-20);
        eagle.setVisible(true);
        eagle.setActive(true);

        // body.setCircle(body.width * 0.015)
        body.enable = true;

        body.updateFromGameObject();
    }

    private wrapEagle() {
        // const width = this.scale.width;
        // const height = this.scale.height;

        const scrollX = this.cameras.main.scrollX;
        // const rightEdge = scrollX + this.scale.width


        this.eagles.children.each(child => {
            const eagle = child as Phaser.Physics.Arcade.Sprite;
            const body = eagle.body as Phaser.Physics.Arcade.StaticBody;
            const width = body.width;


            if (eagle.x + width < scrollX) {
                this.eagles.killAndHide(eagle);
                eagle.body.enable = false;
                this.spawnEagle();
            }

            // console.log(eagle.x,scrollX);

            // if (eagle.position.x < scrollX) {
            //     eagle.position.x = scrollX + width;
            //     eagle.position.y = Phaser.Math.Between(50, height - 50);
            //     // console.log(Phaser.Math.Between(50, height - 50));
            // }
        });
        // body variable with specific physics body type
        // const body = this.laserObstacle.body as
        //     Phaser.Physics.Arcade.StaticBody
        // // use the body's width
        // const width = body.width
        // if (this.laserObstacle.x + width < scrollX) {
        //     if (!this.laserObstacle.touched) {
        //         this.missedObstacle();
        //     }
        //     this.laserObstacle.x = Phaser.Math.Between(
        //         rightEdge + width,
        //         rightEdge + width + 1000
        //     )
        //     this.laserObstacle.y = Phaser.Math.Between(0, 300)
        //     // set the physics body's position
        //     // add body.offset.x to account for x offset
        //     body.position.x = this.laserObstacle.x + body.offset.x
        //     body.position.y = this.laserObstacle.y + body.offset.y;
        //     this.laserObstacle.touched = false;
        //
        //     this.laserObstacle.updateBorders();
        //     this.laserObstacle.resetTouched();
        // }
    }

    private wrapBubbles() {
        // const width = this.scale.width;
        // const height = this.scale.height;

        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;


        this.bubbles.forEach(bubble => {
            const body = bubble.body as Phaser.Physics.Arcade.StaticBody;
            const width = body.width;


            if (body.x + width < scrollX) {
                const x = rightEdge + Phaser.Math.Between(100, 1000);
                const y = Phaser.Math.Between(100, this.scale.height - 100);
                body.x = x;
                body.y = y;

                body.enable = true;
                bubble.setVisible(true);

                bubble.initSpeed();
            }
        });
    }

    update() {
        // scroll the background
        this.sky.setTilePosition(this.cameras.main.scrollX * 0.25);
        this.midground.setTilePosition(this.cameras.main.scrollX * 0.5);
        this.foreground.setTilePosition(this.cameras.main.scrollX);

        this.wrapEagle();
        this.wrapBubbles();
    }

    private spawnBubbles() {
        for (let i = 0; i < 5; ++i) {
            this.generateBubble();
        }
    }

    private generateBubble() {
        // console.log('generateBubble');
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        const x = rightEdge + Phaser.Math.Between(100, 1000);
        const y = Phaser.Math.Between(100, this.scale.height - 100);

        const bubble = new LootBubble(this, x, y);
        // this.add.existing(bubble);

        this.bubbles.push(bubble);
    }

}
