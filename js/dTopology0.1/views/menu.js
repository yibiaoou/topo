define(['text!../templates/menu.html'],function(html){
	var menu = Backbone.View.extend({
		initialize:function(param){
			
//			console.log("menu")	
			
			this.template = _.template(html);
			
			this.menu = param.configM.get("menu");
			
			this.initEvents();
		}
		,initEvents:function(){
			this.listenTo(this.model,"showMenu",this.showMenu);
			this.listenTo(this.model,"hideMenu",this.hideMenu);
			
		}
		,events:{
			"click li":"clickMenu"
		}
		,showMenu:function(o){
			var self = this;
			this.$el.empty();
			var $el = this.template({menus:this.menu[o.role],role:o.role})
			this.$el.append($el);
			
			this.model.set({
				fireParam:o
			});
		

			var offset = this.$el.parent().offset();
			
			this.$el.css({
				left:(o.e.pageX - offset.left + this.$el.parent()[0].scrollLeft)
				,top:(o.e.pageY - offset.top + this.$el.parent()[0].scrollTop)
//				,width:(this.$el.width())
			});
			
			
			this.model.set({
				openSwitch:1
			});
			
		}
		,hideMenu:function(){
			this.$el.empty();
			
			
			this.model.set({
				openSwitch:0
			});
			
		}
		,clickMenu:function(e){
			var $el = this.$el;

			this.trigger("liClick",{
				e:e
				,eventType:"menuClick"
				,role:$el.find("ul").attr("data-role")
				,id:$(e.currentTarget).attr("data-id")
				,fireModel:this.model.get("fireParam").model
			});
			this.hideMenu();
//			console.log("1221")
		}
		
	});
	
	return menu;
});