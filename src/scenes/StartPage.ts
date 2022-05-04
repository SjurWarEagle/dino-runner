import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import TextureKeys from "~/consts/TextureKeys";

export default class StartPage extends Phaser.Scene {
  private intervalBlink!: number;

  constructor() {
    super(SceneKeys.StartPage);
  }

  create() {
    // object destructuring
    const { width, height } = this.scale;
    // x, y will be middle of screen
    const horizontalCenter = width * 0.5;
    let y;

    y = height * 0.25;

    this.add.image(horizontalCenter, y, TextureKeys.Coin);
    this.add
      .text(horizontalCenter - 150, y, "Points:", {
        fontSize: "32px",
        color: "#FFFFFF",
        // backgroundColor: '#000000',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    y = height * 0.5;
    this.add
      .text(horizontalCenter - 150, y, "Avoid:", {
        fontSize: "32px",
        color: "#FFFFFF",
        // backgroundColor: '#000000',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    const eagle = this.add.image(horizontalCenter, y, TextureKeys.EagleFly);
    eagle.setScale(0.25);
    // eagle.set

    y = height * 0.75;
    // add the text with some styling
    const textContinue = this.add
      .text(horizontalCenter, y, "press anything", {
        fontSize: "32px",
        color: "#FFFFFF",
        // backgroundColor: '#000000',
        shadow: { fill: true, blur: 0, offsetY: 0 },
        padding: { left: 15, right: 15, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    let marker = false;
    this.intervalBlink = setInterval(() => {
      if (marker) {
        textContinue.setColor("#FFFFFF");
      } else {
        textContinue.setColor("#000000");
      }
      marker = !marker;
    }, 500);

    // listen for the Space bar getting pressed once

    if (this.game.input.activePointer.leftButtonDown()) {
      this.startGame();
    }
    this.input.keyboard.once("keyup-SPACE", () => {
      this.startGame();
    });
    this.input.on("pointerup", () => {
      this.startGame();
    });
    this.startGame();
  }

  startGame() {
    if (this.intervalBlink) {
      clearInterval(this.intervalBlink);
    }

    // stop the GameOver scene
    this.scene.stop(SceneKeys.StartPage);
    // stop and restart the Game scene
    this.scene.stop(SceneKeys.Game);
    this.scene.start(SceneKeys.Game);
  }
}
