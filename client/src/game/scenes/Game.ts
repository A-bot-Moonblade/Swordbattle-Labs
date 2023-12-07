import Phaser from 'phaser';
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin';
import GameState from '../GameState';
import SoundManager from '../SoundManager';
import HUD from '../hud/HUD';
import Safezone from '../biomes/Safezone';
import Biome from '../biomes/Biome';
import { BaseEntity } from '../entities/BaseEntity';
import { Settings } from '../Settings';
import { config } from '../../config';
import { Controls } from '../Controls';

const publicPath = process.env.PUBLIC_URL as string;

export default class Game extends Phaser.Scene {
  gameState: GameState;
  soundManager: SoundManager;
  controls: Controls;
  hud: HUD;

  isReady = false;
  isMobile = false;
  zoom = 1;
  scaleZoom = 1;

	constructor() {
		super('game');
    this.gameState = new GameState(this);
    this.soundManager = new SoundManager(this);
    this.controls = new Controls(this);
    this.hud = new HUD(this);
	}

	init() {
    this.gameState.initialize();
    this.game.canvas.oncontextmenu = (e) => e.preventDefault();
    this.isMobile = this.game.device.os.android || this.game.device.os.iOS;
  }

  preload() {
    this.load.image('fireTile', publicPath + '/assets/game/tiles/fire.jpg');
    this.load.image('earthTile', publicPath + '/assets/game/tiles/grass.jpg');
    this.load.image('iceTile', publicPath + '/assets/game/tiles/ice.png');
    this.load.image('river', publicPath + '/assets/game/tiles/river.png');

    this.load.image('coin', publicPath + '/assets/game/coin.png');
    this.load.image('kill', publicPath + '/assets/game/ui/kill.png');
    this.load.image('house1', publicPath + '/assets/game/house1.png');
    this.load.image('house1roof', publicPath + '/assets/game/house1roof.png');
    this.load.image('mossyRock', publicPath + '/assets/game/Mossy_Rock.png');
    this.load.image('pond', publicPath + '/assets/game/Pond_Earth.png');
    this.load.image('bush', publicPath + '/assets/game/grass.png');
    this.load.image('iceMound', publicPath + '/assets/game/Ice_Mound.png');
    this.load.image('iceSpike', publicPath + '/assets/game/Ice_Spike.png');
    this.load.image('icePond', publicPath + '/assets/game/Ice_Pond.png');
    this.load.image('rock', publicPath + '/assets/game/Rock.png');
    this.load.image('lavaRock', publicPath + '/assets/game/Lava_Rock.png');
    this.load.image('lavaPool', publicPath + '/assets/game/Lava_Pool.png');

    this.load.image('wolfMobPassive', publicPath + '/assets/game/mobs/wolfPassive.png');
    this.load.image('wolfMobAggressive', publicPath + '/assets/game/mobs/wolfAggressive.png');
    this.load.image('bunny', publicPath + '/assets/game/mobs/bunny.png');
    this.load.image('moose', publicPath + '/assets/game/mobs/moose.png');
    this.load.image('chimera', publicPath + '/assets/game/mobs/chimera.png');
    this.load.image('yeti', publicPath + '/assets/game/mobs/yeti.png');
    this.load.image('roku', publicPath + '/assets/game/mobs/roku.png');
    this.load.image('fireball', publicPath + '/assets/game/mobs/fireball.png');
    this.load.image('snowball', publicPath + '/assets/game/mobs/snowball.png');

    this.load.image('chest1', publicPath + '/assets/game/Chest1.png');
    this.load.image('chest2', publicPath + '/assets/game/Chest2.png');
    this.load.image('chest3', publicPath + '/assets/game/Chest3.png');
    this.load.image('chest4', publicPath + '/assets/game/Chest4.png');
    this.load.image('chest5', publicPath + '/assets/game/Chest5.png');
    this.load.image('chest6', publicPath + '/assets/game/Chest6.png');

    this.load.image('player', publicPath + '/assets/game/player/player.png');
    this.load.image('sword', publicPath + '/assets/game/player/sword.png');
    this.load.image('crown', publicPath + '/assets/game/player/crown.png');
    this.load.image('tankOverlay', publicPath + '/assets/game/player/tank.png');
    this.load.image('berserkerOverlay', publicPath + '/assets/game/player/berserker.png');

    this.load.image('hitParticle', publicPath + '/assets/game/particles/hit.png');
    this.load.image('starParticle', publicPath + '/assets/game/particles/star.png');

    this.load.image('chatButton', publicPath + '/assets/game/ui/chat.png');
    this.load.image('abilityButton', publicPath + '/assets/game/ui/ability.png');
    this.load.image('swordThrowButton', publicPath + '/assets/game/ui/swordThrow.png');

    this.load.plugin('rexVirtualJoystick', VirtualJoyStickPlugin, true);

    this.soundManager.load(publicPath);
    Safezone.createTexture(this);
    Biome.initialize(this);
  }

  create() {
    this.cameras.main.setBackgroundColor('#006400');

    this.soundManager.initialize();
    this.hud.initialize();
    this.hud.setShow(false);
    this.controls.initialize();
    this.resize();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('orientationchange', () => {
      if (window.orientation === 0 || window.orientation === 180) { // Portrait
        // if (this.scale.isFullscreen) {
        //   this.scale.startFullscreen();
        // }
      } else { // Landscape
        // this.scale.startFullscreen();
      }
    });
  }

  resize() {
    if (!this.game) return;

    const view = config.viewportSize;
    const resolution = Settings.resolution / 100;
    const scale = window.devicePixelRatio * resolution;
    const width = document.documentElement.clientWidth * scale;
    const height = document.documentElement.clientHeight * scale;
    this.game.scale.resize(width, height);
    this.game.scale.setZoom(1 / scale);

    const cameraScale = Math.max(width / view, height / view);
    this.setScaleZoom(cameraScale);

    this.hud.resize();
    this.gameState.resize();
  }

  updateZoom(zoom: number, duration = 1500) {
    this.zoom = zoom;
    this.cameras.main.zoomTo(zoom * this.scaleZoom, duration, Phaser.Math.Easing.Cubic.InOut, true);
  }

  setScaleZoom(zoom: number) {
    this.scaleZoom = zoom;
    this.cameras.main.setZoom(this.zoom * this.scaleZoom);
  }

  follow(entity: BaseEntity) {
    const camera = this.cameras.main;
    const sprite = entity.container;
    entity.following = false;
    camera.pan(sprite.x, sprite.y, 1500, Phaser.Math.Easing.Cubic.InOut, true, (camera, progress) => {
      if (progress === 1) {
        entity.following = true;
        camera.startFollow(sprite);
        this.gameState.spectator.disable();
      }
    });
  }

	update(time: number, dt: number) {
    if (!this.isReady) {
      this.isReady = true;
    }
    this.soundManager.update(dt);
    this.gameState.updateGraphics(dt);
    this.hud.update(dt);
    this.controls.update();
  }
}
