
define([
// tupuConfig.getViewFile("line"),
tupuConfig.baseUrl+'/collections/lineCollection.js'
],
// function(Line,LCollection){
function(LCollection){
	
	var lineView = Backbone.View.extend({
		
		initialize:function(param){
//			console.log("lineView")
			var self = this;
			
			self.viewCollection = new LCollection();
			self.model = new Backbone.Model();
			
//			self.model.set({
//				lineDoneFlag:true
//			})
			//
			self.paper = param.paper;
			self.nodeCollection = param.nodeCollection;
			self.configM = param.configM;

			
			self.initEvents();
		}
		,initPaper:function(){
			var self = this;
			

			this.paper = Raphael(self.$el[0],self.$el.width() - 20,self.$el.height() - 20);			
			this.canvas = $(this.paper.canvas);
			
		}
		,initEvents:function(){
			this.listenTo(this.viewCollection,"add",this.createLine);		
			this.listenTo(this.viewCollection,"remove",this.removeModel);
			this.listenTo(this.model,"lineDone",this.lineDone);
			this.listenTo(this.viewCollection,"reset",this.resetLines);
//			this.listenTo(this.model,"isDone",this.isDone);
			
		}
//		,isDone:function(lModel){
//			
//			if(!this.model.get("lineDoneFlag")){
//				return
//			}
//			
//			if(_.findIndex(this.viewCollection.models,lModel) == (this.viewCollection.length - 1)){
//				this.model.trigger("lineDone");
//				this.model.set({
//					lineDoneFlag:false
//				})
//			}
//
//			
//			
//		}
		,removeModel:function(model,collection,pos){
			//删除线model的时候把svg实例删除
			model.get("lineSvg").remove();
			
			//删除线上标题svg
			_.each(model.get("textSvg"),function(text){
				text.remove();
			});
			
		}
		,createLine:function(model,viewCollection,type){
			/*
			 * 创建线
			 */
			
			var self = this;
			
			require([tupuConfig.getViewFile("line")],function(Line){
				var l = new Line({
					model:model
					,paper:self.paper
					,nodeCollection:self.nodeCollection
					,configM:self.configM
				});
				
				self.model.trigger("isDone",model)
				
				if(_.findIndex(viewCollection.models,model) == (viewCollection.length - 1)){
					self.model.trigger("lineDone");
				}
			})
		}
		,lineDone:function(){
//			console.log("lineView:lineDone")
		}
		,resetLines:function(collection,options){			
			_.each(options.previousModels,function(model){
				model.get("lineSvg").remove();				
				_.each(model.get("textSvg"),function(textSvg){
					textSvg.remove();
				});		
			});
		}
		
		
	})
	
	return lineView;
	
});
