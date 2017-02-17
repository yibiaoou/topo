
define([
tupuConfig.getViewFile("nodeView"),
tupuConfig.getViewFile("lineView"),
tupuConfig.getViewFile("menu")
],
function(NodeView,LineView,Menu){	
	var App = Backbone.View.extend({		
		initialize:function(){
			var self = this;
			
			
			
			
			this.paper = Raphael(self.$el[0],500,500);	
			this.canvas = $(this.paper.canvas);
			this.canvas.attr({
				"data-type":"svg"
			});
			
			
			
			
			this.menu = new Menu({
				el:self.$el.find(".menu-wrap")
				,model:(new Backbone.Model())
				,configM:self.model
			});
			
			this.nodeView = new NodeView({
				el:self.$el
				,paper:self.paper
				,configM:self.model
			});
			
			
			this.lineView = new LineView({
				el:self.$el
				,paper:self.paper
				,nodeCollection:self.nodeView.viewCollection
				,configM:self.model
			});
			
			
			self.initEvents();
			
			var model = this.model;			
			if(model.get("url")){
				model.fetch({
					url:model.get("url")
					,success:function(newM,data){
						self.initData();
					}
					,error:function(){
						
					}
				})	
			}else{
				self.initData();
			}
					
		}
		,events:{
			"mousedown":"mouseEvent"
			,"mousemove":"mouseEvent"
			,"mouseup":"mouseEvent"
		}
		,mouseEvent:function(e){
			var self = this;

			//统一处理
			switch(e.type){
				case "mousemove":
					self.elMouseMove(e);
				break;
				case "mousedown":
					self.elMouseDown(e)
				break;
				case "mouseup":
					self.elMouseUp(e)
				break;
			}
		}
		,elMouseDown:function(e) {
			var self = this;

			if($(e.target).attr("data-type") == "svg"
					&& this.menu.model.get("openSwitch") == 1){
				this.menu.model.trigger("hideMenu");				
			}

			if(typeof self.tempLine == 'object'){
				//如果临时线存在
				self.tempLine.remove();
			}



		}
		,elMouseMove:function(e){

			var self = this;
			var connectM = this.model.get("connectCurrentModel");

			if(typeof connectM == 'object'){
				//连线时存在connectM则出现临时线
				var bbox = connectM.get("rectSvg").getBBox();
				var offset = self.$el.offset();

				var tempPath = [
					"M",
					(bbox.x + bbox.width/2),
					(bbox.y + bbox.height/2),
					"L",
					(e.pageX - offset.left + self.$el[0].scrollLeft),
					(e.pageY - offset.top + self.$el[0].scrollTop)
				].join(",");

				self.tempLine.attr({
					path:tempPath
					,stroke:"#41EAB5"
					,"stroke-width":2
				});

			}

		}
		,elMouseUp:function(e){

		}
		,initEvents:function(){
			var self = this;
			this.$el[0].oncontextmenu = function(){ return false; };			//禁止默认菜单

			
			this.on("removeLine",this.removeLine);
			this.on("removeGroup",this.removeGroup);
			this.on("removeNode",this.removeNode);
			this.on("modeSwitch",this.modeSwitch);
			this.on("conectTo",this.conectTo);		

			this.listenToOnce(this.model,"nodeRectDone",this.nodeRectDone);

			this.listenTo(this.model,"allDone",this.allDone);
			
			this.listenTo(this.nodeView.model,"nodeDone",this.nodeDone);
			this.listenTo(this.nodeView.model,"groupDone",this.groupDone);
			
			this.listenTo(this.nodeView.viewCollection,"change:locate",this.nodeLocateChange);
			this.listenTo(this.nodeView.viewCollection,"nodeMouse",this.nodeMouse);
			this.listenTo(this.nodeView.groupCollection,"groupMouse",this.groupMouse);
			
			
			this.listenTo(this.menu,"liClick",this.menuClick);
			
			this.listenTo(this.lineView.model,"lineDone",this.lineDone);
			this.listenTo(this.lineView.viewCollection,"lineMouse",this.lineMouse);
			
		}		
		,countSvgSize:function(){
			//加载完成后调整svg:{width,height}
			var self = this;
			var max = {
				width:(this.$el[0].scrollWidth)
				,height:(this.$el[0].scrollHeight)
			};

			return max;			
		}
		,menuClick:function(param){
			this.menuEvents(param);
		}
		,menuEvents:function(param){
			//重写
		}
		,initData:function(){
			var self = this,
					model = this.model;

			//设置状态
			this.model.set({
				nodeDone:false
				,lineDone:false
				,groupDone:false
			});

			//一开始默认清空
			self.nodeView.viewCollection.reset();
			self.lineView.viewCollection.reset();
			
			if(model.get("node")&&model.get("node").length == 0){
					self.nodeView.model.trigger("nodeDone")		
			}
			self.nodeView.viewCollection.add(model.get("node"));
			
		}
		,nodeDone:function(){
			var self = this;
			_.delay(function(){
				self.model.trigger("nodeRectDone");

				//用于在此触发
				self.trigger('nodeDone');
			});
			
			// console.log("nodeDone")
			this.model.set({
				nodeDone:true
			})
		}
		,nodeRectDone:function(){
			var self = this,
					model = this.model;
			

			if(model.get("line")&&model.get("line").length == 0){				
				self.lineView.model.trigger("lineDone");
			}else{			
				_.delay(function(){
					self.lineView.viewCollection.add(model.get("line"));
				},0)	
			}
			
			if(this.model.get("mode") == "group"){
				_.delay(function(){
					this.nodeView.model.trigger("initGroup",this.model.get("group"));
				},0)
			}
		}
		,nodeLocateChange:function(nodeM,locate){			
			var self = this;
			if(!self.lineView){
				return;
			}
			
			/* 设置svg widht&height */
			var maxSize = this.countSvgSize();
			var canvasSize = {
				width:(this.canvas[0].clientWidth)
				,height:(this.canvas[0].clientHeight)
			};
			var elSize = {
				width:this.$el[0].clientWidth
				,height:this.$el[0].clientHeight
			}
// console.log(canvasSize)
// console.log(maxSize)

			if(maxSize.width > elSize.width || maxSize.height > elSize.height){
				if(maxSize.width > canvasSize.width + 10 || maxSize.height > canvasSize.height + 10){
					this.canvas.css(maxSize);
				}
			}
			/* 设置svg widht&height end */

			//此方法更新线的位置
			_.each(self.lineView.viewCollection.models,function(lineM){
				var current = lineM.get("current"),
						target = lineM.get("target"),
						
						s = self.nodeView.viewCollection.get(current).get("locate"),
						e = self.nodeView.viewCollection.get(target).get("locate");
						
				if(current == nodeM.get("id") || target == nodeM.get("id")){					
					lineM.set({
						path:{
							start:s
							,end:e
						}
					});
				}				
			});			
		}
		,nodeMouse:function(param){
			//node 鼠标事件
			var self = this;
			switch(param.type){
				case "leftDown":
				//console.log("left")
				//
				self.trigger("nodeLeftDown",param);		
				break;
				case "rightDown":
				self.trigger("nodeRightDown",param);
				if(self.model.get("menu").node.length > 0){
					self.menu.model.trigger("showMenu",param);
				}		
//				this.model.set({
//					menuState:true
//				});
				break;
				case "nodeMouseUp":
//				self.trigger("nodeMouseUp",param);
				self.conectEvents(param);
				break;				
				case "nodeDblClick":
					self.nodeDblClick(param)
//				console.log("a")
//				self.model.trigger("nodeDblClick",param);
//				debugger
				break;
			}
			
		}		
		,nodeDblClick:function(param){
			// console['log']("nodedbl")
		}
		,groupMouse:function(o){
			//group的鼠标事件
			var self = this;
			switch(o.type){
				case "leftDown":
//				console.log("groupL")
				break;
				case "rightDown":
//					alert("202")
					if(self.model.get("menu").group.length > 0){
						self.menu.model.trigger("showMenu",o);
					}
//					this.model.set({
//						menuState:true
//					});
						
				break;
				case "up":
//				console.log("groupU")
				break;
			}
		}
		,groupDone:function(){
			
			this.model.set({
				groupDone:true
			});
			
			this.model.trigger("allDone")
//			console.log("groupDone")
//			this.initLine();
		}		
		,lineMouse:function(o){
			var self = this;
			//line的鼠标事件
			switch(o.type){
				case "leftDown":
				
//				console.log("lineL")
				break;
				case "rightDown":
					if(self.model.get("menu").line.length > 0){
						self.menu.model.trigger("showMenu",o);
					}
//					this.model.set({
//						menuState:true
//					});
//				console.log("lineR")
				break;
				case "up":
				
//				console.log("lineU")
				break;
			}
			
			
//			console.log(o)
		}
		,lineDone:function(){
			
			this.model.set({
				lineDone:true
			});

			this.model.trigger("allDone");
		}
		,allDone:function(){
			var self = this,
					model = this.model,
					lineDone = model.get("lineDone")
					groupDone = model.get("groupDone");
					
			this.canvas.css({width:(self.$el.width()-20),height:(self.$el.height()-20)});
			if(this.model.get("mode") == "group"){
				if(!(lineDone&&groupDone)){
					return
				}
			}else if(this.model.get("mode") == "node"){
				if(!lineDone){
					return
				}
			}
			
			//完成加载后
			var maxSize = this.countSvgSize();
			var canvasSize = {
				width:this.$el[0].clientWidth + 20
				,height:this.$el[0].clientHeight + 20
			};

// console.log("maxSizeW",maxSize.width,"maxSizeH",maxSize.height)
// console.log("canvasSizeW",canvasSize.width,"canvasSizeH",canvasSize.height)
			if(maxSize.width > canvasSize.width || maxSize.height > canvasSize.height){
				this.canvas.css(maxSize);
			}

			/*  */
			// this.$el.scrollTop(0);
			// this.$el.scrollLeft(0);
			
			//测试工具栏
			this.$el.parent().find(".tool-wrap").find("button").click(function(e){
				var $this = $(this);
				var type = $this.attr("data-type");
				
				//把更改事件触发对象,方便在外部实现事件监听
				self.messageOut({eventType:"toolBtnClick",e:e,type:type});				
			});
			
			
		}
		,messageOut:function(param){
			//把更改事件触发对象,方便在外部实现事件监听
			this.trigger(param.eventType,param);		
		}
		,removeLine:function(model){
			//通过remove model触发remove事件，实现svg删除
			this.lineView.viewCollection.remove(model)
		}
		,removeNode:function(nModel){
			
			//node 模式
			if(this.model.get("mode") == "node"){
				this.nodeView.viewCollection.remove(nModel);			
				var removeLines = [],
						mid = nModel.get("id");
											
				_.each(this.lineView.viewCollection.models,function(lModel){	
					if(lModel.get("current") == mid || lModel.get("target") == mid){
						removeLines.push(lModel);
					}				
				});
				
				removeLines = _.uniq(removeLines);				//去重复							
				this.lineView.viewCollection.remove(removeLines);				
				return;
			}		
			
			//group 模式
			
			//获取对应的group model			
			var groupCid = nModel.get("groupCid"),
					groupM = this.nodeView.groupCollection.get(groupCid)
					
			//当group的nodesM 大于1 时移除node,否则移除group
			if(groupM.get("nodesM").length > 1){
				var nodesM = _.without(groupM.get("nodesM"),nModel);
				groupM.set({
					nodesM:nodesM
				});
				
				this.nodeView.viewCollection.remove(nModel);			
				var removeLines = [],
						mid = nModel.get("id");
											
				_.each(this.lineView.viewCollection.models,function(lModel){	
					if(lModel.get("current") == mid || lModel.get("target") == mid){
						removeLines.push(lModel);
					}				
				});
				
				removeLines = _.uniq(removeLines);				//去重复							
				this.lineView.viewCollection.remove(removeLines);				
			}else{				
				this.removeGroup(groupM)
			}
			
		}
		,removeGroup:function(model){
			//通过model删除svg
			this.nodeView.groupCollection.remove(model);
			//通过model删除node html
			this.nodeView.viewCollection.remove(model.get("nodesM"))
			
			//获取所有与node 相连的线实现线的删除
			var ids = _.pluck(model.get("nodesM"),"id")
			var removeLines = [];
			
			_.each(this.lineView.viewCollection.models,function(lModel){				
				_.each(ids,function(id){					
					if(lModel.get("current") == id || lModel.get("target") == id){
						removeLines.push(lModel);
					}
				})				
			});

			removeLines = _.uniq(removeLines);				//去重复
			this.lineView.viewCollection.remove(removeLines);			
		}
		,modeSwitch:function(param){
			//node 与	group	模式切换
			switch(parseInt(param.type)){
				case 0:				
					_.each(this.nodeView.groupCollection.models,function(model){
						model.get("rectSvg").show();						
						model.trigger("updateLocate",{resize:true});						
					});
				break;
				case 1:				
					//通过隐藏group svg 使node暴露出来实现node的操作
					_.each(this.nodeView.groupCollection.models,function(model){
						model.get("rectSvg").hide();
					});	
				break;
			}
		}
		,conectTo:function(model){
			/*
			 * 连线方法通过设置参数,
			 * 在mousemove与mousedown
			 * 中判断实现连线逻辑
			 *
			 */

			 var self = this;

			 self.model.set({
			 	connectCurrentModel:model
			 });

			 //创建临时线
			 self.tempLine = self.paper.path();

		}
		,conectEvents:function(param){			
			var cM = this.model.get("connectCurrentModel");
			if(typeof cM != 'object'){				
				return;
			}
			
			var tM = param.model
			var t = tM.get("id")
			var c = cM.get("id")

			if(t == c){
				//不能自己连自己
				return;
			}

			var newLine = {
				current:c
				,target:t
				,id:c + "_" + t
				,showData:{
					name:"sghsiodhjois"
					,colorStatus:2
					,targetName:""
					,currentName:""
				}
			};
			
			this.lineView.viewCollection.add(newLine);			
			this.model.unset("connectCurrentModel",{slient:true});
		}
		,getSaveData:function(){
			
			var o = {
				node:[],
				line:[],
				group:[]
			}
			_.each(this.nodeView.viewCollection.models,function(nModel){
				var n = {
					id:nModel.get("id")
					,locate:nModel.get("locate")
					,tempType:nModel.get("tempType")
					,showData:nModel.get("showData")
				};
				
				o.node.push(n);
				//console.log(nModel.toJSON())
			});
			
			_.each(this.lineView.viewCollection.models,function(lModel){
				var l = {
					id:lModel.get("id")
					,current:lModel.get("current")
					,target:lModel.get("target")
					,showData:lModel.get("showData")
				};
				
				o.line.push(l)
				
			});
			

			_.each(this.nodeView.groupCollection.models,function(gModel){
				var members = _.pluck(gModel.get("nodesM"),"id");
				var g = {
					id:gModel.get("id")
					,locate:gModel.get("locate")
					,members:members
				};
				
				o.group.push(g);
			})
			
			return o;
		}
		
	});	
	return App;
})
