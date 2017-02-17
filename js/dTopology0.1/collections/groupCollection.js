define([
tupuConfig.baseUrl+"/models/group.js"
]
	,function(GroupDataModel){	
	var GroupCollection = Backbone.Collection.extend({
  		initialize: function(){
  			
 			}
  		,model: function(attrs, options) {
  		 	return new GroupDataModel(attrs,options);
			}
  	});
  	
  	return GroupCollection;
 });