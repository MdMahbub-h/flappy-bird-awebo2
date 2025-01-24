let Shop = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function Shop(scene) {
    this.scene = game_data["scene"];
    Phaser.GameObjects.Container.call(this, scene, 0, 0);
    this.emitter = new Phaser.Events.EventEmitter();
  },

  init(params) {
    this.ad_items = JSON.parse(JSON.stringify(game_data["shop"]["ad"]));
    this.money_items = JSON.parse(JSON.stringify(game_data["shop"]["money"]));
    this.items_all = [...this.ad_items, ...this.money_items];
    let all_ad_ids = this.items_all.map(({ id }) => id);
    this.ad_pages = Math.ceil(this.ad_items.length / 9);
    this.money_pages = Math.ceil(this.money_items.length / 9);
    this.total_pages = this.ad_pages + this.money_pages;
    this.pages = [];
    this.items = [];
    this.current_id = game_data["user_data"]["current_resourse"];
    this.current_page = all_ad_ids.indexOf(this.current_id);
    if (this.current_page === -1) this.current_page = 0;
    this.btn_allow_click = true;
    this.create_assets();
  },

  create_assets(params) {
    let res;
    let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "back");
    bg.setOrigin(0, 0);
    this.add(bg);

    this.cont_current_knife = new Phaser.GameObjects.Container(
      this.scene,
      loading_vars.W / 2,
      435
    );
    this.add(this.cont_current_knife);

    let luchi = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "common1",
      "luchi"
    );
    luchi.scale = 1.6;
    this.cont_current_knife.add(luchi);
    game_data.scene.tweens.add({
      targets: luchi,
      angle: 360,
      repeat: -1,
      duration: 10000,
      onComplete: () => {},
    });
    this.title = new Phaser.GameObjects.Text(this.scene, 0, -250, "Awebo", {
      ...game_data["styles"]["title"],
      fontFamily: "font2",
      fontSize: 82,
    });
    this.title.setOrigin(0.5);
    this.cont_current_knife.add(this.title);

    this.current_knife = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "common1",
      this.current_id
    );
    this.cont_current_knife.add(this.current_knife);

    this.cont_knives = new Phaser.GameObjects.Container(this.scene, 0, 470);
    this.add(this.cont_knives);

    this.btn_left = new CustomButton(
      this.scene,
      loading_vars.W * 0.1,
      this.cont_current_knife.y,
      this.handler_left,
      "common1",
      "btn_play1",
      "btn_play1",
      "btn_play1",
      this,
      null,
      null,
      1
    );
    this.add(this.btn_left);
    this.btn_left.setScale(-0.7, 0.7);

    this.btn_right = new CustomButton(
      this.scene,
      loading_vars.W * 0.9,
      this.cont_current_knife.y,
      this.handler_right,
      "common1",
      "btn_play1",
      "btn_play1",
      "btn_play1",
      this,
      null,
      null,
      1
    );
    this.add(this.btn_right);
    this.btn_right.setScale(0.7, 0.7);

    this.btn_back = new CustomButton(
      this.scene,
      50,
      loading_vars.H * 0.95,
      this.handler_back,
      "common1",
      "btn_arrow",
      "btn_arrow",
      "btn_arrow",
      this,
      null,
      null,
      1
    );
    this.add(this.btn_back);

    this.btn_ad = new CustomButton(
      this.scene,
      loading_vars.W / 2,
      loading_vars.H * 0.8,
      this.handler_buy_ad_item,
      "common1",
      "btn_purple",
      "btn_purple",
      "btn_purple",
      this,
      null,
      null,
      1
    );
    this.add(this.btn_ad);

    this.btn_money = new CustomButton(
      this.scene,
      loading_vars.W / 2,
      loading_vars.H * 0.8,
      () => {
        this.handler_buy_money_item();
      },
      "common1",
      "btn_green",
      "btn_green",
      "btn_green",
      this,
      null,
      null,
      1
    );
    this.add(this.btn_money);
    let txt = new Phaser.GameObjects.Text(this.scene, 45, -3, "", {
      ...game_data["styles"]["light_text"],
      fontFamily: "font2",
      fontSize: 24,
    });
    this.btn_money.add(txt);
    txt.setOrigin(1, 0.5);
    res = game_data["utils"].generate_string({
      scene_id: "shop",
      item_id: "shop",
      phrase_id: "1",
      values: [],
      base_size: 24,
    });
    txt.setText(res["text"]);
    this.btn_money.txt = txt;
    this.btn_money.ico = new Phaser.GameObjects.Image(
      this.scene,
      0,
      -3,
      "common1",
      "star"
    ).setScale(0.4);
    this.btn_money.add(this.btn_money.ico);
    this.btn_money.ico.x =
      this.btn_money.txt.x + this.btn_money.txt.displayWidth / 2;

    txt = new Phaser.GameObjects.Text(this.scene, 0, -3, "", {
      ...game_data["styles"]["purp_text"],
      fontFamily: "font2",
      fontSize: 24,
    });
    this.btn_ad.add(txt);
    txt.setOrigin(0.5);
    res = game_data["utils"].generate_string({
      scene_id: "shop",
      item_id: "shop",
      phrase_id: "2",
      values: [],
      base_size: 24,
    });
    txt.setText(res["text"]);
    this.btn_ad.txt = txt;
    this.btn_ad.ico = new Phaser.GameObjects.Image(
      this.scene,
      0,
      -2,
      "common1",
      "rewarded_ad"
    );
    this.btn_ad.ico.setOrigin(0, 0.5);
    this.btn_ad.ico.x =
      this.btn_ad.txt.x + this.btn_ad.txt.displayWidth / 2 + 7;
    this.btn_ad.ico.setScale(1);
    this.btn_ad.add(this.btn_ad.ico);
    this.update_btn_text();
    this.update_buttons({});
  },
  // harry = angel
  // hermi = pixel
  //tom = goku
  //draco = macdonal
  handler_buy_ad_item() {
    game_data["utils"].show_rewarded_ad((res) => {
      if (res["success"]) {
        let current_item = this.get_current_item();
        game_request.request(
          { buy_item: true, type: "ad", id: current_item.id },
          (res) => {
            if (res["success"]) {
              this.update_btn_text();
              if (res["ad_resourses"].includes(res["id"])) {
                this.current_id = res["id"];
                this.show_explosion(() => {
                  this.set_active();
                });
                if (this.btn_ad) this.btn_ad.setVisible(false);
              }

              this.emitter.emit("EVENT", { event: "update_money" });
            } else {
              let pt = game_data["utils"].toGlobal(
                this.btn_ad,
                new Phaser.Geom.Point(0, 0)
              );
              game_data["utils"].show_tip({
                pt: pt,
                scene_id: "game_tip",
                item_id: "shop",
                phrase_id: "2",
                values: [],
              });
            }
          }
        );
      } else {
        let pt = game_data["utils"].toGlobal(
          this.btn_ad,
          new Phaser.Geom.Point(0, 0)
        );

        game_data["utils"].show_tip({
          pt: pt,
          scene_id: "game_tip",
          item_id: "shop",
          phrase_id: "2",
          values: [],
        });
      }
    });
  },

  handler_buy_money_item() {
    let current_item = this.get_current_item();
    game_request.request(
      { buy_item: true, type: "money", id: current_item.id },
      (res) => {
        if (res["success"]) {
          let pt_end = game_data["game_map"].get_money_pt();
          let pt_start = game_data["utils"].toGlobal(
            this.btn_money,
            new Phaser.Geom.Point(this.btn_money.ico.x, this.btn_money.ico.y)
          );

          game_data["utils"].fly_items(
            {
              amount: 10,
              holder: game_data["moving_holder"],
              item_atlas: "common1",
              item_name: "star",
              pt_start: pt_end,
              pt_end: pt_start,
            },
            () => {
              if (this.btn_money) this.btn_money.setVisible(false);
              this.current_id = res["id"];
              this.show_explosion(() => {
                this.set_active();
              });
              this.emitter.emit("EVENT", { event: "update_money" });
            }
          );
        } else {
          // transferring a point from a local coordinate system to a global one
          let pt = game_data["utils"].toGlobal(
            game_data["money_holder"],
            new Phaser.Geom.Point(40, 65)
          );
          game_data["utils"].show_tip({
            pt: pt,
            scene_id: "game_tip",
            item_id: "shop",
            phrase_id: "1",
            values: [],
          });
        }
      }
    );
  },

  show_explosion(on_complete = null) {
    let frames;
    frames = ["btn_arrow"];
    let config = {
      frame: frames,
      x: 0,
      y: 0,
      lifespan: 1300,
      blendMode: "ADD",
      alpha: { start: 0.4, end: 1 },
      scale: { start: 0.7, end: 0 },
      speed: { min: -300, max: 300 },
      quantity: 30,
    };
    let emitter = game_data["scene"].add.particles(0, 0, "common1", config);
    this.cont_current_knife.add(emitter);

    let emitZone0 = {
      source: new Phaser.Geom.Rectangle(-20, -20, 300, 300),
      type: "random",
      quantity: 2,
    };
    emitter.setEmitZone(emitZone0);
    emitter.explode();

    let count = 0;
    let timer = this.scene.time.addEvent({
      delay: 40,
      repeat: 8,
      callbackScope: this,
      callback: () => {
        count++;
        let size = 50 + 35 * count;
        let emitZone = {
          source: new Phaser.Geom.Rectangle(-size / 2, -size / 2, size, size),
          type: "random",
          quantity: 10 + count * 4,
        };
        emitter.setEmitZone(emitZone);
        emitter.explode();
      },
    });
    timer.paused = false;
    game_data["audio_manager"].sound_event({
      play: true,
      sound_name: "collect_pers",
    });
    setTimeout(() => {
      emitter.stop();
      emitter.destroy();
      if (on_complete) on_complete();
    }, 1500);
  },

  create_pages() {
    let money_iter = 0;
    let ad_iter = 0;
    for (let i = 0; i < this.money_pages; i++) {
      let page = this.create_page({ type: "money" });
      page.setVisible(false);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (money_iter < this.money_items.length) {
            this.create_item({
              i,
              j,
              page,
              info: this.money_items[money_iter],
            });
            money_iter++;
          }
        }
      }
    }

    for (let i = 0; i < this.ad_pages; i++) {
      let page = this.create_page({ type: "ad" });
      page.setVisible(false);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (ad_iter < this.ad_items.length) {
            this.create_item({ i, j, page, info: this.ad_items[ad_iter] });
            ad_iter++;
          }
        }
      }
    }
  },

  create_page({ type }) {
    let cont = new Phaser.GameObjects.Container(this.scene, 0, 0);
    cont.type = type;

    this.cont_knives.add(cont);
    this.pages.push(cont);

    return cont;
  },

  create_item(params) {
    let temp;
    let { i, j, page, info } = params;
    let { id, price } = info;
    let item = new Phaser.GameObjects.Container(this.scene, j * 176, i * 176);
    item.x += loading_vars.W / 4;
    item.x += 12;
    page.add(item);
    item.id = id;
    item.price = price;

    item.active_panel = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "common1",
      "round2"
    );
    item.add(item.active_panel);
    item.active_panel.alpha = 0;

    let back = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "common1",
      "back2"
    );
    item.add(back);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerup", () => {
      if (this.current_id !== id) {
        this.current_id = id;
        this.update_current_knife();
        this.set_active(item);
        if (
          game_data["user_data"]["money_resourses"].includes(item.id) ||
          game_data["user_data"]["ad_resourses"].includes(item.id)
        ) {
          game_request.request(
            {
              update_current_resourse: true,
              current_resourse: this.current_id,
            },
            (res) => {
              if (res["success"]) {
              }
            }
          );
        }
        game_data["audio_manager"].sound_event({
          play: true,
          sound_name: "select_option",
        });
      }
    });
    item.back = back;

    if (
      game_data["user_data"]["money_resourses"].includes(id) ||
      game_data["user_data"]["ad_resourses"].includes(id)
    ) {
      back.setFrame("back1");
      item.active_panel.setFrame("round1");
    }

    let icon = new Phaser.GameObjects.Image(this.scene, 0, 0, "common1", id);
    icon.setScale(195 / icon.height);
    item.add(icon);

    if (game_data["user_data"]["current_resourse"] === id) {
      let page_ind = this.pages.indexOf(page);
      page_ind = page_ind !== -1 ? page_ind : 0;
      this.current_page = page_ind;
      this.set_active(item);
    }
    item.bringToTop(item.active_panel);
    item.page = page;
    this.items.push(item);
    return item;
  },

  set_active() {
    let item = this.get_current_item();
    if (this.btn_money && this.btn_money.txt) {
      let res = game_data["utils"].generate_string({
        scene_id: "shop",
        item_id: "shop",
        phrase_id: "1",
        values: [item.price],
        base_size: 24,
      });
      this.btn_money.txt.setText(res["text"]);
      this.btn_money.txt.setFontSize(res["size"]);
      if (this.btn_money.ico) {
        this.btn_money.ico.x =
          this.btn_money.txt.x + this.btn_money.txt.displayWidth / 2;
      }
    }

    this.update_btn_text(item);
    this.update_buttons({});
  },

  update_btn_text() {
    if (this.btn_ad && this.btn_ad.txt) {
      let item = this.get_current_item();

      let remaider =
        item.id in game_data["user_data"]["ad_watched"]
          ? game_data["user_data"]["ad_watched"][item.id]
          : 0;
      let price_remained = item.price - remaider;
      let res = game_data["utils"].generate_string({
        scene_id: "shop",
        item_id: "shop",
        phrase_id: "2",
        values: [price_remained],
        base_size: 24,
      });
      this.btn_ad.txt.setText(res["text"]);
      this.btn_ad.txt.setFontSize(res["size"]);
      if (this.btn_ad.ico) {
        this.btn_ad.ico.x =
          this.btn_ad.txt.x + this.btn_ad.txt.displayWidth / 2 + 7;
      }
    }
    if (this.btn_money && this.btn_money.txt) {
      let item = this.get_current_item();
      let price = item.price;
      let res = game_data["utils"].generate_string({
        scene_id: "shop",
        item_id: "shop",
        phrase_id: "1",
        values: [price],
        base_size: 24,
      });
      this.btn_money.txt.setText(res["text"]);
      this.btn_money.txt.setFontSize(res["size"]);
      if (this.btn_money.ico) {
        this.btn_money.ico.x =
          this.btn_money.txt.x + this.btn_money.txt.displayWidth / 2 - 40;
      }
    }
  },

  update_current_knife() {
    this.current_knife.setFrame(this.current_id);
    this.current_knife.scale = 0;

    game_data["scene"].tweens.add({
      targets: [this.current_knife],
      scale: 250 / this.current_knife.height,
      duration: 200,
      ease: "Sine.easeInOut",
      onComplete: () => {},
    });
  },

  show_page(page) {
    this.btn_allow_click = false;
    page.alpha = 0;
    game_data["scene"].tweens.add({
      targets: [page],
      alpha: 1,
      duration: 500,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.btn_allow_click = true;
      },
    });
  },

  handler_left() {
    if (this.btn_allow_click) {
      this.current_page--;
      if (!(this.current_page in this.items_all))
        this.current_page = this.items_all.length - 1;
      let item = this.get_current_item();
      this.current_knife.setFrame(item["id"]);

      if (
        game_data["user_data"]["money_resourses"].includes(item["id"]) ||
        game_data["user_data"]["ad_resourses"].includes(item["id"])
      ) {
        this.current_id = item["id"];
        game_request.request(
          { update_current_resourse: true, current_resourse: this.current_id },
          (res) => {
            if (res["success"]) {
            }
          }
        );
      }
      this.update_buttons({ only_switch: true });
    }
  },

  handler_right() {
    if (this.btn_allow_click) {
      this.current_page++;
      if (!(this.current_page in this.items_all)) this.current_page = 0;
      let item = this.get_current_item();
      this.current_knife.setFrame(item["id"]);

      if (
        game_data["user_data"]["money_resourses"].includes(item["id"]) ||
        game_data["user_data"]["ad_resourses"].includes(item["id"])
      ) {
        this.current_id = item["id"];
        game_request.request(
          { update_current_resourse: true, current_resourse: this.current_id },
          (res) => {
            if (res["success"]) {
            }
          }
        );
      }
      this.update_buttons({ only_switch: true });
    }
  },

  update_buttons({ only_switch = false }) {
    let current_item = this.get_current_item();
    let id = current_item["id"];
    let ad_ids = this.ad_items.map(({ id }) => id);
    let money_ids = this.money_items.map(({ id }) => id);
    if (
      game_data["user_data"]["money_resourses"].includes(id) ||
      game_data["user_data"]["ad_resourses"].includes(id)
    ) {
      if (this.btn_money) this.btn_money.setVisible(false);
      if (this.btn_ad) this.btn_ad.setVisible(false);
    } else {
      if (money_ids.includes(id)) {
        if (this.btn_money) {
          this.btn_money.setVisible(true);
        }
        if (this.btn_ad) this.btn_ad.setVisible(false);
      } else if (ad_ids.includes(id)) {
        if (this.btn_money) this.btn_money.setVisible(false);
        if (this.btn_ad) this.btn_ad.setVisible(true);
      }
    }

    let res = game_data["utils"].generate_string({
      scene_id: "shop",
      item_id: "shop",
      phrase_id: id,
      values: [],
      base_size: 50,
    });
    this.title.setText(res["text"]);
    this.update_btn_text();
  },

  get_current_item() {
    return this.items_all[this.current_page];
  },

  handler_back() {
    game_data["utils"].check_ads("change_scene");
    this.emitter.emit("EVENT", { event: "show_scene", scene_id: "MAP" });
  },

  show_shop(params) {
    this.items.forEach((item) => {
      if (item.id === game_data["user_data"]["current_resourse"]) {
        let page_ind = this.pages.indexOf(item.page);
        page_ind = page_ind !== -1 ? page_ind : 0;
        this.current_page = page_ind;
        this.set_active(item);
      }
    });
    this.update_buttons({});
  },

  update_language() {
    let current_item = this.get_current_item();
    let res;

    let remaider =
      current_item.id in game_data["user_data"]["ad_watched"]
        ? game_data["user_data"]["ad_watched"][current_item.id]
        : 0;
    let price_remained = current_item.price - remaider;
    res = game_data["utils"].generate_string({
      scene_id: "shop",
      item_id: "shop",
      phrase_id: "2",
      values: [price_remained],
      base_size: 24,
    });
    this.btn_ad.txt.setText(res["text"]);
    this.btn_ad.txt.setFontSize(res["size"]);
    this.btn_ad.ico.x =
      this.btn_ad.txt.x + this.btn_ad.txt.displayWidth / 2 + 7;

    let item = this.get_current_item();
    res = game_data["utils"].generate_string({
      scene_id: "shop",
      item_id: "shop",
      phrase_id: "1",
      values: [item.price],
      base_size: 24,
    });
    this.btn_money.txt.setText(res["text"]);
    this.btn_money.txt.setFontSize(res["size"]);
    this.btn_money.ico.x =
      this.btn_money.txt.x + this.btn_money.txt.displayWidth / 2 - 40;
  },
});
