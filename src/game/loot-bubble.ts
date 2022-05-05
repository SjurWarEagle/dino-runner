import Phaser from "phaser";
import TextureKeys from "~/consts/TextureKeys";
import AnimationKeys from "~/consts/AnimationKeys";

export class LootBubble extends Phaser.GameObjects.Container {
  private bubble!: Phaser.Physics.Arcade.Body | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    const width = 60;
    const height = 50;

    const bubble = scene.add
      .sprite(width / 2, height / 2, TextureKeys.Bubble)
      .setDisplaySize(width, height)
      //TODO .setOrigin(-0.3, -0.3)
      .play(AnimationKeys.Bubble);

    const coin = scene.add
      .sprite(width / 2, height / 2, TextureKeys.Coin)
      .setDisplaySize(width * 0.75, height * 0.75);
    //TODO .setOrigin(-0.3, -0.3)

    this.add(coin);
    this.add(bubble);

    scene.physics.add.existing(this);
    scene.add.existing(bubble);
    this.bubble = this.body as Phaser.Physics.Arcade.Body;

    this.initSpeed();

    this.bubble.updateFromGameObject();
    this.bubble.setCollideWorldBounds(false);

    scene.add.existing(this);
    this.visible = true;
    this.bubble.enable = true;
  }

  remove(
    child: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[],
    destroyChild?: boolean
  ): any {
    //FIXME this empty method is only here to prevent removal
    // yes this causes a memory leak but without it causes an exception on scene change.
    // did not find a better waay to handle this.
  }

  destroy(destroyChild?: boolean): any {
    //FIXME this empty method is only here to prevent removal
    // yes this causes a memory leak but without it causes an exception on scene change.
    // did not find a better waay to handle this.
  }

  preUpdate() {
    this.body = this.body as Phaser.Physics.Arcade.Body;
  }

  initSpeed() {
    const gravity = -1 * (this.scene.physics.config.gravity?.y || 0);
    const deltaY = Phaser.Math.Between(-5, 5);
    const deltaX = Phaser.Math.Between(-2, 2);
    this.bubble!.setAccelerationY(gravity + deltaY);
    this.bubble!.setAccelerationX(deltaX);
    this.bubble!.setVelocity(0, 0);
  }
}
