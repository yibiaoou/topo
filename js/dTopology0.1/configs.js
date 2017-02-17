define(['backbone'],function(Backbone){	
	var configs = function(){
		
		this.setBaseUrl = function(baseUrl){
			this.baseUrl = baseUrl;
			
			this.temps = [{
				name:"node"
				,tempType:0
				,url:"text!"+baseUrl+"/templates/node.html"
			},{
				name:"menu"
				,tempType:0
				,url:"text!"+baseUrl+"/templates/menu.html"
			}]
			
			this.baseViews = [{
				name:"line"
				,url:baseUrl+"/views/line.js"
			},{
				name:"lineView"
				,url:baseUrl+"/views/lineView.js"
			},{
				name:"node"
				,url:baseUrl+"/views/node.js"
			},{
				name:"nodeView"
				,url:baseUrl+"/views/nodeView.js"
			},{
				name:"group"
				,url:baseUrl+"/views/group.js"
			},{
				name:"menu",
				url:baseUrl+"/views/menu.js"
			}];
			
//			this.views = [];
			
		};
		
		this.replaceFiles = function(param){
			var self = this;
			_.each(param.temps,function(t){			
				
				var o = _.findWhere(self.temps,{id:t.id,name:t.name});				
				if(typeof o == 'object'){
					self.temps = _.without(self.temps,o);					
				}
				
				self.temps.push(t)
			});
			
			//根据配置文件与基础文件比较，如果没有配置的基类文件则默认配置进去
			self.views = param.views;			
			_.each(self.baseViews,function(bv){				
				var o = _.findWhere(self.views,{name:bv.name});
				if(typeof o != 'object'){
					self.views.push(bv)
				}				
			});
			
		};
		
		
		this.getTempFile = function(param){
			var self = this;	
			var o = _.findWhere(self.temps,{tempType:parseInt(param.tempType),name:param.name});
//console.log(param)
//console.log(o)
			if(typeof o == 'object'){
				return o.url;
			}else{
				throw new Error("没有此html模板");
			}			
		};
		
		//用于主干部分获取js文件
		this.getViewFile = function(name){
			var self = this;			
			var o = _.findWhere(self.views,{name:name});		
			if(typeof o == 'object'){
				return o.url;
			}else{
				throw new Error("没有此js模板");
			}
		};
		
		//用于继承时
		this.getBaseView = function(name){
			var self = this;			
			var o = _.findWhere(self.baseViews,{name:name});
			
			if(typeof o == 'object'){
				return o.url;
			}else{
				throw new Error("没有此js模板");
			}
		}
		
	};
	
	return new configs();	
});