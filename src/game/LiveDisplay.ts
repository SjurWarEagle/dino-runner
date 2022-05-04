import Phaser from 'phaser';
import TextureKeys from "~/consts/TextureKeys";

export default class LiveDisplay extends Phaser.GameObjects.Container {
    private maxLives = 5;
    private currentLifes = 3;
    public touched = false;
    private myScene: Phaser.Scene;
    private hearts: Phaser.GameObjects.Image[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.myScene = scene;

        this.generateIcons();
        scene.add.existing(this);
        // const liveUsed = (liveHearts.get(0, 0, TextureKeys.LiveUsed) as Phaser.Physics.Arcade.Sprite)
        //     .setOrigin(0.5, 0);
        //
        // this.add(liveUsed);

        // scene.physics.add.existing(this.top, true);
        // scene.physics.add.existing(this.bottom, true);
        // this.bottom.setActive(true);
        // this.top.setActive(true);

        // const topBody = this.top.body as Phaser.Physics.Arcade.StaticBody;
        // topBody.setCircle(topBody.width * 0.5);

        scene.physics.add.existing(this, true);
        const body = this.body as Phaser.Physics.Arcade.StaticBody;
        //body.setSize(width, height)
        body.position.x = this.x + body.offset.x;
    }

    private generateIcons() {
        const width = 50;
        const height = 50;

        const x: number = this.scene.scale.width - width * 1.5;
        const y = 10;

        // add them all to the Container
        for (let cnt = 0; cnt < this.maxLives; cnt++) {
            let heart;
            if (this.currentLifes > cnt) {
                heart = this.scene.add.image(x - width * cnt, y, TextureKeys.LiveAvailable);
            } else {
                heart = this.scene.add.image(x - width * cnt, y, TextureKeys.LiveUsed);
            }
            heart.setDisplayOrigin(0, 0);
            heart.setScrollFactor(0);
            heart.setDisplaySize(width, height);
            heart.setSize(width, height);
            this.add(heart);

            this.hearts.push(heart);
        }
    }

// private initBorderTop(border: Phaser.GameObjects.Image, scene: Phaser.Scene) {
    //     this.initBorderCommon(border, scene);
    // }

    // private initBorderBottom(border: Phaser.GameObjects.Image, scene: Phaser.Scene, offset: number) {
    //     this.initBorderCommon(border, scene);
    // const body = (border.body as Phaser.Physics.Arcade.StaticBody);
    // body.position.y = body.position.y + offset;
    // }

    // private initBorderCommon(border: Phaser.GameObjects.Image, scene: Phaser.Scene) {
    //     scene.physics.add.existing(this.top, true);
    //     const body = (border.body as Phaser.Physics.Arcade.StaticBody);
    //     body.setSize(border.displayWidth, border.displayHeight);
    //     body.position.x = this.x - body.width / 2;
    //     body.position.y = this.y;
    // }

    // public resetTouched() {
    //     this.top.setData('touched', false);
    //     this.middle.setData('touched', false);
    //     this.bottom.setData('touched', false);
    // }

    // public updateBorders() {
    //     this.initBorderTop(this.top, this.myScene);
    //     this.initBorderBottom(this.bottom, this.myScene, this.top.displayHeight + this.middle.displayHeight);
    // }
    public updateLifes(lifes: number): void {
        this.currentLifes = lifes;

        this.hearts.forEach(heart => {
            heart.removedFromScene();
            heart.visible=false;
        });
        this.generateIcons();
    }
}
