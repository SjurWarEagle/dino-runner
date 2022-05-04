import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKeys";
import SceneKeys from "~/consts/SceneKeys";
import AnimationKeys from "~/consts/AnimationKeys";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Preloader);
    }

    preload() {
        this.load.image(TextureKeys.Coin, "house/object_coin.png");

        this.load.atlas(
            TextureKeys.Bubble,
            "characters/bubble/bubble.png",
            "characters/bubble/bubble.json"
        );

        this.load.image(TextureKeys.Sky1, "background/bg_3_sky_1.png");
        this.load.image(TextureKeys.Sky2, "background/bg_3_sky_2.png");
        this.load.image(TextureKeys.Foreground, "background/bg_1_foreground.png");
        this.load.image(TextureKeys.MidGroud1, "background/bg_2_midground_1.png");
        this.load.image(TextureKeys.MidGroud2, "background/bg_2_midground_2.png");

        this.load.image(TextureKeys.Clouds, "clouds/clouds-white.png");
        this.load.image(TextureKeys.CloudsSmall, "clouds/clouds-white-small.png");

        this.load.image(TextureKeys.DinoDead1, "characters/dino/Dead (1).png");
        this.load.image(TextureKeys.DinoDead2, "characters/dino/Dead (2).png");
        this.load.image(TextureKeys.DinoDead3, "characters/dino/Dead (3).png");
        this.load.image(TextureKeys.DinoDead4, "characters/dino/Dead (4).png");
        this.load.image(TextureKeys.DinoDead5, "characters/dino/Dead (5).png");
        this.load.image(TextureKeys.DinoDead6, "characters/dino/Dead (6).png");
        this.load.image(TextureKeys.DinoDead7, "characters/dino/Dead (7).png");
        this.load.image(TextureKeys.DinoDead8, "characters/dino/Dead (8).png");

        this.load.image(TextureKeys.DinoRun1, "characters/dino/Run (1).png");
        this.load.image(TextureKeys.DinoRun2, "characters/dino/Run (2).png");
        this.load.image(TextureKeys.DinoRun3, "characters/dino/Run (3).png");
        this.load.image(TextureKeys.DinoRun4, "characters/dino/Run (4).png");
        this.load.image(TextureKeys.DinoRun5, "characters/dino/Run (5).png");
        this.load.image(TextureKeys.DinoRun6, "characters/dino/Run (6).png");
        this.load.image(TextureKeys.DinoRun7, "characters/dino/Run (7).png");
        this.load.image(TextureKeys.DinoRun8, "characters/dino/Run (8).png");

        this.load.image(TextureKeys.DinoIdle1, "characters/dino/Idle (1).png");
        this.load.image(TextureKeys.DinoIdle2, "characters/dino/Idle (2).png");
        this.load.image(TextureKeys.DinoIdle3, "characters/dino/Idle (3).png");
        this.load.image(TextureKeys.DinoIdle4, "characters/dino/Idle (4).png");
        this.load.image(TextureKeys.DinoIdle5, "characters/dino/Idle (5).png");
        this.load.image(TextureKeys.DinoIdle6, "characters/dino/Idle (6).png");
        this.load.image(TextureKeys.DinoIdle7, "characters/dino/Idle (7).png");
        this.load.image(TextureKeys.DinoIdle8, "characters/dino/Idle (8).png");
        this.load.image(TextureKeys.DinoIdle9, "characters/dino/Idle (9).png");

        this.load.image(TextureKeys.DinoJump1, "characters/dino/Jump (1).png");
        this.load.image(TextureKeys.DinoJump2, "characters/dino/Jump (2).png");
        this.load.image(TextureKeys.DinoJump3, "characters/dino/Jump (3).png");
        this.load.image(TextureKeys.DinoJump4, "characters/dino/Jump (4).png");
        this.load.image(TextureKeys.DinoJump5, "characters/dino/Jump (5).png");
        this.load.image(TextureKeys.DinoJump6, "characters/dino/Jump (6).png");
        this.load.image(TextureKeys.DinoJump7, "characters/dino/Jump (7).png");
        this.load.image(TextureKeys.DinoJump8, "characters/dino/Jump (8).png");
        this.load.image(TextureKeys.DinoJump9, "characters/dino/Jump (9).png");
        this.load.image(TextureKeys.DinoJump10, "characters/dino/Jump (10).png");
        this.load.image(TextureKeys.DinoJump11, "characters/dino/Jump (11).png");
        this.load.image(TextureKeys.DinoJump12, "characters/dino/Jump (12).png");

        this.load.image(TextureKeys.MonkeyRun1, "characters/monkey/monkey_run_1.png");
        this.load.image(TextureKeys.MonkeyRun2, "characters/monkey/monkey_run_2.png");
        this.load.image(TextureKeys.MonkeyRun3, "characters/monkey/monkey_run_3.png");
        this.load.image(TextureKeys.MonkeyRun4, "characters/monkey/monkey_run_4.png");
        this.load.image(TextureKeys.MonkeyRun5, "characters/monkey/monkey_run_5.png");
        this.load.image(TextureKeys.MonkeyRun6, "characters/monkey/monkey_run_6.png");
        this.load.image(TextureKeys.MonkeyRun7, "characters/monkey/monkey_run_7.png");

        // this.load.image(TextureKeys.IslandHill, 'islands/island_hill.png');

        this.load.image(
            TextureKeys.LiveAvailable,
            "characters/circle-gold-colored-01-heart-400.png"
        );
        this.load.image(
            TextureKeys.LiveUsed,
            "characters/circle-gold-mono-01-heart-400.png"
        );
    }

    create() {
        this.anims.create({
            key: AnimationKeys.DinoRun,
            // helper to generate frames
            frames: [
                {key: TextureKeys.DinoRun1},
                {key: TextureKeys.DinoRun2},
                {key: TextureKeys.DinoRun3},
                {key: TextureKeys.DinoRun4},
                {key: TextureKeys.DinoRun5},
                {key: TextureKeys.DinoRun6},
                {key: TextureKeys.DinoRun7},
                {key: TextureKeys.DinoRun8, duration: 50},
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: AnimationKeys.DinoDead,
            // helper to generate frames
            frames: [
                {key: TextureKeys.DinoDead1},
                {key: TextureKeys.DinoDead2},
                {key: TextureKeys.DinoDead3},
                {key: TextureKeys.DinoDead4},
                {key: TextureKeys.DinoDead5},
                {key: TextureKeys.DinoDead6},
                {key: TextureKeys.DinoDead7},
                {key: TextureKeys.DinoDead8, duration: 50},
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: AnimationKeys.DinoIdle,
            // helper to generate frames
            frames: [
                {key: TextureKeys.DinoIdle1},
                {key: TextureKeys.DinoIdle2},
                {key: TextureKeys.DinoIdle3},
                {key: TextureKeys.DinoIdle4},
                {key: TextureKeys.DinoIdle5},
                {key: TextureKeys.DinoIdle6},
                {key: TextureKeys.DinoIdle7},
                {key: TextureKeys.DinoIdle8},
                {key: TextureKeys.DinoIdle9, duration: 50},
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: AnimationKeys.DinoJump,
            // helper to generate frames
            frames: [
                {key: TextureKeys.DinoJump1},
                {key: TextureKeys.DinoJump2},
                {key: TextureKeys.DinoJump3},
                {key: TextureKeys.DinoJump4},
                {key: TextureKeys.DinoJump5},
                {key: TextureKeys.DinoJump6},
                {key: TextureKeys.DinoJump7},
                {key: TextureKeys.DinoJump8},
                {key: TextureKeys.DinoJump9},
                {key: TextureKeys.DinoJump10},
                {key: TextureKeys.DinoJump11},
                {key: TextureKeys.DinoJump12, duration: 50},
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: AnimationKeys.DinoFall,
            // helper to generate frames
            frames: [
                {key: TextureKeys.DinoJump1},
                {key: TextureKeys.DinoJump2},
                {key: TextureKeys.DinoJump3},
                {key: TextureKeys.DinoJump4},
                {key: TextureKeys.DinoJump5},
                {key: TextureKeys.DinoJump6},
                {key: TextureKeys.DinoJump7},
                {key: TextureKeys.DinoJump8},
                {key: TextureKeys.DinoJump9},
                {key: TextureKeys.DinoJump10},
                {key: TextureKeys.DinoJump11},
                {key: TextureKeys.DinoJump12, duration: 50},
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: AnimationKeys.Bubble,
            frames: this.anims.generateFrameNames(TextureKeys.Bubble, {
                start: 1,
                end: 30,
                zeroPad: 2,
                prefix: "Bubble",
                suffix: "",
            }),
            frameRate: 20,
            repeat: -1,
        });

        this.scene.start(SceneKeys.StartPage);
    }
}
