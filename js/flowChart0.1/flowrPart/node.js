define([tupuConfig.getBaseView("node")],function(Node){
	
	var node = Node.extend({
		
		nodeDone:function(){
			this.tSuper.nodeDone.apply(this,arguments);
			
			
			this.setNodeColor();
			
		}
		,setNodeColor:function(){
			
			_.each(this.viewCollection.models,function(model){
//				console.log(model)
				switch(model.get("showData").nodeColor){
				case 2:
					model.get("jqNode").css({
						background:"#D0321C",
						borderRadius:"50%"
					})
//					console.log(model.toJSON())
//					console.log("2")
					break;
				case 5:
					model.get("jqNode").css({
						background:"#1FC786",
						borderRadius:"50%"
					})
					break;
				}
			})
		}
		
		
		
		
	});
	
	return node;
})