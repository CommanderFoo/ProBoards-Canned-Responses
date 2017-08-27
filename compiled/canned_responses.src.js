class Canned_Responses {

	static init(){
		this.PLUGIN_ID = "pd_canned_responses";
		this.route = pb.data("route");
		this.canned = pb.data("options_img_src");
		this.responses = [];

		this.setup();

		$(this.ready.bind(this));
	}

	static ready(){
		let posting_location_check = (

			this.route.name == "quote_posts" ||
			this.route.name == "new_post" ||
			this.route.name == "new_thread" ||
			this.route.name == "edit_post" ||
			this.route.name == "edit_thread"

		);

		if(posting_location_check){

			// Credit to Chris (aka Eton Bones) for the "wysiwygcreate" event

			$(document).on("wysiwygcreate", this.create_canned_list.bind(this));
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			let plugin_settings = plugin.settings;

			if(plugin_settings.responses){

				// Filter out first

				let resp = plugin_settings.responses;
				let grps = pb.data("user").group_ids;

				for(let r = 0, l = resp.length; r < l; ++ r){
					for(let g = 0, gl = grps.length; g < gl; ++ g){
						if($.inArrayLoose(grps[g], resp[r].who_can_use) > -1){
							this.responses.push(resp[r]);
							break;
						}
					}
				}
			}

			if(plugin.images){
				this.canned = plugin.images.canned;
			}
		}
	}

	static create_canned_list(){
		if(!this.responses.length){
			return;
		}

		let $menu = $("<ul class='options_menu hide ui-menu ui-helper-clearfix ui-selectMenu' />");

		for(let r = 0, l = this.responses.length; r < l; ++ r){
			$menu.append("<li data-canned-response-index='" + r + "'><a>" + this.responses[r].title + "</a></li>");
		}

		$menu.appendTo(document.body);

		let $controls = $("#posting-options-container").parent();
		let $opts = $("<div class='post-options button canned-responses-button' id='canned-responses-dropdown'></div></div>");

		$controls.append($opts);

		$menu.selectMenu({

			status: "<img src='" + this.canned + "' />",
			staticStatus: true,
			container : "#canned-responses-dropdown",
			menuOptions: {

				click: (event, ui) => {
					let index = parseInt($(ui.item).attr("data-canned-response-index"), 10);

					if(!isNaN(index) && this.responses[index]){
						let wysiwyg = $(".wysiwyg-textarea").data("wysiwyg");
						let editor = wysiwyg.currentEditorName;
						let content = this.responses[index].content;

						wysiwyg.editors[editor].replaceSelection((editor == "visual")? document.createTextNode(content) : content);
					}
				}
			}

		});


	}

}

Canned_Responses.init();