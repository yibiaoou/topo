define([],function(){
	var line = Backbone.View.extend({
		initialize:function(param){
			var self = this;
			this.paper = param.paper;
			this.configM = param.configM;
			this.nodeCollection = param.nodeCollection;

			this.line = this.paper.path();
			this.titleMiddle = this.paper.text();
			
			this.model.set({
				textSvg:[self.titleMiddle],
				// textSvg:[self.titleMiddle,self.titleCurrent,self.titleTarget],
				lineSvg:self.line						//保存line对象
				,lineStyle:1								//设置line样式,是否带箭头
				,textColor:"#333"						//先写死文字颜色
			});		

			this.initEvents();

			// 由于svg进行dom操作，可能没有完成对model的赋值，增加延时保证赋值成功
			_.delay(function(){
				self.drawLine();
			}, 0)

		}
		,initEvents:function(){
			this.lineSvgEvents();
			this.setColor();
			
			this.listenTo(this.model,"change:path",this.updatePath);
			this.listenTo(this.model,"updateLineColor",this.setColor);
			this.listenTo(this.model,"updateTitle",this.updateTitle);
			
		}
		,setColor:function(){			
			var colors = [{										//设置颜色
					type:1
					,value:"#337ab7"
				},{
					type:2
					,value:"#5cb85c"
				},{
					type:3
					,value:"#5bc0de"
				},{
					type:4
					,value:"#f0ad4e"
				},{
					type:5
					,value:"#d9534f"
				}]
			
			var colorStatus = parseInt(this.model.get("showData").colorStatus);
			var lineColor = _.findWhere(colors,{type:colorStatus});
			this.model.set({
				lineColor:lineColor.value
			});
			
			
			this.line.attr({
				stroke:this.model.get("lineColor")
			});
			
		}
		,lineSvgEvents:function(){
			var self = this;
			
			this.line
			.hover(function(e){
				this.attr({"stroke-width":5});				
			},function(e){
				this.attr({"stroke-width":2});
			})
			
			//由于raphael绑定事件e在IE无法传递，使用jquery绑定鼠标事件
			$(this.line[0]).on("mousedown",function(e){
				switch(parseInt(e.which)){
					case 1:
						self.model.trigger("lineMouse",{
							e:e
							,type:"leftDown"
							,role:"line"
							,model:self.model
						});
					break;
					case 3:
						self.model.trigger("lineMouse",{
							e:e
							,type:"rightDown"
							,role:"line"
							,model:self.model
						});
					break;
				}
			})
			.on("mouseup",function(e){
				self.model.trigger("lineMouse",{
					e:e
					,type:"up"
					,role:"line"
					,model:self.model
				});
			});

		}
		,updatePath:function(model,path){
			var nodeCM = this.nodeCollection.get(model.get("current"));
			var nodeTM = this.nodeCollection.get(model.get("target"));
			
			path = this.changeAnchor(nodeCM,nodeTM);
			var pos = path;
			path = this.setPath(path,nodeCM,nodeTM);
			
			this.line.attr({
				path:path
			});
			
			var p = this.countTitlePos(pos)
			
			this.titleMiddle.attr({
				x:p.middle.x,
				y:p.middle.y
			});
			
		}
		,setPath:function(path,nodeCM,nodeTM){
			//设置线的样式
			var lineStyle = this.model.get("lineStyle"),			
					startX = path.start.x,
					startY = path.start.y,
					endX = path.end.x,
					endY = path.end.y
								
			switch(lineStyle){
				case 0:			
					//不带箭头	
					return ["M",startX,startY,"L",endX,endY].join(",");
				break;
				case 1:
					//带箭头
					var size = 8;
					var a = 20;
					var angle = Raphael.angle(startX,startY,endX,endY);
					var a45 = Raphael.rad(angle - a);
					var a45m = Raphael.rad(angle + a);
					
					var x2a = endX + Math.cos(a45) * size;
          var y2a = endY + Math.sin(a45) * size;
          var x2b = endX + Math.cos(a45m) * size;
          var y2b = endY + Math.sin(a45m) * size;
          
				return ["M", startX, startY, "L", endX, endY, "L", x2b, y2b, "M", endX, endY, "L", x2a, y2a].join(",");
				break;
				case 2:
				// 设置中心连接
				// console.log();
				var bbc = nodeCM.get("rectSvg").getBBox();
				var bbt = nodeTM.get("rectSvg").getBBox();
				return ["M",(bbc.x+bbc.width/2),(bbc.y+bbc.height/2),"L",(bbt.x+bbt.width/2),(bbt.y+bbt.height/2)];
				break;
			}
			
			
		}
		,changeAnchor:function(nodeCM,nodeTM){
			//通过获取两点间的最小距离实现，动态修改Anchor
			var bbc = nodeCM.get("rectSvg").getBBox();
			var bbt = nodeTM.get("rectSvg").getBBox();
						
			var res = [];
			var bbc1 = [
							{x:bbc.x + bbc.width/2, y:bbc.y - 1}								//上中
							,{x:bbc.x + bbc.width + 1, y:bbc.y + bbc.height/2}	//右中
							,{x:bbc.x + bbc.width/2, y:bbc.y + bbc.height + 1}	//下中
							,{x:bbc.x - 1, y:bbc.y + bbc.height/2}							//左中							
			];
			var bbt1 = [
							{x:bbt.x + bbt.width/2, y:bbt.y - 1}
							,{x:bbt.x + bbt.width + 1, y:bbt.y + bbt.height/2}
							,{x:bbt.x + bbt.width/2, y:bbt.y + bbt.height + 1}
							,{x:bbt.x - 1, y:bbt.y + bbt.height/2}
			];
						
			_.each(bbc1,function(bc,bcN){
				_.each(bbt1,function(bt,btN){					
					var len = Math.sqrt(Math.pow((bt.x - bc.x),2) + Math.pow((bt.y - bc.y),2));
					res.push({
						"len":len
						,"bbc1":bcN
						,"bbt1":btN
					});					
				})
			});			
			var $min = _.min(res,"len");		

			return {
				start:bbc1[$min.bbc1]
				,end:bbt1[$min.bbt1]
			}
		}
		,drawLine:function(){
			var model = this.model;		
			var nodeCM = this.nodeCollection.get(model.get("current"));
			var nodeTM = this.nodeCollection.get(model.get("target"));
			var self = this;

			_.delay(function(){
				var path = self.changeAnchor(nodeCM,nodeTM);
				var pos = path;
				path = self.setPath(path,nodeCM,nodeTM);
				
				var lPath = self.line.attr({
					path:path
					,"stroke-width":2
				});

				//画标题
				self.drawTitle(pos);
			},0);
		}
		,countTitlePos:function(pos){
			var startX = pos.start.x,
					startY = pos.start.y,
					endX = pos.end.x,
					endY = pos.end.y
			
			var angle = Raphael.angle(startX,startY,endX,endY);
			var rad = Raphael.rad(angle);
			var d = Math.sqrt(Math.pow(endX - startX,2)+Math.pow(endY - startY,2))
			
			var current = {
				x:(startX - d*Math.cos(rad)*.1)
				,y:(startY - d*Math.sin(rad)*.1 - 10)
				,angle:angle
				,length:d
			};
			var target = {
				x:(startX - d*Math.cos(rad)*.9)
				,y:(startY - d*Math.sin(rad)*.9 - 10)
				,angle:angle
				,length:d
			};
			var middle = {
				x:(startX - d*Math.cos(rad)*.5)
				,y:(startY - d*Math.sin(rad)*.5 - 10)
				,angle:angle
				,length:d
			}
			
			return {
				current:current
				,middle:middle
				,target:target
			}
		}
		,drawTitle:function(pos){
			//console.log(this.model.toJSON())
			var model = this.model,
					showData = model.get("showData"),					
					name = showData.name?showData.name:" ",
					currentName = showData.currentName?showData.currentName:" ",
					targetName = showData.targetName?showData.targetName:" ",
					p = this.countTitlePos(pos);

			this.titleMiddle.attr({
				text:name
				,x:p.middle.x
				,y:p.middle.y
				,stroke:model.get("textColor")
			});
			
		}
		,updateTitle:function(){
			
		}
	});	
	return line;
})
