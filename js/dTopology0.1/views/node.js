

define([]
	,function(){
	var Node = Backbone.View.extend({
 		initialize:function(param){
 			var self = this;
 			
// 			console.log(param)
// 			console.log(this)
 			this.model.set({
 				cid:this.model.cid
 				,fillColor:"#f1f1f1"
 				,strokeColor:"#aaa"
 				,strokeWidth:2
 				,role:"node"
 			});
 			
 			
// 			console.log(param)
 			self.paper = param.paper;
 			self.canvas = param.canvas;
 			self.viewCollection = param.viewCollection;
 			
 			self.initEvents();
 			
 			self.initNodeTemp();
 			
 			
 			this.model.set({
 				jqNode:this.$el
 			});
 			
 		}
 		,initEvents:function(){
 			
 			this.listenTo(this.model,"change:locate",this.changeLocate);
 			this.listenTo(this.model,"nodeDone",this.nodeDone);
 			
 			
 		}
 		,initNodeTemp:function(){ 			
 			var self = this,
 					model = this.model,
 					viewCollection = self.viewCollection,
 					tempUrl = tupuConfig.getTempFile({tempType:model.get("tempType"),name:"node"})
 					
 				
 			require([tempUrl],function(nodeTemp){
 				
// 				console.log(nodeTemp)
 				
 				template = _.template(nodeTemp);
 				template = template(self.model.toJSON());		

 				self.$el.append(template);
			
 				//svg画rect,由于前面是dom操作，使用延时实现异步
 				_.delay(function(){
 					self.initNodeRect();
 				},0); 				
 				
 				if(_.findIndex(viewCollection.models,model) == (viewCollection.length - 1)){
					model.trigger("nodeDone");
				}
 				
 			})

 		}
 		,initNodeRect:function(){
 			var self = this,
 					model = this.model, 			
					locate = model.get("locate"),
					nRect = self.paper.rect(locate.x, locate.y, 50, 50);	//默认给50
			
			//保存rect对象,用于划线
			self.model.set({
				rectSvg: nRect
			});
			
			//初始化时设置div位置
			this.$el.css({
				top:locate.y
				,left:locate.x
			});
			
			
			nRect.attr({
				"fill": model.get("fillColor"),
				"stroke": model.get("strokeColor"),
				"stroke-width": 0,
				"fill-opacity": 0,
				"cursor": "move",
				"title": model.get("showData").name,
				"width":this.$el.width(),
				"height":this.$el.height()
			});			
			
			self.rectSvgEvents(nRect);
 		}
 		,rectSvgEvents:function(svgObj){
 			var self = this;
 			
   			svgObj.drag(onmove, onstart, onend);

 			$(svgObj[0]).on("mousedown",function(e){
				//console.log(e.which)
				switch(parseInt(e.which)){
					case 1:
						self.model.trigger("nodeMouse",{
								type:"leftDown"
								,e:e
								,model:self.model
								,role:"node"
							});
					break;
					case 3:					
						self.model.trigger("nodeMouse",{
							type:"rightDown"
							,e:e
							,model:self.model
							,role:"node"
						});
					break;
				}
 			})
 			.on("mouseup",function(e){
 				self.model.trigger("nodeMouse",{
 					type:"nodeMouseUp"
 					,e:e
 					,model:self.model
 					,role:"node"
 				});
 			})
 			$(svgObj[0]).on("dblclick",function(e){
 				self.model.trigger("nodeMouse",{
 					type:"nodeDblClick"
 					,e:e
 					,model:self.model
 					,role:"node"
 				});
 			});
   			
   			
   		this.listenTo(this.model,"change:strokeColor",this.changeStrokeColor);
 			
 			var x, y;			
			function onmove(dx, dy) {			
				var posX = x + dx;
				var posY = y + dy;
				
				//判断不能小于0
				posX < 0 ? posX = 0 : ""; 
				posY < 0 ? posY = 0 : "";

				this.attr({
					x: posX,
					y: posY
				});		
			
				self.model.set({
					locate: {
						x: posX,
						y: posY
					}
				});
				
//				self.$el.css({
//					top: self.model.get("locate").y,
//					left: self.model.get("locate").x
//				});
			}
			
			function onstart() {
				x = this.attr("x");
				y = this.attr("y");
				
				/*
				this.animate({
					"fill-opacity": 0.2
				}, 500);
				*/
			}
			
			function onend() {
				/*
				this.animate({
					"fill-opacity": 0
				}, 500);
				*/
			}
 		}
 		,changeLocate:function(model,locate){
 			var self = this;
   		
 			self.$el.css({
				top: self.model.get("locate").y,
				left: self.model.get("locate").x
			});
			
			
			this.model.get("rectSvg").attr(this.model.get("locate"));
			

		}
 		,nodeDone:function(){
// 			console.log("nodeDone---")
 		}
 		,changeStrokeColor:function(){
 			this.model.get("rectSvg").attr({
 				"stroke": this.model.get("strokeColor")
 			});
 			
 		}
 	
 });
	return Node;
});