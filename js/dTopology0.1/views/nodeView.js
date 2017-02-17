// console.log(tupuConfig.getViewFile("node"));
define([
// tupuConfig.getViewFile("node"),
tupuConfig.baseUrl+'/collections/nodeCollection.js',
// tupuConfig.getViewFile("group"),
tupuConfig.baseUrl+'/collections/groupCollection.js'
]
// ,function(Node,NCollection,Group,GCollection){
,function(NCollection,GCollection){
	
	var NodeView = Backbone.View.extend({
		
		
		initialize:function(param){
//			console.log("nodeView")
			var self = this;
			
			//
			self.paper = param.paper;
//			self.canvas = param.canvas;
			self.configM = param.configM;
			
//			console.log(self.paper)
//			console.log(self.canvas)
			
			this.viewCollection = new NCollection();
			this.groupCollection = new GCollection();
			this.model = new Backbone.Model();
			
			
			self.initEvents();
			
		}
		,initEvents:function(){
			
			this.listenTo(this.viewCollection,"add",this.createNode);		
			this.listenTo(this.viewCollection,"remove",this.removeNode);
			this.listenTo(this.viewCollection,"nodeDone",this.nodeDone);		
			
			this.listenTo(this.viewCollection,"reset",this.resetNodes)
			
			this.listenTo(this.model,"initGroup",this.initGroup);
			this.listenTo(this.model,"groupDone",this.groupDone);
			
			
			this.listenTo(this.groupCollection,"add",this.createGroup);
			this.listenTo(this.groupCollection,"remove",this.removeGroup);
			
//			this.listenTo(this.groupCollection,"mouseEvents",this.mouseEvents);
			
		}
		,createNode:function(model,viewCollection,type){
			
			var self = this;
				// console.log(tupuConfig.getViewFile("node"));
			require([tupuConfig.getViewFile("node")],function(Node){
				var n = new Node({
					className:"node"
					,model:model
					,paper:self.paper
					,viewCollection:viewCollection
	//				,configM:self.configM
	//				,canvas:self.canvas
				});
					
				
				self.$el.append(n.$el)
			})

//			if(_.findIndex(viewCollection.models,model) == (viewCollection.length - 1)){
//				this.model.trigger("nodeDone");
//			}
		}
		,nodeDone:function(){
//			console.log("2222")
			this.model.trigger("nodeDone");
		}
		,removeNode:function(model,collection,pos){
//			console.log(model.toJSON())
//			console.log(collection)
//			console.log(pos)
//			console.log("-----")
			
			//删除svg
			model.get("rectSvg").remove();
			
			//删除对应node html模板信息
			model.get("jqNode").remove();
			
			
		}
		,initGroup:function(group){
			var len = group.length;
			var nodesID = this.viewCollection.pluck("id");
			var groupNodeId = [];
			
			_.each(group,function(item){			
				groupNodeId = _.union(groupNodeId,item.members);		
			});
			
			var otherID = _.difference(nodesID,groupNodeId);
			_.each(otherID,function(id){
				group.push({
					id:(++len)
					,members:[id]
				})
			});
			
			
			this.groupCollection.reset();
			this.groupCollection.add(group);
			
		}
		,createGroup:function(model,groupCollection,type){
			
			var self = this;
			
			require([tupuConfig.getViewFile("group")],function(Group){
				var gRect = new Group({
					model:model
					,nodeCollection:self.viewCollection
					,configM:self.configM
					,paper:self.paper
	//				,canvas:self.canvas
				});
				
				
				
				if(_.findIndex(groupCollection.models,model) == (groupCollection.length - 1)){
					this.model.trigger("groupDone");
				}
			})
		}
		,groupDone:function(){
//			console.log("groupDone")
//			console.log(this.groupCollection)
		}
		,removeGroup:function(model,collection,pos){
//			console.log(model)
//			console.log(collection)
//			console.log(pos)
			//删除svg
			model.get("rectSvg").remove();			
		}
		,resetNodes:function(collections,options){
			_.each(options.previousModels,function(model){
				model.get("rectSvg").remove();
				model.get("jqNode").remove();				
			})
		}
		
	})
	
	return NodeView;
	
});
