class GraphicsManager{
	constructor(){

	}
	
	init() {
		this.scene = game_data['scene'];
		this.emitter = new Phaser.Events.EventEmitter();
		this.create_window_data();
	}

	create_window_data() {
		this.close_pos = {
			'info': {x: 145, y: -190}
		}

		this.btn_pos = {
			'info': {x: 0, y: 150}
		}

		this.title_pos = {
			'info': {x: 0, y: -170}
		}
		game_data['close_pos'] = this.close_pos
		game_data['title_pos'] = this.title_pos
		game_data['btn_pos'] = this.btn_pos

		this.title_style = { fontFamily: 'font2', ...game_data['styles']['title']};
	}

	get_window(type, close_handler, btn_info, context, title_obj = null, bottom_panel = false, extra_type = '') {
		let i;
		let temp;
		let res;
		let close_pos = this.close_pos[type];
		let title_pos = this.title_pos[type];
		let btn_pos = this.btn_pos[type];
		let title_style = this.title_style;

		if (type) {
			temp = new Phaser.GameObjects.Image(game_data['scene'], 0, 0, 'common1', 'panel14');
			temp.setInteractive();
			context.add(temp);
			context.back = temp;
			game_data['utils'].assign_to_global_missclick(temp, context);
		}

		if (close_handler) {
			let button_close = new CustomButton(game_data['scene'], close_pos.x, close_pos.y, close_handler, 'common1', 'icon_close', 'icon_close', 'icon_close', context);
			context.button_close = button_close;
			context.add(button_close);
		}

		if (title_obj) {
			title_obj['base_size'] = parseInt(this.title_style['fontSize']);
			context.title = new Phaser.GameObjects.Text(this.scene, title_pos.x, title_pos.y, '', title_style);		
			res = game_data['utils'].generate_string(title_obj);
			context.title.text = res['text'].toUpperCase();
			context.title.setFontSize(res['size']);
			context.title.setOrigin(0.5);
			context.add(context.title);
		}

		let buttons = [];
		for (i = 0; i < btn_info.length; i++) {
			let handler = btn_info[i]['handler'];
			let btn_type = btn_info[i]['type'];
			let btn_scale = 'scale' in btn_info[i] ? btn_info[i]['scale'] : 1;

			let button = new CustomButton(game_data['scene'], btn_pos.x, btn_pos.y, handler, 'common1'
				, 'btn_green', 'btn_green', 'btn_green', context, null, null, btn_scale);
			buttons.push(button);
			context.add(button);
		}
		context.buttons = buttons;

	}
	
}


