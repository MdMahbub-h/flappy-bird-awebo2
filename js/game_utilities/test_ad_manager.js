// window.admob = window.admob || {};
let TestAdManager = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function TestAdManager(scene) {
    this.scene = game_data["scene"];
    Phaser.GameObjects.Container.call(this, scene, 0, 0);
    this.emitter = new Phaser.Events.EventEmitter();
    this.create_assets();

    // Initialize AdMob
    this.initAdMob();
  },

  create_assets() {
    this.default_overlay = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "dark_overlay"
    );
    this.default_overlay.setOrigin(0, 0);
    this.default_overlay.alpha = 1;
    this.add(this.default_overlay);
    this.default_overlay.setInteractive();

    this.value_txt = new Phaser.GameObjects.Text(
      this.scene,
      loading_vars["W"] / 2,
      loading_vars["H"] / 2,
      "5",
      { fontFamily: "font2", fontSize: 90, color: "#fff" }
    );
    this.value_txt.setOrigin(0.5);
    this.add(this.value_txt);

    this.desc_txt = new Phaser.GameObjects.Text(
      this.scene,
      loading_vars["W"] / 2,
      this.value_txt.y + 70,
      "Test desc",
      { fontFamily: "font2", fontSize: 45, color: "#fff" }
    );
    this.desc_txt.setOrigin(0.5);
    this.add(this.desc_txt);
    this.setVisible(false);
  },

  initAdMob() {
    // Initialize AdSense-based ads for the web
    if (!window.adsbygoogle) {
      console.warn(
        "AdMob/AdSense SDK not available. Ensure it's included in your HTML."
      );
      return;
    }

    // Dynamically create an ad container for interstitial-style ads
    this.adContainer = document.createElement("div");
    this.adContainer.id = "ad-container";
    this.adContainer.style.position = "absolute";
    this.adContainer.style.top = "0";
    this.adContainer.style.left = "0";
    this.adContainer.style.width = "100%";
    this.adContainer.style.height = "100%";
    this.adContainer.style.backgroundColor = "rgba(0,0,0,0.8)";
    this.adContainer.style.zIndex = "1000";
    this.adContainer.style.display = "none";

    const adElement = document.createElement("ins");
    adElement.className = "adsbygoogle";
    adElement.style.display = "block";
    adElement.style.margin = "auto";
    adElement.setAttribute("data-ad-client", "ca-pub-3940256099942544"); // Replace with your publisher ID
    adElement.setAttribute("data-ad-slot", "6300978111"); // Replace with your ad slot ID
    adElement.setAttribute("data-ad-format", "auto");

    this.adContainer.appendChild(adElement);
    document.body.appendChild(this.adContainer);

    (adsbygoogle = window.adsbygoogle || []).push({});
  },

  call_ad(params, on_complete = () => {}) {
    this.setVisible(true);

    let { type } = params;
    let res = game_data["utils"].generate_string({
      scene_id: "test_ad",
      item_id: type,
      phrase_id: "1",
      values: [],
      base_size: 45,
    });
    this.desc_txt.setText(res["text"]);
    this.desc_txt.setFontSize(res["size"]);

    // Show the ad
    this.showAdMobAd(() => {
      this.setVisible(false);
      on_complete();
    });
  },

  showAdMobAd(onAdComplete) {
    if (!this.adContainer) {
      console.warn("Ad container not initialized.");
      onAdComplete();
      return;
    }

    // Show the ad and wait for a duration
    this.adContainer.style.display = "block";

    setTimeout(() => {
      this.adContainer.style.display = "none";
      onAdComplete(); // Notify that ad is complete
    }, 5000); // Example duration: 5 seconds
  },
});
