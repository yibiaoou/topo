define([]
	,function(){
 	var GroupDataModel = Backbone.Model.extend({
 		defaults:{
 			locate:{
	 			x:0,
	 			y:0
	 		}	
 		}
 		
 	});
 	
 	return GroupDataModel;
})