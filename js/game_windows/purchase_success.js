let PurchaseSuccess = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function PurchaseSuccess()
    {
        this.scene = game_data['scene'];
        Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
        this.emitter = new Phaser.Events.EventEmitter();
    },

    init(params) {
        let temp = {'scene_id': 'game_windows', 'item_id': 'purchase_complete', 'phrase_id': '1', 'values': [], 'base_size': 42};
        game_data['graphics_manager'].get_window('info', this.handler_close, [{ handler: this.handler_close, type: 'big', scale: 0.7 }], this, temp, true);
        this.button_play = this.buttons[0];
        // // this.button_close.setVisible(false);
        // this.back.setTexture('common1', 'panel14');

        res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'purchase_complete', 'phrase_id': '3', 'values': [], 'base_size': 35});
        let button_txt = new Phaser.GameObjects.Text(this.scene, 0, -3, res['text'], {...game_data['styles']['easy_text'], fontFamily:"font1", fontSize: res['size']});
        button_txt.setOrigin(0.5);
        this.button_play.add(button_txt);


        let icon = new Phaser.GameObjects.Image(this.scene, 0, -120, 'common1', 'icon_success');
        icon.setOrigin(0.5);
        this.add(icon);
        this.title.setWordWrapWidth(250);
        this.title.setAlign('center');
        this.title.y = 15;

    },

    handler_close(params) {
        this.close_window();
    },
    
    close_window(event = {}) {
        this.emitter.emit('EVENT', {'event': 'window_close'});
    },	
});