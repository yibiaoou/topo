define([]
	,function(){
 	var NodeDataModel = Backbone.Model.extend({
 		defaults:{
 			locate:{
	 			x:0,
	 			y:0
	 		},
	 		tempType:1
 		}
 		
 	});
 	
 	return NodeDataModel;
})