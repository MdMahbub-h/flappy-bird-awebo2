let LevelFailed = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function LevelFailed()
    {
        this.scene = game_data['scene'];
        Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
        this.emitter = new Phaser.Events.EventEmitter();
    },


init(params) {
	this.paid_replay = false;
	this.money_pt = params['money_pt'];
	this.score = params['score'];
	this.mode = params['mode'];
	this.currentStageAdsWatched = params['currentStageAdsWatched'];
	this.currentStage = params['currentStage'];

	this.btn_cont = new Phaser.GameObjects.Container(this.scene, 0, 0);
	this.add(this.btn_cont);
	let res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_failed', 'phrase_id': '3', 'values': [], 'base_size': 60});
	this.text1 = this.scene.add.bitmapText(0, -300, "font", res['text'], res['size']);
	this.text2 = this.scene.add.bitmapText(0, -210, "font", this.score, 100);
	res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_failed', 'phrase_id': '2', 'values': [], 'base_size': 50});
	this.text3 = this.scene.add.bitmapText(0, 10, "font", res['text'], res['size'], 1);
	res = game_data['utils'].generate_string({
		'scene_id': 'game_windows',
		'item_id': 'level_failed',
		'phrase_id': '1',
		'values': [],
		'base_size': 35
	});
	this.text4 = this.scene.add.bitmapText(23, 5, "font", res['text'], res['size']);
	this.text1.setOrigin(0.5);
	this.text2.setOrigin(0.5);
	this.text3.setOrigin(0.5);
	this.text4.setOrigin(0.5);
	this.add(this.text1);
	this.add(this.text2);
	this.add(this.text3);
	
	this.button_play = new CustomButton(game_data['scene'], 0, 230, this.handler_replay, 'common1'
	, 'btn', 'btn', 'btn', this, null, null, 1);

	this.button_close = new CustomButton(game_data['scene'], 0, 330, this.handler_cancel, 'common1'
	, 'btn_close', 'btn_close', 'btn_close', this, null, null, 1);
	this.button_close.alpha = 0;
	this.button_close.scale = 0.8;
	this.add(this.button_close);
	this.appear_anim = game_data['scene'].tweens.add({
		targets: this.button_close,
		alpha: 1,
		duration: 800,
		delay: 2000
	});

	this.btn_cont.add(this.button_play);
	this.button_play.add(this.text4);
	let ad_ico = new Phaser.GameObjects.Image(this.scene, this.button_play.x - 72, 0, 'common1', 'rewarded_ad');
	this.button_play.add(ad_ico);
	this.ad = ad_ico;

	let circularProgress = this.scene.add.rexCircularProgress({
		x: 0, y: 0,
		radius: 140,
		barColor: 0xdf6352,
		value: 0
	});
	this.add(circularProgress);

	this.countdown_tween = this.scene.tweens.add({
		targets: circularProgress,
		value: 1,
		duration: 10000,
		onComplete: () => {
			this.block_click = true;
			this.handler_cancel();
		},
		onUpdate: () => {

		}
	})

	this.jump_anim = game_data['scene'].tweens.add({
		targets: this.button_play,
		scale: 1.1,
		duration: 150,
		delay: 650,
		repeat: 2,
		yoyo: true
	});
},

pause() {
	if (this.countdown_tween) this.countdown_tween.pause();
},

resume() {
	if (this.countdown_tween) {
		this.countdown_tween.resume();
	}
},

handler_replay() {
	if (this.countdown_tween) this.countdown_tween.pause();
	game_data['utils'].show_rewarded_ad(res => {
		if (res['success']) {
			if (this.countdown_tween) {
				this.countdown_tween.pause();
				this.countdown_tween.remove();
			}
			this.handler_continue();
		}
		else {
			if (this.countdown_tween) {
				this.countdown_tween.resume();
			}
			let pt = game_data['utils'].toGlobal(this.button_play, new Phaser.Geom.Point(0, 0));
			game_data['utils'].show_tip({'pt': pt, 'text': 'Ads are not available now,\ntry again later', 'forced': true, 'values': []});
		}
	})
},

handler_continue() {
	this.emitter.emit('EVENT', {'event': 'rewarded_ad_watched'});
	this.emitter.emit('EVENT', {'event': 'continue_game'});
	this.handler_close();
},

handler_cancel() {
	this.pause();
	game_request.request({'level_failed': true, 'global_score': this.score, 'mode': this.mode }, params => {
		this.emitter.emit('EVENT', {'event': 'level_finished'});
		this.handler_close();
	});
},

handler_close(params) {
	if (!this.closed) {
		this.closed = true;
		this.close_window();
		if (this.countdown_tween) {
			this.countdown_tween.pause();
			this.countdown_tween.remove();
		}
	}
},

close_window(event = {}) {
	game_data['utils'].hide_tip();
	this.emitter.emit('EVENT', {'event': 'window_close'});
},	
});