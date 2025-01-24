class GameUtils {
	constructor() {		        
	}
	
	init(scene) {
		this.Timelines = {};
		this.scene = game_data['scene'];
		this.emitter = new Phaser.Events.EventEmitter();
		this.create_overlay();
		this.more_games_allow_popup = true;
	}
	
	create_overlay() {
		let rect = new Phaser.Geom.Rectangle(0, 0, loading_vars['W'], loading_vars['H']);
		let graphics = this.scene.add.graphics({ fillStyle: { color: 0x000000, alpha: 1 } })
		graphics.fillRectShape(rect);
		graphics.generateTexture('dark_overlay', loading_vars['W'], loading_vars['H']);
		graphics.destroy();
	}
	
	init_loading() {
		this.loading_overlay = new LoadingOverlay(this.scene);
		this.scene.add.existing(this.loading_overlay);
		this.loading_overlay.visible = false;
		this.loading_overlay.alpha = 0;
		this.create_missclick();
	}
	
	create_missclick() {
		let config = {
			key: 'mistake_anim',
			frames: this.scene.anims.generateFrameNames('common1', { prefix: 'mistake_anim', end: 28, zeroPad: 4 }),
			repeat: 0,   
			showOnStart: true,
			hideOnComplete: true
		};
		this.scene.anims.create(config);
		this.mistake_anim = this.scene.add.sprite(-20,-20, 'mistake_anim');
		this.mistake_anim.setOrigin(0.5, 0.8);
		this.global_missclick_down = null
		this.global_missclick_up = null;
		this.global_missclick_holder = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.scene.add.existing(this.global_missclick_holder);
	}
	
	add_loading(on_complete = null, alpha = 1) {
		this.loading_overlay.visible = true;
		this.loading_overlay.start(alpha);
		game_data['loading_last_time'] = this.get_time();
		game_data['scene'].tweens.add({targets: this.loading_overlay, alpha: 1, duration: 100, onComplete: function(){
			if (on_complete) on_complete();
		}});
	}
	remove_loading(on_complete = null, quick = false) {
		let def_time = 1000;
		let timeout = this.get_time() - game_data['loading_last_time'];
		if (timeout < def_time) timeout = def_time - timeout;
		else if (timeout > def_time) timeout = 10;
		if (quick) timeout = 10;
		setTimeout(() => {
			game_data['scene'].tweens.add({targets: this.loading_overlay, alpha: 0, duration: 100, onComplete: () => {
				this.loading_overlay.visible = false;
				this.loading_overlay.stop();
			}});
			if (on_complete) on_complete();
		}, timeout);
	}

	assign_to_global_missclick(obj) {
		obj.on('pointerdown', pointer => {  
			let _id = parseInt(Math.random() * 1000000);
			this.global_missclick_down = _id;
			if (this.global_missclick_up == null) this.global_missclick_up = _id;
		});
		obj.on('pointerup', _pointer => { 
			if (_pointer && this.mistake_anim && this.global_missclick_up == this.global_missclick_down) {
				this.make_global_missclick(_pointer);
			}
			this.global_missclick_up = null;
		});
	}
	make_global_missclick(pointer = null) {
		if (pointer == null) pointer = this.scene.input.activePointer;
		let pt = new Phaser.Geom.Point(pointer['worldX'], pointer['worldY']);
		this.mistake_anim.x = pt.x;
		this.mistake_anim.y = pt.y;
		this.global_missclick_holder.add(this.mistake_anim);
		this.mistake_anim.play('mistake_anim');
		game_data['audio_manager'].sound_event({'event': 'sound_event', 'play': true, 'sound_name': 'wrong_click'});
	}


	load_xmls_preloaded(on_complete) {
		setTimeout(() => {
			this.read_language();
			on_complete();	
		}, 20);
	}
	
	is_map() {
		return game_data['current_scene'] === 'MAP'
	}

	is_gameplay() {
		return game_data['current_scene'] === 'GAMEPLAY'
	}
	
	
  	read_language() {
		let i;
		let j;
		let game_text = {};
		let langs = game_data['langs'];
		let scene_id;
		let phrase_id;
		let item_id;	
		let lang_id;
		let _lang;
		let language_xml = phaser_game.cache.xml.get('language_xml'); 

		let phrases = language_xml.getElementsByTagName("DYNAMIC_PHRASE");
		for(i = 0; i < phrases.length; i++){			
			scene_id = phrases[i].getAttributeNode("scene_id").textContent;
			item_id = phrases[i].getAttributeNode("item_id").textContent;
			phrase_id = phrases[i].getAttributeNode("phrase_id").textContent;	

			if (!(scene_id in game_text))
				game_text[scene_id] = {};
			if (!(item_id in game_text[scene_id]))
				game_text[scene_id][item_id] = {};
			if (!(phrase_id in game_text[scene_id][item_id]))
				game_text[scene_id][item_id][phrase_id] = {};
			
			
			for (j = 0; j < langs.length; j++) {
				lang_id = langs[j].toUpperCase();		
				if (phrases[i].getElementsByTagName(lang_id)[0]) _lang = lang_id;
				else _lang = 'EN';
				game_text[scene_id][item_id][phrase_id][lang_id] = {
					'text':  phrases[i].getElementsByTagName(_lang)[0].getElementsByTagName("TEXT")[0].textContent,
					'size':  parseInt(phrases[i].getElementsByTagName(_lang)[0].getElementsByTagName("SIZE")[0].textContent)
				};				
			}																
		}	
	 
		game_data['language'] = game_text;							
}

	zeros(num) {
		let arr = [];
		for (let i = 0; i < num; i++) arr.push(0);
		return arr;
	}
	
	int_array(arr) {
		let res = [];
		for (let i = 0; i < arr.length; i++)
			if (arr[i] == '-')
				res.push(-1);
			else	
				res.push(parseInt(arr[i]));
		return res;
	}    

	empty_line(len) {
		let res = []
		for (let i = 0; i < len; i++)
			res.push('-');
		return res;
	} 
	
	fill_line(arr,val) {
		let res = []
		for (let i = 0; i < arr.length; i++)
			res.push(arr[i] == '-' ? '-' : val);
		return res;
	} 


	toLocal(container, pt) {
		let containers = [];
		let parent_contaiter = container;
		let holder;
		let new_pt;
		if (pt) new_pt = new Phaser.Geom.Point(pt.x, pt.y);
		else new_pt = new Phaser.Geom.Point(0,0);
		
		
		while (parent_contaiter && parent_contaiter != this.scene) {
			containers.push(parent_contaiter);
			parent_contaiter = parent_contaiter.parentContainer;
		}
		
		while(containers.length > 0) {
			holder = containers.pop();
			new_pt.x = (new_pt.x - holder.x) / holder.scaleX;
			new_pt.y = (new_pt.y - holder.y) / holder.scaleY;			
		}
		
		 return new_pt;
	}
		
	toGlobal(container, pt) {
		let new_pt;
		if (pt) new_pt = new Phaser.Geom.Point(pt.x, pt.y);
		else new_pt = new Phaser.Geom.Point(0,0);

		let parent_contaiter = container;
		while (parent_contaiter && parent_contaiter != this.scene) {
				new_pt.x = new_pt.x * parent_contaiter.scaleX + parent_contaiter.x;
				new_pt.y = new_pt.y * parent_contaiter.scaleY + parent_contaiter.y;
				parent_contaiter = parent_contaiter.parentContainer;
		}
		return new_pt;		
	}

	fly_items(params, on_complete) {
		game_data['allow_fly'] = true;
		let i;
		let amount = params['amount'];
		let delay = 50;			
		let func;

		for (i = 0; i < amount; i++) {
				func = (i == amount - 1) ? on_complete : function(){};
				this.show_moving_item(params, delay * i, func);
		}
	}

	show_moving_item(params, delay, on_complete) {
		let item_atlas = params['item_atlas'];
		let item_name = params['item_name'];
		let holder = params['holder'];
		let pt_start = this.toLocal(holder, params['pt_start']);
		let pt_end = this.toLocal(holder, params['pt_end']);

		let item = new Phaser.GameObjects.Image(this.scene, 0, 0, item_atlas, item_name);
		if (item_name === 'star') item.setScale(0.4);
		item.x = pt_start.x;
		item.y = pt_start.y;
		if (holder && holder.scene) {
			holder.add(item);
			let temp_pt = this.toGlobal(holder, pt_start);
			let _x = loading_vars['W'] / 2;
			let _y = loading_vars['H'] / 2;
			if (temp_pt.y  > _y) _y = loading_vars['H'] * 0.2;
			if (temp_pt.x > _x) _x = temp_pt.x;
			let pt_mid = new Phaser.Geom.Point(_x, _y);
			pt_mid = this.toLocal(holder, pt_mid);
			setTimeout(() => {
				game_data['utils'].bezier(pt_start, pt_mid, pt_end, item, 500, 'Sine.easeOut', this, () => {
					this.add_light_stars(params['pt_end'], holder, on_complete);
					item.destroy();
				});   


			}, delay);
		}		
	}

	add_light_stars(_pt, holder, on_complete) {
		if (!('allow_fly' in game_data)) game_data['allow_fly'] = true;
		if (game_data['allow_fly']) {
			let star_light;
			let diff_x;
			let diff_y;
			let radius = 30;
			let light_stars_number = 15;	
			let pt = this.toLocal(holder, _pt);
			let func;
			
			for (let i = 0; i < light_stars_number; i++) {
					star_light = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'light_star');
					star_light.x = pt.x - (Math.random() - 0.5) * 20;
					star_light.y = pt.y - (Math.random() - 0.5) * 20;
					diff_x = 2 * radius * Math.random() - radius;
					diff_y = Math.sqrt(radius * radius - diff_x * diff_x) * (2 * Math.floor(2 * Math.random()) - 1);
					func = (i == light_stars_number - 1) ? on_complete : null;
					this.move_light_star(star_light, new Phaser.Geom.Point(star_light.x + diff_x, star_light.y + diff_y), holder, func);
			}
		}
	}

	move_light_star(star_light, pt, holder, on_complete = null) {
		if (holder && holder.scene) holder.add(star_light);			
		game_data['scene'].tweens.add({targets: star_light, x: pt.x, y: pt.y, duration: 100 + 150 * Math.random(), onComplete: function(){
				game_data['scene'].tweens.add({targets: star_light, alpha: 0, duration: 100, onComplete: function(){
						star_light.destroy();
						if (on_complete) {
							on_complete();
						}
				}});
		}});					
	}
	bezier(start_pt, mid_pt, end_pt, item, _duration, _ease, scope, on_complete = null, extra_mid_pt = null, delay = 0, emitter = null, emitter_pos_mod = {x: 0, y: 0}) {
		let curve;
		let allow_stop_emitter = false;
		let stop_emitter_level = 0.9;
		if (emitter) {
			emitter.stop();
			allow_stop_emitter = true;
		}
		if (extra_mid_pt != null) curve = new Phaser.Curves.CubicBezier(start_pt, extra_mid_pt, mid_pt, end_pt);
		else curve = new Phaser.Curves.QuadraticBezier(start_pt, mid_pt, end_pt);
		item.bezier_val = 0;
		
		game_data['scene'].tweens.add({
			targets: item, bezier_val: 1,
			duration: _duration,
			delay: delay,
			ease: _ease,
			callbackScope: scope,
			onUpdate: function(tween, target){
				let position = curve.getPoint(item.bezier_val);
				item.x = position.x;
				item.y = position.y;
				if (allow_stop_emitter && item.bezier_val > stop_emitter_level) {
					emitter.stop();
					allow_stop_emitter = false;
				}
				else if (emitter) {
					emitter.setPosition(item.x + emitter_pos_mod.x, item.y + emitter_pos_mod.y);
				}
			},
			onComplete: function(){
				item.x = end_pt.x;
				item.y = end_pt.y;
				
				if (allow_stop_emitter) emitter.stop();
				
				
				if (on_complete) on_complete();
			}
		});
		if (emitter) emitter.start();
	}
	
	init_tips() {
		this.tip_overlay = new Phaser.GameObjects.Container(this.scene, 0, 0);
		this.tip_overlay.visible = false;
		this.scene.add.existing(this.tip_overlay);
		this.tip_dark = new Phaser.GameObjects.Image(this.scene, 0, 0,'dark_overlay');
		this.tip_dark.setOrigin(0,0);
		this.tip_dark.alpha = 0.4;
		this.tip_overlay.add(this.tip_dark)
		
		this.tip_bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'tip_bg');
		this.tip_bg_origin = 0.04;
		this.tip_bg.setOrigin(this.tip_bg_origin, 0);
		this.tip_overlay.add(this.tip_bg);
		this.tip_dark.setInteractive();
		this.tip_dark.on('pointerup', this.hide_tip, this);
	}

	place_tip(type, bg, holder, _pt) {
		let origin = this.tip_bg_origin;
		let w = bg.displayWidth;;
		let h = bg.displayHeight;
		let pt = this.toLocal(holder, _pt);
		let shift_mod_y = 10;
		let shift_mod_x = 0;
		if (type == 'money_tip') {
			origin = this.money_tip_bg_origin;			
			shift_mod_y = 5;
			shift_mod_x = 2;
		}
		let tx = pt.x;
		let ty = pt.y;
		let pos1 = (pt.y < loading_vars['H'] - h) ? 'top' : 'down';
		let pos2 = (pt.x < loading_vars['W'] - w) ? 'left' : 'right';
		let position = pos1 + '_' + pos2;
		let scaleX = Math.abs(bg.scaleX);
		let scaleY = Math.abs(bg.scaleY);
		if (position == 'top_left') {
			tx += w * (0.5 - origin) + shift_mod_x;
			ty += h * 0.5 + shift_mod_y;

		}
		if (position == 'top_right') {
			scaleX *= -1;
			tx -= w * (0.5 - origin) - shift_mod_x;
			ty += h * 0.5 + shift_mod_y;
		}
		if (position == 'down_left') {
			scaleY *= -1;
			tx += w * (0.5 - origin) + shift_mod_x;
			ty -= h * 0.5 + shift_mod_y;
		}
		if (position == 'down_right') {
			scaleX *= -1;
			scaleY *= -1;
			tx -= w * (0.5 - origin) - shift_mod_x;
			ty -= h * 0.5 + shift_mod_y;
		}
		bg.setScale(scaleX,scaleY);
		bg.x = pt.x;
		bg.y = pt.y;

		return {tx: tx, ty: ty};
	}

	show_tip(params, on_hide = null) {
		if (params['forced'] || (!this.tip_showing && !game_data['game_windows'].game_window)) {
			let holder = this.tip_overlay;
			holder.on_hide = on_hide;
			this.tip_showing = true;
			this.tip_hidable = false;
			let res;
			if (this.tip_text) this.tip_text.destroy();
			if (this.tip_img) this.tip_img.destroy();
			let txt_pos = this.place_tip('common', this.tip_bg, holder, params['pt']);
			let tx = txt_pos.tx;
			let ty = txt_pos.ty;
			let style = { ...game_data['styles']['light_text2'], fontFamily:"font1", fontSize: 24, align: 'center',  wordWrap: {'width': 270}}

				res = this.generate_string({'scene_id': params['scene_id'], 'item_id': params['item_id'], 'phrase_id': params['phrase_id'], 'values': params['values'], 'base_size': 24});		
				style.fontSize = res['size'];
				this.tip_text = new Phaser.GameObjects.Text(this.scene, tx, ty, res['text'], style);
				this.tip_text.setLineSpacing(-5);
				this.tip_text.setOrigin(0.5);

			this.paused_tip = null;
			this.tip_overlay.add(this.tip_text);
			if (params['img_config']) {
				let texture = params['img_config']['texture'];
				let frame = params['img_config']['frame'];
				let scale = 'scale' in params['img_config'] ? params['img_config']['scale'] : 1;
				let img_x = 'img_x' in params['img_config'] ? params['img_config']['img_x'] : 0;
				let img_y = 'img_y' in params['img_config'] ? params['img_config']['img_y'] : 0;
				let txt_x = 'txt_x' in params['img_config'] ? params['img_config']['txt_x'] : 0;
				let txt_y = 'txt_y' in params['img_config'] ? params['img_config']['txt_y'] : 0;
				let img = new Phaser.GameObjects.Image(this.scene, tx + img_x, ty + img_y, texture, frame);
				img.setScale(scale);
				this.tip_overlay.add(img);
				this.tip_text.x += txt_x;
				this.tip_text.y += txt_y;
				this.tip_img = img;
				
			}
			holder.alpha = 0;
			holder.visible = true;
			game_data['scene'].tweens.add({targets: holder, alpha: 1, duration: 150}); 
			setTimeout(() => {
				this.tip_hidable = true;
			}, 150);
			if (this.tid_tip_auto_hide) clearTimeout(this.tid_tip_auto_hide);
			if (params['hide_timeout']) this.tid_tip_auto_hide = setTimeout(() => {
				this.hide_tip();
			}, params['hide_timeout']);
		}
		else this.paused_tip = {'params': params, 'on_hide': on_hide};
	}
	resume_tip() {
		if (this.paused_tip) {
			this.show_tip(this.paused_tip['params'], this.paused_tip['on_hide']);
		}
	}
	hide_tip() {
		if (this.tip_hidable) {
			this.tip_hidable = false;
			let holder = this.tip_overlay;
			this.scene.tweens.add({targets: holder, alpha: 0, duration: 150, onComplete: () => {
					holder.visible = false;
					if (this.tip_text) this.tip_text.destroy();
					this.tip_text = null;
					if (holder.on_hide) holder.on_hide();
					holder.on_hide = null;
					this.tip_showing = false;
					this.resume_tip();
			}});
			if (this.tid_tip_auto_hide) clearTimeout(this.tid_tip_auto_hide);
		}
	}

	generate_string(params) {
		let i;
		let lang_id = game_data['user_data']['lang'].toUpperCase();
		if (game_data['langs'].indexOf(game_data['user_data']['lang']) < 0) lang_id = 'EN';
		let scene_id = params['scene_id'];
		let item_id = params['item_id'];
		let phrase_id = String(params['phrase_id']);
		let base_size = params['base_size']
		let res = {};
		let text_obj = {};
		try {
			text_obj = game_data['language'][scene_id][item_id][phrase_id][lang_id];
		}
		catch (e) {
			text_obj = {'text': 'missed_text', 'size' : 0};
			let msg = 'no_text';
			let error = {'stack': scene_id + ' ' + item_id + ' ' + phrase_id + ' ' + lang_id}
		}
		res['size'] = base_size + text_obj['size'];


		let txt = text_obj['text'];
		if ('values' in params) {
			let values = params['values'];
			let output = txt;
			let pattern = /%val/;
			for (i = 0; i < values.length; i++) {
				output = output.replace(pattern, values[i]);
				if (output.indexOf("[") >= 0) {
					output = this.replace_correct_word(output, values[i], lang_id);
				}
			}
			txt = output;
		}
		let myPattern = /\\n/gi;
		txt = txt.replace(myPattern,'\n');
		res['text'] = txt;
		return res;

	}

		
	replace_correct_word(txt, val, lang_id) {
		let start_index;
		let ind;
		let ind1;
		let ind2;
		let str;
		let str_all;
		let correct_word; 
		let arr;
		
		start_index = 0;
		ind = 0;
		ind1 = txt.indexOf("[", start_index);
		ind2 = txt.indexOf("]", start_index);
		if (ind1 >= 0 && ind2 >= 0 && ind2 > ind1) {
			str_all = txt.substr(ind1, ind2 - ind1 + 1);
			str = txt.substr(ind1 + 1, ind2 - ind1 - 1);
			arr = str.split(',');
		}
		
		correct_word = '';
		if (lang_id == 'RU' && arr.length == 3) {
			if (val % 100 > 10 && val % 100 < 20) {
				correct_word = arr[2];
			}
			else {
				switch (val % 10) {
					case 0: correct_word = arr[2]; break;
					case 1: correct_word = arr[0]; break;
					case 2: correct_word = arr[1]; break;
					case 3: correct_word = arr[1]; break;
					case 4: correct_word = arr[1]; break;
					case 5: correct_word = arr[2]; break;
					case 6: correct_word = arr[2]; break;
					case 7: correct_word = arr[2]; break;
					case 8: correct_word = arr[2]; break;
					case 9: correct_word = arr[2]; break;
				}
			}				
		}	
		else if (arr.length == 2) {
			correct_word = (val == 1 ? arr[0] : arr[1]);
		}			
		
		if (correct_word.length > 0)
			txt = txt.replace(str_all, correct_word);
		
		return txt;
	}		
		
	get_time() {
		return new Date().getTime();
	}

