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
		console.log('Clicked');
		//this.model.trigger("mousedown", this);
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
		return this;
	}
	
});

/*	App View
_________________________________________________________ */

var MediaContainer = Backbone.View.extend({
	
	initialize: function() 
	{
		boxes.bind('add', this.add_box_view, this);
		this.generate_boxes();
		this.test_input();
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
	
	test_input : function()
	{
		var view = new NewBoxView();
		$(this.el).append(view.render().el);
	},

	add_box_view : function(box)
	{
		var view = new BoxView({model: box});
		$(this.el).append(view.render().el);
	}
	
});

window.mediaContainer = new MediaContainer({"el" : "#media-container"});