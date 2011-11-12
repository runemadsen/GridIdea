/*	Models
__________________________________________________________ */

var Box = Backbone.Model.extend({
	defaults: {}
});

/*	Collections
__________________________________________________________ */

var BoxList = Backbone.Collection.extend({
	model : Box
});

var boxes = new BoxList();

/*	Box View
_________________________________________________________ */

var BoxView = Backbone.View.extend({
  
	tagName: "div",
	className: "box",
	
	template: Handlebars.compile($("#box-template").html()),

	events: {
		"mousedown" : "mousedown"
  },

	initialize : function()
	{
		this.model.bind('change', this.render, this);
	},
	
	render : function()
	{
		$(this.el).html(this.template(this.model.toJSON()));
		if(this.model.get("class"))
		{
			$(this.el).addClass(this.model.get("class"));
		}
		return this;
	},
	
	mousedown : function()
	{
		this.trigger("mousedown", this);
		return false;
	}
	
});

/*	New Box Video
_________________________________________________________ */

var NewBoxView = Backbone.View.extend({
  
	tagName: "div",
	id: "new_box",
	
	template: Handlebars.compile($("#new-box-template").html()),
	
	render : function()
	{
		$(this.el).html(this.template());
		$(this.el).css("left", this.options.left);
		$(this.el).css("top", this.options.top);
		this.bind_form_events();		
		return this;
	},
	
	bind_form_events : function()
	{
		var t = this;
		
		this.$('form').submit(function() {
			t.trigger('submit', t);
			t.remove();
			return false;
		});
		
		/* remove box on click
		
		$(window).click(function() {
			that.remove();
		});*/
	},
	
	focus : function()
	{
		$(this.el).find('form textarea:first').focus();
	},
	
	text_content : function()
	{
		return $(this.el).find('form textarea:first').val();
	}
	
});

/*	App View
_________________________________________________________ */

var MediaContainer = Backbone.View.extend({
	
	initialize: function() 
	{
		this.new_box_view = null;
		this.box_view = null;
		boxes.bind('add', this.add_box_view, this);
		this.generate_boxes();
  },

	generate_boxes : function()
	{
		var across = 6;
		var counter = 0;
		while(counter < 6 * 20)
		{
			var o = counter % across == 5 ? {class : "last_in_row"} : {};
			boxes.add(o);
			counter++;
		}
	},
	
	add_new_box_view : function(box_view)
	{
		if(this.new_box_view)
		{
			this.new_box_view.remove();
		}
		
		var pos = $(box_view.el).position();
		var view = new NewBoxView({left: pos.left - 20, top: pos.top - 20});
		view.bind('submit', this.fill_box_view, this);
		$(this.el).append(view.render().el);
		view.focus();
		this.new_box_view = view;
		this.box_view = box_view;
		return false;
	},

	add_box_view : function(box)
	{
		var view = new BoxView({model: box});
		view.bind('mousedown', this.add_new_box_view, this);
		$(this.el).append(view.render().el);
	},
	
	fill_box_view : function(new_box_view)
	{
		this.box_view.model.set({
			type : "text",
			content : new_box_view.text_content()
		})
		
		this.new_box_view = null;
		this.box_view = null;
	}
	
});

window.mediaContainer = new MediaContainer({"el" : "#media-container"});