define([
	
tupuConfig.baseUrl+"/models/line.js"

]
	,function(LineDataModel){
	var LineCollection =  Backbone.Collection.extend({
  		initialize: function(){
  			
	 		}
	  	,model: function(attrs, options) {
	  		 	return new LineDataModel(attrs,options);
			}
  	});
  	
  	return LineCollection;
});