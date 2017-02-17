define([tupuConfig.getBaseView("node")],function(Node){
	
	var node = Node.extend({
		initialize:function(){
			Node.prototype.initialize.apply(this,arguments);
			console.log(123456);
			var self = this;

			// $(".tupu").on("mousedown",".node",function(e){

			// 	switch(parseInt(e.which)){
			// 		case 1:
			// 			self.model.trigger("nodeMouse",{
			// 					type:"leftDown"
			// 					,e:e
			// 					,model:self.model
			// 					,role:"node"
			// 				});
			// 		break;
			// 		case 3:					
			// 			self.model.trigger("nodeMouse",{
			// 				type:"rightDown"
			// 				,e:e
			// 				,model:self.model
			// 				,role:"node"
			// 			});
			// 		break;
			// 	}
			// 	console.log("mousedown");

			// })
			// .on("mouseup",".node",function(e){
			// 	self.model.trigger("nodeMouse",{
			// 		type:"nodeMouseUp"
			// 		,e:e
			// 		,model:self.model
			// 		,role:"node"
			// 	});
			// 	console.log("mouseup");
			// })
			// .on("dblclick",".node",function(e){
			// 	self.model.trigger("nodeMouse",{
			// 		type:"nodeDblClick"
			// 		,e:e
			// 		,model:self.model
			// 		,role:"node"
			// 	});
			// 	console.log("dblclick");
			// })

		}
		,nodeDone:function(){
			this.tSuper.nodeDone.apply(this,arguments);			

			// console.log(123);
		}
		,rectSvgEvents:function(){
			return;
		}
		
	});
	
	return node;
})