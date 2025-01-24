let phaser_game,
  files_preloaded = false,
  game = null,
  landscape = "landscape" == loading_vars.orientation,
  is_localhost =
    "127.0.0.1" == location.hostname ||
    "localhost" == location.hostname ||
    loading_vars.net_id == "localhost",
  allow_rewarded_ads = false,
  allow_intersitial_ads = false,
  temp_user_data = null,
  paused = false;

window.onload = function () {
  initialize(function () {
    let gameConfig = get_game_config();
    game_request = new GameRequest();
    game_request.request({ get_game_info: true }, function (params) {
      if ("user_data" in params) {
        temp_user_data = params["user_data"];
      }
      gameConfig["scene"] = mainGame;
      phaser_game = new Phaser.Game(gameConfig);
      window.focus();
    });
  });

  let elem = document.getElementById("preload");
  if (elem) elem.style.display = "none";
};
class mainGame extends Phaser.Scene {
  constructor() {
    super("MainGame");
  }
  preload() {
    this.load.once("complete", this.preload_files, this);
  }
  preload_files() {
    if (loading_vars["codecanyon_live"]) this.load.setPath("../");
    this.load.atlas("common1", "assets/common1.png", "assets/common1.json");
    this.load.image("back", "./assets/bgs/back.png");
    this.load.bitmapFont(
      "font",
      "assets/fonts/font.png",
      "assets/fonts/font.xml"
    );
    this.load.plugin(
      "rexcircularprogressplugin",
      "./external/circular_plugin.js",
      true
    );
    if (loading_vars["js_combined"]) {
      this.load.script("all", "bundle.js");
    } else {
      this.load.script("main_game", "js/game.js");
      this.load.script("social_api", "js/game_utilities/social_api.js");
      this.load.script("game_utils", "js/game_utilities/game_utils.js");
      this.load.script("custom_button", "js/game_utilities/custom_button.js");
      this.load.script("audio_manager", "js/game_utilities/audio_manager.js");
      this.load.script(
        "graphics_manager",
        "js/game_utilities/graphics_manager.js"
      );
      this.load.script(
        "test_ad_manager",
        "js/game_utilities/test_ad_manager.js"
      );
      this.load.script("game_map", "js/game_map/game_map.js");
      this.load.script("game_play", "js/game_play/game_play.js");
      this.load.script("shop", "js/shop/shop.js");
      this.load.script("game_windows", "js/game_windows/game_windows.js");
      this.load.script("select_language", "js/game_windows/select_language.js");
      this.load.script("remove_ads", "js/game_windows/remove_ads.js");
      this.load.script(
        "purchase_success",
        "js/game_windows/purchase_success.js"
      );
      this.load.script("purchase_failed", "js/game_windows/purchase_failed.js");
      this.load.script("level_start", "js/game_windows/level_start.js");
      this.load.script("level_failed", "js/game_windows/level_failed.js");
      this.load.script("level_finished", "js/game_windows/level_finished.js");
      for (let i = 1; i <= 9; ++i) {
        this.load.image(`bird${i}`, `assets/bird_anim/${i}.png`);
      }
    }
    this.load.xml("language_xml", "assets/xml/language.xml");
    this.load.on("progress", (value) => {
      if (Math.round(value * 100) == 100) this.load.off("progress");
    });
    this.load.once("complete", () => {
      files_preloaded = true;
      this.create_game();
    });
    this.load.start();
  }
  create_game() {
    // this.physics.world.createDebugGraphic();
    // this.physics.world.drawDebug = true;
    // this.physics.world.debugGraphic.visible = true;

    game_data.scene = this;
    temp_user_data &&
      (update_object(game_data.user_data, temp_user_data),
      (temp_user_data = null));
    game = new Game(this);
    game.prepare_game();

    const birdFrames = [];
    for (let i = 1; i <= 9; ++i) {
      birdFrames.push({ key: `bird${i}` });
    }
    this.anims.create({
      key: "birdAnimation",
      frames: birdFrames,
      frameRate: 5,
      repeat: -1,
    });
  }
  update(time, delta) {
    if (game) game.update(time, delta);
  }
}

function update_object(obj1, obj2) {
  for (let prop in obj2) {
    obj1[prop] = obj2[prop];
  }
}

function initialize(on_complete) {
  if (loading_vars["net_id"] === "y") {
    YAPI.startGame()
      .then((params) => {
        let { id } = params;
        loading_vars["user_id"] = id;
        allow_rewarded_ads = true;
        allow_intersitial_ads = true;
        on_complete();
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    // localhost version
    loading_vars["user_id"] = "0";
    allow_rewarded_ads = true;
    allow_intersitial_ads = true;
    on_complete();
  }
}

function get_game_config() {
  loading_vars["default_W"] = parseInt(loading_vars["W"]);
  loading_vars["default_H"] = parseInt(loading_vars["H"]);
  loading_vars["extra_W"] = 0;
  loading_vars["extra_H"] = 0;

  let base_ratio = loading_vars["W"] / loading_vars["H"];
  let def_w = parseInt(loading_vars["W"]);
  let def_h = parseInt(loading_vars["H"]);
  let ratio = window.innerWidth / window.innerHeight;

  if (loading_vars["mobile"] && window.innerWidth < window.innerHeight)
    ratio = window.innerHeight / window.innerWidth;

  if (is_localhost || loading_vars["mobile"]) {
  } else ratio = base_ratio;

  if (is_localhost) ratio = base_ratio;
  //ratio = 2.2
  if (ratio > 2.2) ratio = 2.2;
  if (loading_vars["W"] < loading_vars["H"] * ratio) {
    loading_vars["W"] = parseInt(loading_vars["H"] * ratio);
    loading_vars["extra_W"] = loading_vars["W"] - def_w;
    loading_vars["extra_H"] = loading_vars["H"] - def_h;
  }
  let mobile_device = loading_vars["mobile"];
  let config = {
    type: Phaser.WEBGL,
    parent: "phaser_game",
    width: loading_vars["W"],
    height: loading_vars["H"],
    backgroundColor: 0x000000,

    clearBeforeRender: loading_vars["mobile"] ? false : true,
    render: {
      powerPreference: "high-performance",
    },
  };
  if (mobile_device) {
    config["scale"] = {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    };
  } else {
    config["scale"] = {
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    };

    config["scale"].mode = Phaser.Scale.FIT;
    config["fullscreenTarget"] = "phaser_game";
  }

  config["physics"] = {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
      },
    },
  };
  return config;
}

function pause() {
  game_data.unpaused = 0;
  game_data.audio_manager && game_data.audio_manager.update_volume();
  game_data.game_root && game_data.game_root.block_interface();
  paused = true;
  game_data.scene && (game_data.scene.game.input.enabled = false);
  game_data && game_data.game_play && game_data.game_play.pause_timer();
  game_data.scene.physics.world.pause();
  console.log("pause");
}

function resume() {
  game_data.unpaused = 1;
  game_data.audio_manager && game_data.audio_manager.update_volume();
  game_data.game_root && game_data.game_root.unblock_interface();
  paused = false;
  game_data.scene && (game_data.scene.game.input.enabled = true);
  !game_data ||
    !game_data.game_play ||
    (game_data.game_windows && game_data.game_windows.game_window) ||
    game_data.game_play.resume_timer();
  game_data.scene.physics.world.resume();
  console.log("resume");
}
