let RemoveAds = new Phaser.Class({
 
	Extends: Phaser.GameObjects.Container,   

	initialize:

	function RemoveAds()
    {
        this.scene = game_data['scene'];
        Phaser.GameObjects.Container.call(this, this.scene, 0, 0);        
        this.emitter = new Phaser.Events.EventEmitter();
    },

    init(params) {
        this.shop_item = {};
        for (i = 0; i < game_data['shop']['purchase'].length; i++) {
            if (game_data['shop']['purchase'][i]['id'] == 'remove_ad') {
                this.shop_item = game_data['shop']['purchase'][i];
                break;
            }
        }

        let temp = {'scene_id': 'game_windows', 'item_id': 'remove_ads', 'phrase_id': '1', 'values': [], 'base_size': 42};
        game_data['graphics_manager'].get_window('info', this.handler_close, [{ handler: this.handler_buy, type: 'big', scale: 0.7 }], this, temp, true);
        this.button_play = this.buttons[0];
        // this.button_close.setVisible(false);
        this.back.setTexture('common1', 'panel14');

        res = game_data['utils'].generate_string({'scene_id': 'game_windows', 'item_id': 'level_finished', 'phrase_id': '4', 'values': [], 'base_size': 35});
        let button_txt = new Phaser.GameObjects.Text(this.scene, 0, -3, this.shop_item['price'] + '$', {...game_data['styles']['easy_text'], fontFamily:"font1", fontSize: res['size']});
        button_txt.setOrigin(0.5);
        this.button_play.add(button_txt);

        let icon = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'no_ads');
        icon.setScale(1.2);
        icon.setOrigin(0.5);
        this.add(icon);
        window.icon = icon;

    },

    handler_buy() {
        game_data['utils'].purchase({'item_info': this.shop_item}, result => {
			if ('success' in result && result['success']) {
				game_request.request({'update_purchase': true, 'item_info': this.shop_item}, res => {
                    game_data['game_map'].update_ad_btn();
                    this.emitter.emit('EVENT', {'events': [{'event': 'window_close', 'immediate': true},
                        {'event': 'show_window', 'window_id': 'purchase_success'}
                    ]});
				});
			}
			else {
				this.emitter.emit('EVENT', {'events': [{'event': 'window_close', 'immediate': true},
														{'event': 'show_window', 'window_id': 'purchase_failed'}
				]});
			}
		});
    },

    handler_close(params) {
        this.close_window();
    },
    
    close_window(event = {}) {
        this.emitter.emit('EVENT', {'event': 'window_close'});
    },	
});