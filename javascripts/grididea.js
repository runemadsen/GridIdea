/*	Models
__________________________________________________________ */

var Dot = Backbone.Model.extend({
	defaults: {}
});

var Media = Backbone.Model.extend({
	defaults: {}
});

/*	Collections
__________________________________________________________ */

var DotList = Backbone.Collection.extend({
	model : Dot
});

var dots = new DotList();

var MediaList = Backbone.Collection.extend({
	model : Media
});

var medias = new DotList();

/*	Views
_________________________________________________________ */

var DotView = Backbone.View.extend({
  
	tagName: "div",
	className: "dot",

	events: {
		"mousedown" : "mousedown",
		"ondrag" : "prevent_drag",
		"onselect" : "prevent_drag"
  },

	prevent_drag : function(e)
	{
		e.preventDefault();
	},
	
	render : function()
	{
		$(this.el).css("left", this.model.get("left"));
		$(this.el).css("top", this.model.get("top"));
		return this;
	},
	
	mousedown : function()
	{
		this.model.trigger("mousedown", this);
	}
	
});

var MediaView = Backbone.View.extend({
  
	tagName: "div",
	className: "media",
	
	initialize : function()
	{
		this.model.bind('change', this.render, this);
	},
	
	render : function()
	{
		$(this.el).css("left", this.model.get("left"));
		$(this.el).css("top", this.model.get("top"));
		$(this.el).css("width", this.model.get("width"));
		$(this.el).css("height", this.model.get("height"));
		return this;
	}
	
});

/*	App View
_________________________________________________________ */

var MediaContainer = Backbone.View.extend({
  
	events: {
			"mousedown" : "mousedown",
	    "mousemove" : "mousemove",
			"mouseup" : "mouseup",
			"ondrag" : "prevent_drag",
			"onselect" : "prevent_drag"
	},
	
	prevent_drag : function(e)
	{
		e.preventDefault();
	},
	
	initialize: function() 
	{
		dots.bind('add', this.add_dot_view, this);
		dots.bind('mousedown', this.dot_mousedown, this)
		medias.bind('add', this.add_media_view, this);
		
		this.generate_dots();
  },

	generate_dots : function()
	{
		var dotsAcross = 15;
		this.dotSpacing = ($(this.el).width() - 6) / (dotsAcross - 1);
		var yPos = 0;
		
		while(yPos < $(this.el).height())
		{
			for(var i = 0; i < dotsAcross; i++)
			{
				dots.add({"left" : i * this.dotSpacing, "top" : yPos});
			}
			
			yPos += this.dotSpacing;
		}
	},

	add_dot_view : function(dot)
	{
		var view = new DotView({model: dot});
		$(this.el).append(view.render().el);
	},
	
	add_media_view : function(media)
	{
		this.sizing_media = new MediaView({model: media});
		$(this.el).append(this.sizing_media.render().el);
	},
	
	dot_mousedown : function(dot)
	{
		medias.add({"left" : dot.model.get("left") + 3, "top" : dot.model.get("top") + 3});
	},
	
	mousedown : function(e)
	{
		e.preventDefault();
	},
	
	mousemove : function(e)
	{
		if(this.sizing_media)
		{
			var offset = $(this.sizing_media.el).offset();
			var width = e.pageX - offset.left;
			var height = e.pageY - offset.top;
			
			var divider_width = width / this.dotSpacing;
			var divider_height = height / this.dotSpacing;
			var divider = divider_width > divider_height ? divider_width : divider_height;
			var floored_divider = Math.floor(divider);
			
			width = height = floored_divider * this.dotSpacing;
			
			if(divider - floored_divider > 0.5)
			{
					width = height = (floored_divider + 1) * this.dotSpacing ;
			}
			
			if(width < 10) width = height = 10;
			
			this.sizing_media.model.set({"width" : width, "height" : height});
		}
	},
	
	mouseup : function()
	{
		if(this.sizing_media)
		{
			if(this.sizing_media.model.get("width") <= 10)
			{
				this.sizing_media.model.set({"width" : this.dotSpacing, "height" : this.dotSpacing});
			}
			
			this.sizing_media = false;
		}
		
	}
	
});

window.mediaContainer = new MediaContainer({"el" : "#container"});