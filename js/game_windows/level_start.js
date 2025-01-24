let LevelStart = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function LevelStart()
    {
        this.scene = game_data['scene'];
        Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
        this.emitter = new Phaser.Events.EventEmitter();
    },


init(params) {
	game_data['graphics_manager'].get_window('info', this.handler_close, [{ handler: this.handler_replay, type: 'big' }], this, null, true);
	this.button_play = this.buttons[0];
	this.button_close.setVisible(false);
	this.button_play.setVisible(false);
	this.back.setTexture('common1', 'panel14');
    this.create_assets();
},	

create_assets() {
    let add_y = 0;
	this.btn_easy = new CustomButton(this.scene, 0, -140 + add_y, () => {
		this.handler_level_start({ mode: 'easy'});
		
	}, 'common1', 'btn_green', 'btn_green', 'btn_green', this, null, null, 1);
    this.add(this.btn_easy);
    let res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_start', 'phrase_id': 'easy', 'values': [], 'base_size': 35});
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, res['text'], { ...game_data['styles']['easy_text'], fontFamily:"font1", fontSize: res['size'], align: 'center' });
	temp.setOrigin(0.5);
    this.btn_easy.add(temp);

    this.btn_normal = new CustomButton(this.scene, 0, -50 + add_y, () => {
		this.handler_level_start({ mode: 'normal'});
		
	}, 'common1', 'btn_yellow', 'btn_yellow', 'btn_yellow', this, null, null, 1);
    this.add(this.btn_normal);
    res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_start', 'phrase_id': 'normal', 'values': [], 'base_size': 35});
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, res['text'], { ...game_data['styles']['normal_text'], fontFamily:"font1", fontSize: res['size'], align: 'center' });
	temp.setOrigin(0.5);
    this.btn_normal.add(temp);

    this.btn_hard = new CustomButton(this.scene, 0, 40 + add_y, () => {
		this.handler_level_start({ mode: 'hard'});
		
	}, 'common1', 'btn_orange', 'btn_orange', 'btn_orange', this, null, null, 1);
    this.add(this.btn_hard);
    res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_start', 'phrase_id': 'hard', 'values': [], 'base_size': 35});
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, res['text'], { ...game_data['styles']['hard_text'], fontFamily:"font1", fontSize: res['size'], align: 'center' });
	temp.setOrigin(0.5);
    this.btn_hard.add(temp);

    this.btn_crazy = new CustomButton(this.scene, 0, 130 + add_y, () => {
		this.handler_level_start({ mode: 'crazy'});
		
	}, 'common1', 'btn_red', 'btn_red', 'btn_red', this, null, null, 1);
    this.add(this.btn_crazy);
    res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_start', 'phrase_id': 'crazy', 'values': [], 'base_size': 35});
	temp = new Phaser.GameObjects.Text(this.scene, 0, -3, res['text'], { ...game_data['styles']['crazy_text'], fontFamily:"font1", fontSize: res['size'], align: 'center' });
	temp.setOrigin(0.5);
    this.btn_crazy.add(temp);


},

handler_level_start({ mode }) {
	// call of interstitial ad when level start
	game_data['utils'].check_ads('level_start');
    this.emitter.emit('EVENT', {'event': 'start_level', 'mode': mode});
    this.handler_close();
},

handler_close(params) {  
	this.close_window();
},

close_window(params) {
	this.emitter.emit("EVENT", {'event': 'window_close'});
},

});