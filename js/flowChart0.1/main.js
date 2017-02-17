
requirejs.config({
	baseUrl : "/topo/js",
	waitSeconds: 0,	//永远不超时
	paths : {
		"jquery" : "libs/jquery-1.11.0",
		"underscore" : "libs/underscore-min",
		"bootstrap":"libs/bootstarp/js/bootstrap.min",
		"raphael" : "libs/raphael-min",
		"backbone" : "libs/backBone/backboneExpand",
		"jqueryui":"libs/jqueryui/jquery-ui.min",
		"TupuApp":"dTopology0.1/tupuApp"
		,"tupuProxy":"flowChart0.1/tupuProxy"
	},
	shim : {
		'TupuApp':{
			deps:['backbone','jquery','underscore','raphael','css!/topo/js/dTopology0.1/css/tupu.css']
		},
		'backbone' : {
			deps : ['underscore', 'jquery', 'libs/backBone/backbone-min'],
			exports : 'backbone'
		},
		'jqueryui':{
			deps:['jquery','css!libs/jqueryui/jquery-ui.min.css']
		},
		'bootstrap' : {
			deps : [
			'css!libs/bootstarp/css/bootstrap.min'
			,'css!libs/bootstarp/css/bootstrap-theme'
			,'jquery'],
			exports : 'bootstrap'
		}
	},
	map : {
		'*' : {
			'css' : 'libs/require/css',
			'text' : 'libs/require/text'
		}
	}
	,packages:[{
		name:"tupuDeps"
		,location:"/topo/js/dTopology0.1"
		,main:"./tupuProxy.js"
	}]
});


