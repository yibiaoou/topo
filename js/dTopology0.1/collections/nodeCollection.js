define([
tupuConfig.baseUrl+"/models/node.js"
	
]
	,function(NodeDataModel){	
	var NodeCollection = Backbone.Collection.extend({
  		initialize: function(){
  			
 			}
  		,model: function(attrs, options) {
  		 	return new NodeDataModel(attrs,options);
			}
  	});
  	
  	return NodeCollection;
 });