import Phaser from 'phaser';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';
import PlayerAvatar from '~/game/player-avatar';
import { LootBubble } from '~/game/loot-bubble';
import { GameConfiguration } from '~/helper/game-configuration';
import AnimationKeys from '~/consts/AnimationKeys';
import Group = Phaser.Physics.Arcade.Group;

export default class Game extends Phaser.Scene {
  private CNT_ENEMIES = 1;
  private player!: PlayerAvatar;
  private sky!: Phaser.GameObjects.TileSprite;
  private foreground!: Phaser.GameObjects.TileSprite;
  private midground!: Phaser.GameObjects.TileSprite;
  private bubbles: LootBubble[] = [];
  private enemies!: Group;

  private scoreLabel!: Phaser.GameObjects.Text;
  private score = 0;

  public init() {
    this.score = 0;
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

    this.sky = this.add
      .tileSprite(0, 0, width, height, TextureKeys.Sky1)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(GameConfiguration.FAR_BACKGROUND);
    this.midground = this.add
      .tileSprite(0, 0, width, height, TextureKeys.MidGroud1)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(GameConfiguration.BACKGROUND);
    this.foreground = this.add
      .tileSprite(
        0,
        height - 2 * heightForeground,
        width,
        height,
        TextureKeys.Foreground
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(1, 2)
      .setDepth(GameConfiguration.FOREGROUND);

    this.foreground.height = heightForeground;

    this.enemies = this.physics.add.group();
    this.spawnEnemies();
    this.spawnBubbles();

    this.player = new PlayerAvatar(this, width * 0.25, height - 100);
    this.player.setDimensions(height, width);
    this.player.setDepth(GameConfiguration.PLAYER);
    this.add.existing(this.player);

    // error happens here
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    GameConfiguration.getRunForwardSpeed();

    const marginWorld = height * (1 / 100);
    this.physics.world.setBounds(
      0,
      marginWorld, // x, y
      Number.MAX_SAFE_INTEGER, // width
      height - 2 * marginWorld // height
    );

    this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(-width * 0.35, 0);
    this.cameras.main.setBounds(100, 0, Number.MAX_SAFE_INTEGER, height);

    this.physics.add.overlap(
      this.bubbles,
      this.player,
      this.handleCollectCoin,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.enemies,
      this.player,
      this.handleTouchedEnemy,
      undefined,
      this
    );

    this.scoreLabel = this.add
      .text(10, 10, `Score: ${this.score}`, {
        fontSize: '24px',
        color: '#d3d2d2',
        shadow: {
          fill: true,
          blur: 2,
          offsetX: 2,
          offsetY: 2,
          color: '#000000',
        },
        // padding: {left: 15, right: 15, top: 10, bottom: 10}
      })
      .setScrollFactor(0);

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

  private handleTouchedEnemy(
    obj1: Phaser.GameObjects.GameObject,
    touchedEnemy: Phaser.GameObjects.GameObject
  ) {
    //const player = obj1 as Phaser.Physics.Arcade.Sprite;
    const enemy = touchedEnemy as Phaser.Physics.Arcade.Sprite;

    if (enemy.getData('touched')) {
      return;
    }
    enemy.body.enable = false;
    enemy.visible = false;

    this.player.hit();
    this.player.kill();
  }

  // noinspection JSUnusedLocalSymbols
  private handleCollectCoin(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    // eslint-disable-next-line
    const bubble = obj1 as Phaser.Physics.Arcade.Sprite;
    //FIXME this.coins.killAndHide(coin);

    // and turn off the physics body
    bubble.body.enable = false;
    bubble.setVisible(false);

    this.score++;
    this.scoreLabel.text = `Score: ${this.score}`;
  }

  private spawnEnemies() {
    this.enemies.children.each((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      this.enemies.killAndHide(enemy);
      enemy.body.enable = false;
    });
    for (let cnt = 0; cnt < this.CNT_ENEMIES; cnt++) {
      this.spawnEnemy();
    }
  }

  private spawnEnemy() {
    const width = this.scale.width;
    const height = this.scale.height;

    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    const x = rightEdge + Phaser.Math.Between(0, 2 * width);
    const y = height - 10;

    const enemy = (
      this.enemies.get(
        x,
        y,
        TextureKeys.MonkeyRun1
      ) as Phaser.Physics.Arcade.Sprite
    )
      .setFlipX(true)
      .setOrigin(1, 1)
      .setOffset(0, 10)
      .setDepth(GameConfiguration.PLAYER)
      .play(AnimationKeys.MonkeyRun);

    enemy.setData('touched', false);
    this.add.existing(enemy);

    const body = enemy.body as Phaser.Physics.Arcade.StaticBody;
    enemy.setCollideWorldBounds(true);
    enemy.setVelocityX(-200);
    enemy.setVisible(true);
    enemy.setActive(true);

    // body.setCircle(body.width * 0.015)
    body.enable = true;

    body.updateFromGameObject();
  }

  private wrapEnemies() {
    const scrollX = this.cameras.main.scrollX;

    this.enemies.children.each((child) => {
      const enemy = child as Phaser.Physics.Arcade.Sprite;
      const body = enemy.body as Phaser.Physics.Arcade.StaticBody;
      const width = body.width;

      if (enemy.x + width < scrollX) {
        this.enemies.killAndHide(enemy);
        enemy.body.enable = false;
        this.spawnEnemy();
      }
    });
  }

  private wrapBubbles() {
    // const width = this.scale.width;
    // const height = this.scale.height;

    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    this.bubbles.forEach((bubble) => {
      const body = bubble.body as Phaser.Physics.Arcade.StaticBody;
      const width = body.width;

      if (body.x + width < scrollX) {
        const x = rightEdge + Phaser.Math.Between(100, 1000);
        const y = Phaser.Math.Between(100, 100 + this.scale.height / 2);
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

    this.wrapEnemies();
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