require(['/topo/js/dTopology0.1/configs.js'],function(Config){
	window.tupuConfig = Config;
	tupuConfig.setBaseUrl("/topo/js/dTopology0.1")
	tupuConfig.overUrl = "/topo/js/flowChart0.1/flowrPart";
	tupuConfig.replaceFiles({
		temps:[{
			name:"node",
			tempType:2,
			url:"text!"+tupuConfig.overUrl+"/templates/node.html"
		},{
			name:"node",
			tempType:1,
			url:"text!"+tupuConfig.overUrl+"/templates/node.html"
		},{
			name:"node",
			tempType:3,
			url:"text!"+tupuConfig.overUrl+"/templates/node.html"
		}],
		views:[{
			name:"line",
			url:tupuConfig.overUrl+"/line.js"
		},
		// {
		// 	name:"node",
		// 	url:tupuConfig.overUrl+"/node1.js"
		// }
		{
			name:"node",
			url:tupuConfig.overUrl+"/node.js"
		}
		]
	});
	

var serverData = {"node":[{"id":"start","locate":{"x":319,"y":61},"tempType":2,"showData":{"role":0,"name":"开始","nodeColor":5}},{"id":"step_22_1","locate":{"x":333,"y":148},"tempType":1,"showData":{"role":3,"name":"步骤1"}},{"id":"step_23_2","locate":{"x":236,"y":283},"tempType":1,"showData":{"role":3,"name":"步骤2"}},{"id":"end","locate":{"x":487,"y":352},"tempType":2,"showData":{"role":2,"name":"结束","nodeColor":2}}],"line":[{"id":"start_step_22_1","current":"start","target":"step_22_1","showData":{"name":"","colorStatus":1,"targetName":"","currentName":""}},{"id":"step_22_1_step_23_2","current":"step_22_1","target":"step_23_2","showData":{"name":"","colorStatus":1,"targetName":"","currentName":""}},{"id":"step_23_2_end","current":"step_23_2","target":"end","showData":{"name":"","colorStatus":1,"targetName":"","currentName":""}}]}
				
	
	require(['tupuDeps'],function(TupuApp){
		var tupu = new TupuApp({
			el:$("#tupu-wrap"),
			model:(new Backbone.Model({
				// url:"/bootstrapDUI/ViewTest/js/flowChart0.1/datas/data3.json"
//				url:"/bootstrapDUI/ViewTest/js/flowChart0.1/datas/data1.json"

node:serverData.node
,line:serverData.line
//,group:[]
// ,node:serverData.node
// ,line:serverData.line
// ,group:[]

				// ,mode:"group"					//模式选择"group","node"，
				,mode:"node"					//模式选择"group","node"，
				,menu:{group:[{id:1,name:"编辑组",icon:"abc bbc"},{id:2,name:"删除组",icon:"abc bbc"}],line:[{id:1,name:"编辑线",icon:"abc bbc"},{id:2,name:"删除线",icon:"abc bbc"}],node:[{id:1,name:"连接到",icon:"bbc ddc"},{id:2,name:"删除节点",icon:"bbc ddc"}]}
			}))
		});
		
		/*
		var a = 1;
		$("#addNode").on("click",function(){
			tupu.nodeView.viewCollection.add({
				"id":a,
				"locate":{
					"x":a*100,
					"y":100
					},
				"tempType":2,
				"showData":{
					"name":"new Node"
				}
			})		
			a++;
		});
		$("#addBrance").on("click",function(){
			tupu.nodeView.viewCollection.add({
				"id":a,
				"locate":{
					"x":a*100,
					"y":100
					},
				"tempType":2,
				"showData":{
					"name":"new Brance",
					"role":1
				}
			})
			a++;
		});
		$("#resetData").on("click",function(){

			tupu.nodeView.viewCollection.reset();
			tupu.lineView.viewCollection.reset();
			
			tupu.nodeView.viewCollection.add(tupu.model.get("node"));
			tupu.lineView.viewCollection.reset(tupu.model.get("line"));


		})
		*/
		tupu.on("toolBtnClick",function(param){		
			switch(param.type){
				case "node":
					this.trigger("modeSwitch",{type:1})
				break;
				case "group":
					this.trigger("modeSwitch",{type:0})
				break;
				case "confirm":

				dataValidate();				
					// var data = this.getSaveData();
					// console.log(JSON.stringify(data))
				//console.log(param)
				break;
			}
		});

		function dataValidate(){
			var nodeViews = tupu.nodeView.viewCollection,
					lineViews = tupu.lineView.viewCollection


			// console.log(nodeViews)
			// console.log(lineViews)
			_.each(nodeViews.models,function(model){
				console.log(model.toJSON())
			})


		}




		
		tupu.conectEvents = function(o){
				// 	//连线回调
			var cM = this.model.get("connectCurrentModel");
			if(typeof cM != 'object'){				
				return;
			}
			
			var tM = o.model
			var t = tM.get("id")
			var c = cM.get("id")
			var newLine = {
				current:c
				,target:t
				,id:c + "_" + t
				,showData:{
					name:"sghsiodhjois"
					,colorStatus:2
					,targetName:""
					,currentName:""
				}
			};
			
			this.lineView.viewCollection.add(newLine);			
			this.model.unset("connectCurrentModel",{slient:true});
		};

		
		tupu.menuEvents = function(param){
			switch(param.role){
				case "line":
				lineClick(param);
				break;
				case "group":
				groupClick(param);
				break;
				case "node":
				nodeClick(param)
				break;
			}
		}

		function nodeClick(o){
			switch(parseInt(o.id)){
				case 1:					
				tupu.trigger("conectTo",o.fireModel);		
				
				break;
				case 2:
				tupu.trigger("removeNode",o.fireModel)
				break;				
			}
		}
		
		
		function groupClick(o){
			switch(parseInt(o.id)){
				case 1:
				//逻辑未定义
				
				break;
				case 2:
				tupu.trigger("removeGroup",o.fireModel);
				break;
				case 3:
				//逻辑未定义
				break;
			}
		}
		
		function lineClick(o){
			switch(parseInt(o.id)){
				case 1:
				//逻辑未定义
				console.log("lineEidty")
				break;
				case 2:				
				tupu.trigger("removeLine",o.fireModel);				
				break;				
			}
		}


	})
});

