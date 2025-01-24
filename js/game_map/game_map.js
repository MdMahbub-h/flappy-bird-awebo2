var GameMap = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function GameMap(scene) {
    this.scene = game_data["scene"];
    Phaser.GameObjects.Container.call(this, scene, 0, 0);
    this.emitter = new Phaser.Events.EventEmitter();
    this.game_started = 0;
  },

  init(params) {
    game_data["game_map"] = this;
    this.create_assets();

    this.button_play = new CustomButton(
      this.scene,
      loading_vars.W / 2,
      loading_vars["H"] * 0.8,
      () => {
        this.handler_play();
      },
      "common1",
      "btn_play",
      "btn_play",
      "btn_play",
      this,
      null,
      null,
      1
    );
    this.add(this.button_play);

    this.btn_tween = game_data.scene.tweens.add({
      targets: this.button_play,
      repeat: -1,
      yoyo: true,
      scale: { from: 1, to: 1.05 },
      ease: "Sine.easeInOut",
      duration: 1000,
      onUpdate: () => {},
      onComplete: () => {},
    });

    this.create_lang_button();
    this.create_remove_ad_button();
    this.create_sound_buttons();
    this.create_shop_panel();
  },

  create_score_panel() {
    this.score = 0;
    this.score_panel = new Phaser.GameObjects.Container(this.scene, 570, 70);
    game_data.score_panel = this.score_panel;
    this.add(this.score_panel);
    let back = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "common1",
      "panel8"
    );
    back.setScale(0.5);
    this.score_panel.add(back);
    back.setInteractive({ useHandCursor: true });
    back.on(
      "pointerdown",
      () => {
        let pt = game_data["utils"].toGlobal(
          this.score_panel,
          new Phaser.Geom.Point(0, 0)
        );
        game_data["utils"].show_tip({
          pt: pt,
          scene_id: "game_tip",
          item_id: "tip",
          phrase_id: "record",
          values: [],
        });
      },
      this
    );
    this.score_txt = new Phaser.GameObjects.Text(
      this.scene,
      0,
      -10,
      game_data["user_data"]["global_score"],
      {
        fontFamily: "font2",
        fontSize: 35,
        color: "#a86233",
        stroke: "#ffe1a1",
        strokeThickness: 3,
      }
    );
    this.score_txt.setOrigin(0.5, 1);
    this.score_panel.add(this.score_txt);
    this.score_txt.setText(this.score);

    let score_icon = new Phaser.GameObjects.Image(
      this.scene,
      0,
      this.score_txt.y + 30,
      "common1",
      "rating_ico"
    );
    score_icon.setScale(0.9);
    this.score_panel.add(score_icon);
  },

  new_score() {
    let pt = game_data["utils"].toGlobal(
      this.score_panel,
      new Phaser.Geom.Point(0, 0)
    );
    game_data["utils"].show_tip({
      pt: pt,
      scene_id: "game_tip",
      item_id: "tip",
      phrase_id: "new_record",
      values: [],
    });
  },

  create_shop_panel() {
    this.container_shop = new Phaser.GameObjects.Container(this.scene, 280, 50);
    this.add(this.container_shop);

    this.shop_panel = new CustomButton(
      this.scene,
      0,
      0,
      this.handler_shop,
      "common1",
      "btn_skins",
      "btn_skins",
      "btn_skins",
      this
    );
    this.container_shop.add(this.shop_panel);
  },

  handler_shop() {
    this.emitter.emit("EVENT", { event: "show_scene", scene_id: "SHOP" });
  },

  create_lang_button() {
    this.button_lang = new Phaser.GameObjects.Container(this.scene, 0, 0);
    this.add(this.button_lang);

    this.button_lang2 = new CustomButton(
      this.scene,
      580,
      50,
      this.handler_lang,
      "common1",
      "btn_lang",
      "btn_lang",
      "btn_lang",
      this
    );
    this.button_lang.add(this.button_lang2);
  },

  create_remove_ad_button() {
    this.button_ad = new Phaser.GameObjects.Container(this.scene, 0, 0);
    this.add(this.button_ad);

    this.button_ad2 = new CustomButton(
      this.scene,
      180,
      50,
      this.handler_remove_ad,
      "common1",
      "btn_rem_ad",
      "btn_rem_ad",
      "btn_rem_ad",
      this
    );
    this.button_ad.add(this.button_ad2);
    this.update_ad_btn();
  },

  update_ad_btn() {
    this.button_ad.setVisible(
      game_data["user_data"]["payments"]["total"] === 0
    );
  },

  handler_lang() {
    this.emitter.emit("EVENT", {
      event: "show_window",
      window_id: "select_language",
    });
  },

  handler_remove_ad() {
    this.emitter.emit("EVENT", {
      event: "show_window",
      window_id: "remove_ads",
    });
  },

  create_sound_buttons() {
    this.buttonsGroup = this.scene.add.group();

    this.button_music = new Phaser.GameObjects.Container(this.scene, 0, 0);
    this.add(this.button_music);
    this.button_music_on = new CustomButton(
      this.scene,
      380,
      50,
      this.handler_music,
      "common1",
      "btn_music_on",
      "btn_music_on",
      "btn_music_on",
      this
    );
    this.button_music.add(this.button_music_on);
    this.button_music_off = new CustomButton(
      this.scene,
      380,
      50,
      this.handler_music,
      "common1",
      "btn_music_off",
      "btn_music_off",
      "btn_music_off",
      this
    );
    this.button_music.add(this.button_music_off);
    this.buttonsGroup.add(this.button_music);

    this.button_sound = new Phaser.GameObjects.Container(this.scene, 0, 0);
    this.add(this.button_sound);
    this.button_sound_on = new CustomButton(
      this.scene,
      480,
      50,
      this.handler_sound,
      "common1",
      "btn_sound_on",
      "btn_sound_on",
      "btn_sound_on",
      this
    );
    this.button_sound.add(this.button_sound_on);
    this.button_sound_off = new CustomButton(
      this.scene,
      480,
      50,
      this.handler_sound,
      "common1",
      "btn_sound_off",
      "btn_sound_off",
      "btn_sound_off",
      this
    );
    this.button_sound.add(this.button_sound_off);
    this.buttonsGroup.add(this.button_sound);

    this.update_buttons();
  },

  handler_music(params) {
    game_data["user_data"]["music"] = 1 - game_data["user_data"]["music"];
    this.update_buttons();
    game_request.request(
      {
        set_options: true,
        sound: game_data["user_data"]["sound"],
        music: game_data["user_data"]["music"],
      },
      function () {}
    );
    game_data["audio_manager"].update_volume();
  },

  handler_sound(params) {
    game_data["user_data"]["sound"] = 1 - game_data["user_data"]["sound"];
    this.update_buttons();
    game_request.request(
      {
        set_options: true,
        sound: game_data["user_data"]["sound"],
        music: game_data["user_data"]["music"],
      },
      function () {}
    );
    game_data["audio_manager"].update_volume();
  },

  update_buttons() {
    this.button_music_on.visible = game_data["user_data"]["music"] == 1;
    this.button_music_off.visible = game_data["user_data"]["music"] == 0;

    this.button_sound_on.visible = game_data["user_data"]["sound"] == 1;
    this.button_sound_off.visible = game_data["user_data"]["sound"] == 0;
  },

  reset_music() {
    game_data["audio_manager"].sound_event({ stop_all: true });
    game_data["audio_manager"].sound_event({
      play: true,
      loop: true,
      sound_type: "music",
      sound_name: "music_map",
      audio_kind: "music",
      map: true,
    });
  },

  show_map(obj = {}) {
    if (obj["complete"]) {
      if (!game_data["user_data"]["tutorial"]["map_snitch"]) {
        this.snitch_tip(true);
        game_data["user_data"]["tutorial"]["map_snitch"] = true;
        game_request.request(
          { update_tutorial: true, tutorial_id: "map_snitch" },
          () => {}
        );
      }
    }
    this.update_money();
  },

  handler_event(params) {
    switch (params["event"]) {
      case "start_level":
        this.auto_start_obj = null;
        this.start_level(params);
        break;
      default:
        this.emitter.emit("EVENT", params);
        break;
    }
  },

  get_money_pt() {
    return game_data["utils"].toGlobal(
      game_data["game_map"],
      new Phaser.Geom.Point(this.money_icon.x, this.money_icon.y)
    );
  },

  update_language() {},

  create_assets() {
    let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "back");
    bg.setOrigin(0, 0);
    this.add(bg);

    this.money_icon = new Phaser.GameObjects.Image(
      this.scene,
      55,
      55,
      "common1",
      "star"
    );
    game_data["money_holder"].add(this.money_icon);

    this.money_txt = new Phaser.GameObjects.Text(
      this.scene,
      55,
      55,
      game_data["user_data"]["money"],
      {
        fontFamily: "font2",
        fontSize: 35,
        color: "#a86233",
        stroke: "#ffe1a1",
        strokeThickness: 3,
      }
    );
    this.money_txt.setOrigin(0.5);
    game_data["money_holder"].add(this.money_txt);
    this.game_icon_anim();

    this.money_icon.setInteractive({ useHandCursor: true });
    this.money_icon.on(
      "pointerup",
      () => {
        this.snitch_tip();
      },
      this
    );
  },

  snitch_tip(tutorial_tip = false) {
    let panel = this.money_icon;
    if (tutorial_tip) panel = this.shop_panel;
    let pt = game_data["utils"].toGlobal(panel, new Phaser.Geom.Point(0, 0));
    game_data["utils"].show_tip({
      pt: pt,
      scene_id: "game_tip",
      item_id: "tip",
      phrase_id: "snitch",
      values: [],
    });
  },

  game_icon_anim() {
    if (this.scene) {
      if (!game_data["money_holder"].lights) {
        game_data["money_holder"].lights = [];
        while (game_data["money_holder"].lights.length < 5) {
          img = new Phaser.GameObjects.Image(
            this.scene,
            0,
            0,
            "common1",
            "light_star"
          );
          img.scale = 0;
          game_data["money_holder"].add(img);
          game_data["money_holder"].lights.push(img);
        }
      }
      game_data["money_holder"].tween = this.scene.tweens.add({
        targets: game_data["money_holder"],
        repeat: 0,
        yoyo: true,
        scale: { from: 1, to: 1.0 },
        ease: "Sine.easeInOut",
        duration: 3200,
        onUpdate: () => {},
        onComplete: () => {
          this.game_icon_anim();
        },
      });
      for (let i = 0; i < game_data["money_holder"].lights.length; i++) {
        img = game_data["money_holder"].lights[i];
        img.scale = 0;
        img.angle = 0;
        img.x = (5 + Math.random() * 100) * (Math.random() < 0.5 ? 1 : -1);
        img.y = (5 + Math.random() * 100) * (Math.random() < 0.5 ? 1 : -1);
        game_data["scene"].tweens.add({
          targets: img,
          scale: 1.8,
          duration: 500,
          yoyo: true,
          repeat: 0,
          delay: 500 + i * 900,
          ease: "Sine.easeOut",
        });
        game_data["scene"].tweens.add({
          targets: img,
          angle: 360 * (Math.random() < 0.5 ? 1 : -1),
          duration: 800,
          delay: 500 + i * 900,
          ease: "Sine.easeInOut",
        });
      }
    }
  },

  new_score() {
    let pt = game_data["utils"].toGlobal(
      this.score_panel,
      new Phaser.Geom.Point(0, 0)
    );
    game_data["utils"].show_tip({
      pt: pt,
      scene_id: "game_tip",
      item_id: "tip",
      phrase_id: "new_record",
      values: [],
    });
  },

  handler_buy_money() {
    let pt = game_data["utils"].toGlobal(
      this.user_money,
      new Phaser.Geom.Point(0, 0)
    );
    game_data["utils"].show_tip({
      pt: pt,
      scene_id: "game_tip",
      item_id: "tip",
      phrase_id: "money",
      values: [],
    });
  },

  update_money() {
    this.money_txt.setText(game_data["user_data"]["money"]);
  },

  handler_play() {
    this.emitter.emit("EVENT", {
      event: "show_window",
      window_id: "level_start",
    });
  },

  update() {},

  start_level(_obj) {
    this.game_started++;
  },
});
