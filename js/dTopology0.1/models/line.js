define([]
	,function(){
		 	
 	var LineDataModel = Backbone.Model.extend({
 		start:{
 			x:0,
 			y:0
 		}
 		,end:{
 			x:0,
 			y:0
 		}
 	});
 	
 	return LineDataModel;
})