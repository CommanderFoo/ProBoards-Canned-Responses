"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canned_Responses = function () {
	function Canned_Responses() {
		_classCallCheck(this, Canned_Responses);
	}

	_createClass(Canned_Responses, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_canned_responses";
			this.route = pb.data("route");
			this.canned = pb.data("options_img_src");
			this.responses = [];

			this.setup();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			var posting_location_check = this.route.name == "quote_posts" || this.route.name == "new_post" || this.route.name == "new_thread" || this.route.name == "edit_post" || this.route.name == "edit_thread";

			if (posting_location_check) {

				// Credit to Chris (aka Eton Bones) for the "wysiwygcreate" event

				$(document).on("wysiwygcreate", this.create_canned_list.bind(this));
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				var plugin_settings = plugin.settings;

				if (plugin_settings.responses) {

					// Filter out first

					var resp = plugin_settings.responses;
					var grps = pb.data("user").group_ids;

					for (var r = 0, l = resp.length; r < l; ++r) {
						for (var g = 0, gl = grps.length; g < gl; ++g) {
							if ($.inArrayLoose(grps[g], resp[r].who_can_use) > -1) {
								this.responses.push(resp[r]);
								break;
							}
						}
					}
				}

				if (plugin.images) {
					this.canned = plugin.images.canned;
				}
			}
		}
	}, {
		key: "create_canned_list",
		value: function create_canned_list() {
			var _this = this;

			if (!this.responses.length) {
				return;
			}

			var $menu = $("<ul class='options_menu hide ui-menu ui-helper-clearfix ui-selectMenu' />");

			for (var r = 0, l = this.responses.length; r < l; ++r) {
				$menu.append("<li data-canned-response-index='" + r + "'><a>" + this.responses[r].title + "</a></li>");
			}

			$menu.appendTo(document.body);

			var $controls = $("#posting-options-container").parent();
			var $opts = $("<div class='post-options button canned-responses-button' id='canned-responses-dropdown'></div></div>");

			$controls.append($opts);

			$menu.selectMenu({

				status: "<img src='" + this.canned + "' />",
				staticStatus: true,
				container: "#canned-responses-dropdown",
				menuOptions: {

					click: function click(event, ui) {
						var index = parseInt($(ui.item).attr("data-canned-response-index"), 10);

						if (!isNaN(index) && _this.responses[index]) {
							var wysiwyg = $(".wysiwyg-textarea").data("wysiwyg");
							var editor = wysiwyg.currentEditorName;
							var content = _this.responses[index].content;

							wysiwyg.editors[editor].replaceSelection(editor == "visual" ? document.createTextNode(content) : content);
						}
					}
				}

			});
		}
	}]);

	return Canned_Responses;
}();


Canned_Responses.init();