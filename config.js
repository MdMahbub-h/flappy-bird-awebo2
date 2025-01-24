const gameOptions = {
  birdGravity: 800, // bird gravity, will make bird fall if you dont flap
  birdSpeed: 250, // horizontal bird speed
  birdSpeedCoef: {
    // horizontal bird speed coefficient depends on mode
    easy: 1.0,
    normal: 1.25,
    hard: 1.5,
    crazy: 1.7,
  },
  moneyProb: {
    // probability of a coin appearing (0, 100) depends on mode
    easy: 20,
    normal: 30,
    hard: 40,
    crazy: 50,
  },
  birdFlapPower: 300, // flap thrust
  minPipeHeight: 50, // minimum pipe height, in pixels. Affects hole position
  pipeDistance: [440, 560], // distance range from next pipe, in pixels
  pipeHole: [1260, 1340], // hole range between pipes, in pixels
};

const game_data = {
  clear_storage: false, // if set true the progress resets
  test_ad: true, // if set false test ad overlay will no appear
  allowed_trials: 1, // how many attempts are there to continue the game by watching ads

  styles: {
    // different styles used for the text
    dark_text: { fontSize: 30, color: "#40190e", strokeThickness: 0 },
    light_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#356e1e",
      strokeThickness: 5,
    },
    easy_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#356e1e",
      strokeThickness: 5,
    },
    normal_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#6d6e1e",
      strokeThickness: 5,
    },
    hard_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#6e491e",
      strokeThickness: 5,
    },
    crazy_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#6e1e2f",
      strokeThickness: 5,
    },
    purp_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#561e6e",
      strokeThickness: 5,
    },
    red_text: {
      fontSize: 30,
      color: "#fff",
      stroke: "#e4114d",
      strokeThickness: 5,
    },
    light_text2: {
      fontSize: 30,
      color: "#fff",
      stroke: "#441b0e",
      strokeThickness: 5,
    },
    title: {
      fontSize: 30,
      color: "#fff5de",
      stroke: "#40190e",
      strokeThickness: 5,
    },
  },
  urls: {
    // path urls object
    audio: "assets/audio/",
  },
  ads: {
    // configuration of ads
    interstitial: {
      event_mult: {
        level_lost: 1,
        level_start: 0.3,
        game_start: 0,
        change_scene: 0,
      },
    },
    rewarded: {},
  },
  langs: ["en", "fr", "de", "es", "it"], // languages presented in the game
  shop: {
    // shop config
    ad: [
      // rewarded ad positions
      { id: "goku", price: 5 },
    ],
    money: [
      // money positions
      { id: "angel", price: 100 },
      { id: "awebo", price: 100 },
      { id: "pixel", price: 200 },
      { id: "MacDonald", price: 300 },
    ],
    purchase: [
      // purchase positions
      { id: "remove_ad", price: 3.99 },
    ],
  },
  // user data object. If saved data exists then here it will be stored.
  // Otherwise, local_user_data will be stored here
  user_data: {},
};

const local_user_data = {
  sound: 1, // if 0 sound will be disabled
  music: 1, // if 0 music will be disabled
  money: 0, // user money
  ad_watched: {
    // object to remember how many times rewarded ads were watched for proper skin
    // 'harry': 2,
    // 'ron': 2,
    // 'hermi': 2
  },
  tutorial: {}, // object to remember wether tutorial or tip was shown
  global_score_mode: {
    // best score for every mode
    easy: 0,
    normal: 0,
    hard: 0,
    crazy: 0,
  },
  old_global_score_mode: {
    // previous best score for every mode
    easy: 0,
    normal: 0,
    hard: 0,
    crazy: 0,
  },
  payments: { total: 0 }, // payments info
  lang: "en", // select language
  money_resourses: ["angel"], // skins got due to paying money
  // 'ad_resourses': ['harry', 'ron', 'hermi'],
  ad_resourses: [], // skins got due to watching rewarded ad
  current_resourse: "angel", // current skin
};

if (loading_vars["codecanyon_live"])
  game_data["urls"] = {
    audio: "../assets/audio/",
  };