check_ads(event_type) {
	if (game_data['ads'] && game_data['ads']['interstitial']) {
		let mults = game_data['ads']['interstitial']['event_mult']
		if (mults) {
			let prob = 100;
			if (event_type in mults) prob *= mults[event_type];
			let rand = Math.random() * 100;
			if (rand < prob) this.show_interstitial_ad();
		}
	}
}

check_matrix_empty(arr) {
	for (let i = 0; i < arr.length; i++)
		for (let j = 0; j < arr[i].length; j++)
			if (arr[i][j] != '-' && arr[i][j] != '0')
				return false;
				
	return true;			
}

getNumbers(n) {
	let numbers = [];
	
	for (let i = 1; i <= n; i++) {
	  numbers.push(i);
	}
	
	return numbers;
}

get_random_from_2d(arr, w, h) {
	if (!Array.isArray(arr)) return null
	let pos_y, pos_x
	do {
		pos_y = parseInt(Math.random() * w);
		pos_x = parseInt(Math.random() * h);
		
		
	} while (!(arr[pos_y] && arr[pos_y][pos_x] && arr[pos_y][pos_x] !== '-'))
	
	return [pos_y, pos_x]
}

	hide_loader(id) {
		for (let i = 0; i < game_data['loader_anims']['circles'][id].length; i++)
			game_data['loader_anims']['circles'][id][i].visible = false;		
		
		game_data['loader_anims']['hidden'][id] = true;				
	}
	
	show_interstitial_ad() {
		if (navigator.onLine && game_data['user_data']['payments']['total'] === 0) {
			game_data['socialApi'].show_interstitial_ad();
		}
	} 
	
	show_rewarded_ad(on_complete) {
		if (navigator.onLine && allow_rewarded_ads) {
			game_data['socialApi'].show_rewarded_ad(on_complete);	
		}
		else on_complete({'success': false});
	}

	purchase(obj, on_complete) {
		game_data['wait_for_purchase'] = true;
		game_data['socialApi'].purchase(obj, result => {
			game_data['wait_for_purchase'] = false;
			on_complete(result);
		});

	}

	update_language() {
		game_request.update_language();
	}

	get_loader(use_suffix = true) {
		let loader = new Phaser.Loader.LoaderPlugin(game_data['scene']);
		return loader;
	}

	show_components(cont) {
		if (cont && cont.type === 'Container') {
			console.log(cont.list)
			cont.each(el => this.show_components(el))
		}
	}

	delayed_call(delay, on_complete = () => {}) {
		let timer = game_data['scene'].time.delayedCall(delay, () => {
			on_complete()
			setTimeout(() => {
				timer.remove()
				timer.destroy(true);
			}, 10)
		});
		return timer
	}

	deep_copy(inObject) {
		let outObject;
		let value;
		let key;

		if (typeof inObject !== 'object' || inObject === null)
		{
			return inObject;
		}

		outObject = Array.isArray(inObject) ? [] : {};

		for (key in inObject)
		{
			value = inObject[key];
			outObject[key] = this.deep_copy(value);
		}

		return outObject;
	}

	lock_game() {		
		game_data.game_overlay.visible = true;
	}

	unlock_game() {
		game_data.game_overlay.visible = false;
	}

	average(values) {
		let sum = 0;
		for (let i = 0; i < values.length; i++) {
			sum += values[i];
		}
		return Math.floor(sum / values.length);
	}

	linspace(startValue, stopValue, cardinality) {
		let arr = [];
		let step = (stopValue - startValue) / (cardinality - 1);
		for (let i = 0; i < cardinality; i++) {
		  arr.push(startValue + (step * i));
		}
		return arr;
	}

	vector(p1, p2) {
		return {
				x: (p2.x - p1.x),
				y: (p2.y - p1.y)
		};
	}

	dot(u, v) {
		return (u.x * v.x + u.y * v.y);
	}
}