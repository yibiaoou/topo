define([],function(){
	
	var Group = Backbone.View.extend({
	
	
		initialize:function(param){
			var self = this
			
			this.paper = param.paper;
			this.configM = param.configM;
			this.nodeCollection = param.nodeCollection;
			
			this.model.set({
				nodeSpace:10
			});
			
			
			var nodesM = []
			var members = this.model.get("members");
			_.each(members,function(id){
				var nodeM = self.nodeCollection.get(id);
				//保存groupCid到nodeM中
				nodeM.set({
					groupCid:self.model.cid
				});
				
				nodesM.push(nodeM);				
			});
			
			this.model.set({
				nodesM:nodesM
			});
			
			//删除members属性，并且不触发change
			this.model.unset("members",{slient:true});
			
			this.initEvents();
			this.createGroupRect();
			
			
		}
		,initEvents:function(){
			this.listenTo(this.model,"change:locate",this.groupLocateChange);
			this.listenTo(this.model,"updateLocate",this.updateNodeLocate);
			this.listenTo(this.model,"svgDone",this.svgDone);
			
		}
		,countBoxSize:function(){
			var width = 0,
					height = 0,
					model = this.model,
					nodesM = model.get("nodesM"),
					nodeSpace = model.get("nodeSpace")
			
			_.each(nodesM,function(nodeM){
				var bbox = nodeM.get("rectSvg").getBBox();
						
				width += bbox.width + nodeSpace;
				height = height < bbox.height ? bbox.height : height;
				
				
//				nodeM.get("jqNode").hide();
			});
			
			width += nodeSpace;
			height += nodeSpace * 2;
					
			return {
				width:width,
				height:height
			}
		}
		,createGroupRect:function(){
			var self = this,
					model = this.model,
					locate = model.get("locate")



			var boxSize = this.countBoxSize();
			
			var gRect = self.paper.rect(locate.x,locate.y,boxSize.width,boxSize.height,3)
			gRect.attr({
				"fill": "#fff",
				"stroke": "#f00",
				"stroke-width": 2,
				"fill-opacity": 0,
				"cursor": "move",
				"title": "group"
			});
			
			model.set({
				rectSvg:gRect
			})
			
			this.groupSvgEvents(gRect);
			
			model.trigger("svgDone");
		}
		,groupSvgEvents:function(svgObj){
			var self = this;
			

			
			//由于raphael绑定事件e在IE无法传递，使用jquery绑定鼠标事件
			$(svgObj[0]).on("mousedown",function(e){
				switch(parseInt(e.which)){
					case 1:
						self.model.trigger("groupMouse",{
							type:"leftDown"
							,e:e
//							,svg:this
							,model:self.model
							,role:"group"
						});
					break;
					case 3:
//					console.log(self.model)
						self.model.trigger("groupMouse",{
							type:"rightDown"
							,e:e
//							,svg:this
							,model:self.model
							,role:"group"
						});
					break;
				}			
			})
			.on("mouseup",function(e){
				self.model.trigger("groupMouse",{
					type:"up"
					,e:e
//					,svg:this
					,model:self.model
					,role:"group"
				});
			})
//			return
			svgObj.drag(onmove, onstart, onend)
			
 			var x, y;			
			function onmove(dx, dy) {			
				this.attr({
					x: (x + dx),
					y: (y + dy)
				});			
			
				self.model.set({
					locate: {
						x: (x + dx),
						y: (y + dy)
					}
				});
				
			}
			
			function onstart() {
				x = this.attr("x");
				y = this.attr("y");
				this.animate({
					"fill-opacity": 0.2
				}, 500);
			}
			
			function onend() {
				this.animate({
					"fill-opacity": 0
				}, 500);
			}
			
		}
		,svgDone:function(){
//			console.log("svgDone")
			this.updateNodeLocate();
			
//			console.log(this.configM)
		}
		,groupLocateChange:function(){

			var self = this;


			this.updateNodeLocate();
		}
		,updateNodeLocate:function(param){
			var self = this,
					model = this.model,
					locate = model.get("locate"),
					nodesM = model.get("nodesM"),
					boxSize,
					offset = {
						space:model.get("nodeSpace")
						,left:0
					}
			
			//这个判断用于删除node节点时resize group
			if(param&&param.resize){
				boxSize = self.countBoxSize();
				model.get("rectSvg").attr(boxSize)
			}

			_.each(nodesM,function(nodeM){				
				offset.left += offset.space;				
				nodeM.set({
					locate:{
						x:locate.x + offset.left
						,y:locate.y + offset.space
					}
				});				
				offset.left += nodeM.get("rectSvg").getBBox().width;				
			});
			
						
		}
		
	
	
	
	
	
	
	
	
	
	
	});
	
	return Group;
	
});