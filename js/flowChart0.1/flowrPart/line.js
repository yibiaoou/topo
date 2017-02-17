define([tupuConfig.getBaseView("line")],function(Line){
	
	var line = Line.extend({
		initialize:function(param){
			var self = this;
			this.paper = param.paper;
			this.configM = param.configM;
			this.nodeCollection = param.nodeCollection;
			var svgRect0 = this.nodeCollection.at(0).get("rectSvg");
//			this.paper.path()
//			console.log()

			this.line = this.paper.path().insertBefore(svgRect0);
			this.titleMiddle = this.paper.text();
//			this.titleCurrent = this.paper.text();
//			this.titleTarget = this.paper.text();
			
			this.model.set({
				textSvg:[self.titleMiddle],
				lineSvg:self.line						//保存line对象
				,lineStyle:2								//设置line样式,是否带箭头
				,textColor:"#333"						//先写死文字颜色
			});		

			this.initEvents();

			// 由于svg进行dom操作，可能没有完成对model的赋值，增加延时保证赋值成功
			_.delay(function(){
				self.drawLine();
			}, 0);

//			this.diamond = param.paper.path();
//			this.diamond.attr({
//				path:["M",20,10,"L",40,20,"L",20,30,"L",0,20,"L",20,10].join(",")
//			});

		}
//		,drawLine:function(){
//			var model = this.model;		
//			var nodeCM = this.nodeCollection.get(model.get("current"));
//			var nodeTM = this.nodeCollection.get(model.get("target"));
//			path = this.changeAnchor(nodeCM,nodeTM);
//			var pos = path;
//			path = this.setPath(path);
//			var lPath = this.line.attr({
//				path:path
//				,"stroke-dasharray":"--"	//画虚线
//				,"stroke-width":2
//			});
//			this.drawTitle(pos);
//		}
	});
	
	return line;
})