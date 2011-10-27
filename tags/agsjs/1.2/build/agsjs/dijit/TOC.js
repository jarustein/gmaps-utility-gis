dojo.provide("agsjs.dijit.TOC");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("dijit.form.Slider");dojo.require("dojo.fx");(function(){var a=dojo.create("link",{type:"text/css",rel:"stylesheet",href:dojo.moduleUrl("agsjs.dijit","css/TOC.css")});dojo.doc.getElementsByTagName("head")[0].appendChild(a)})();
dojo.declare("agsjs.dijit._TOCNode",[dijit._Widget,dijit._Templated],{templateString:'<div class="agsTOCNode"><div data-dojo-attach-point="rowNode" data-dojo-attach-event="onclick:_onClick"><span data-dojo-attach-point="contentNode" class="agsTOCContent"><img src="${_blankGif}" alt="" data-dojo-attach-point="iconNode" /><input type="checkbox" data-dojo-attach-point="checkNode"/><span data-dojo-attach-point="labelNode"></span></span></div><div data-dojo-attach-point="containerNode" style="display: none;"> </div></div>',service:null,
layer:null,legend:null,serviceTOC:null,constructor:function(a){dojo.mixin(this,a)},postCreate:function(){dojo.style(this.rowNode,"paddingLeft",""+this.serviceTOC.toc.indentSize*this.serviceTOC._currentIndent+"px");var a=null,b=this.iconNode.src;if(this.legend){a=this.legend;this._createLegendNode(this.legend)}else if(this.layer){a=this.layer;this._createLayerNode(this.layer);this._adjustToState()}else if(this.service){a=this.service;this._createServiceNode(this.service)}if(this.containerNode)this.toggler=
new dojo.fx.Toggler({node:this.containerNode,showFunc:dojo.fx.wipeIn,hideFunc:dojo.fx.wipeOut});if(this.checkNode)this.checkNode.checked=a.visible;var c=a.visible;if(a.collapsed)c=false;if(this.iconNode.src==b){dojo.addClass(this.iconNode,"dijitTreeExpando");dojo.addClass(this.iconNode,c?"dijitTreeExpandoOpened":"dijitTreeExpandoClosed")}dojo.style(this.containerNode,"display",c?"block":"none");this.serviceTOC.toc.style=="inline"&&dojo.place(this.iconNode,this.checkNode,"after")},_createServiceNode:function(a){dojo.addClass(this.rowNode,
"agsTOCService");dojo.addClass(this.labelNode,"agsTOCServiceLabel");var b=this.serviceTOC.info.title||a.id;a.collapsed=this.serviceTOC.info.collapsed;if(this.serviceTOC.info.slider){this.sliderNode=dojo.create("div",{"class":"agsTOCSlider"},this.rowNode,"last");this.slider=new dijit.form.HorizontalSlider({showButtons:false,value:a.opacity*100,intermediateChanges:true,tooltip:"adjust transparency",onChange:function(c){a.setOpacity(c/100)},layoutAlign:"right"});this.slider.placeAt(this.sliderNode)}this.serviceTOC.info.noLayers?
dojo.style(this.iconNode,"visibility","hidden"):this._createChildrenNodes(a.tocInfos,"layer");this.labelNode.innerHTML=b},_createLayerNode:function(a){this.labelNode.innerHTML=a.name;if(a.subLayerInfos){dojo.destroy(this.checkNode);dojo.addClass(this.rowNode,"agsTOCGroup");dojo.addClass(this.labelNode,"agsTOCGroupLabel");if(this.serviceTOC.info.showGroupCount)this.labelNode.innerHTML=a.name+" ("+a.subLayerInfos.length+")";this._createChildrenNodes(a.subLayerInfos,"layer")}else{dojo.addClass(this.rowNode,
"agsTOCLayer");dojo.addClass(this.labelNode,"agsTOCLayerLabel");if(agsjs.layers&&this.service instanceof agsjs.layers.GoogleMapsLayer){var b="",c=this.service.getGMap();if(c)b=c.getMapTypeId();c=a.name.toLowerCase();this.radioNode=dojo.create("input",{type:"radio",name:"gmaps"+this.service.id,value:c,checked:b==c},this.checkNode,"replace")}else this.service.tileInfo&&dojo.destroy(this.checkNode);if(a.legends&&!this.serviceTOC.info.noLegend)if(this.serviceTOC.toc.style=="inline"&&a.legends.length==
1){this.iconNode.src=this._getLegendIconUrl(a.legends[0]);dojo.destroy(this.containerNode)}else this._createChildrenNodes(a.legends,"legend");else{dojo.destroy(this.iconNode);dojo.destroy(this.containerNode)}}this.serviceTOC._layerWidgets.push(this)},_createLegendNode:function(a){dojo.destroy(this.checkNode);dojo.destroy(this.containerNode);dojo.addClass(this.labelNode,"agsTOCLegendLabel");this.iconNode.src=this._getLegendIconUrl(a);this.labelNode.innerHTML=a.label},_getLegendIconUrl:function(a){var b=
a.url;if(!dojo.isIE&&a.imageData&&a.imageData.length>0)b="data:image/png;base64,"+a.imageData;else if(b.indexOf("http")!==0)b=this.service.url+"/"+this.layer.id+"/images/"+b;return b},_createChildrenNodes:function(a,b){this.serviceTOC._currentIndent++;dojo.forEach(a,function(c){var d={serviceTOC:this.serviceTOC,service:this.service,layer:this.layer,legend:this.legend};d[b]=c;(new agsjs.dijit._TOCNode(d)).placeAt(this.containerNode)},this);this.serviceTOC._currentIndent--},_toggleContainer:function(a){if(dojo.hasClass(this.iconNode,
"dijitTreeExpandoClosed")||dojo.hasClass(this.iconNode,"dijitTreeExpandoOpened")){if(a){dojo.removeClass(this.iconNode,"dijitTreeExpandoClosed");dojo.addClass(this.iconNode,"dijitTreeExpandoOpened")}else if(a===false){dojo.removeClass(this.iconNode,"dijitTreeExpandoOpened");dojo.addClass(this.iconNode,"dijitTreeExpandoClosed")}else{dojo.toggleClass(this.iconNode,"dijitTreeExpandoClosed");dojo.toggleClass(this.iconNode,"dijitTreeExpandoOpened")}dojo.hasClass(this.iconNode,"dijitTreeExpandoOpened")?
this.toggler.show():this.toggler.hide()}},_adjustToState:function(){if(this.layer){var a=esri.geometry.getScale(this.serviceTOC.toc.map);(a=this.layer.maxScale!=0&&a<this.layer.maxScale||this.layer.minScale!=0&&a>this.layer.minScale)?dojo.addClass(this.domNode,"agsTOCOutOfScale"):dojo.removeClass(this.domNode,"agsTOCOutOfScale");if(this.checkNode){this.checkNode.disabled=a;this.checkNode.checked=this.layer.visible}if(this.radioNode){a=false;if(this.service.getGMap()!=null)a=this.radioNode.value==
this.service.getGMap().getMapTypeId();this.radioNode.checked=a}}},_onClick:function(a){a=a.target;if(a==this.checkNode){this.serviceTOC.toc.style=="inline"&&this._toggleContainer(this.checkNode.checked);if(this.layer){this.layer.visible=this.checkNode.checked;var b=[];dojo.forEach(this.service.layerInfos,function(c){c.subLayerIds||c.visible&&b.push(c.id)});b.length===0&&b.push(-1);this.service.setVisibleLayers(b,false);this.serviceTOC._refreshLayer()}else this.service&&this.service.setVisibility(this.checkNode.checked)}else if(a==
this.iconNode)this._toggleContainer();else a==this.radioNode&&this.service.setMapTypeId&&this.service.setMapTypeId(a.value)}});
dojo.declare("agsjs.dijit._ServiceTOC",[dijit._Widget],{_currentIndent:0,service:null,_layerWidgets:[],constructor:function(a){this.service=a.service;this.toc=a.toc;this.info=a.info||{}},postCreate:function(){if(this.service instanceof esri.layers.ArcGISDynamicMapServiceLayer||this.service instanceof esri.layers.ArcGISTiledMapServiceLayer){if(!this.info.title){var a=this.service.url.toLowerCase().indexOf("/rest/services/"),b=this.service.url.toLowerCase().indexOf("/mapserver",a);this.info.title=this.service.url.substring(a+
15,b)}}else if(agsjs.layers&&this.service instanceof agsjs.layers.GoogleMapsLayer){if(!this.info.title)this.info.title="Google Maps";this.service.tocInfos=[{name:"Hybrid"},{name:"RoadMap"},{name:"Satellite"},{name:"Terrain"}]}else this.info.noLayers=true;this.service.legendResponse||!this.service.url||this.info.noLegend||this.info.noLayers?this._createServiceTOC():this._getLegendInfo()},_getLegendInfo:function(){var a="";if(this.service.version>=10.01)a=this.service.url+"/legend";else{a="http://www.arcgis.com/sharing/tools/legend";
var b=this.service.url.toLowerCase().indexOf("/rest/");b=this.service.url.substring(0,b)+this.service.url.substring(b+5);a=a+"?soapUrl="+escape(b)}esri.request({url:a,content:{f:"json"},callbackParamName:"callback",handleAs:"json",load:dojo.hitch(this,this._processLegendInfo),error:dojo.hitch(this,this._createServiceTOC)})},_processLegendError:function(a){console.log(a);this._createServiceTOC()},_processLegendInfo:function(a){this.service.legendResponse=a;this._createServiceTOC()},_createServiceTOC:function(){var a=
this.service;if(!a.tocInfos){var b={};dojo.forEach(a.layerInfos,function(d){b[""+d.id]=d;d.visible=d.defaultVisibility});a.legendResponse&&dojo.forEach(a.legendResponse.layers,function(d){var e=b[""+d.layerId];if(e&&d.legend)e.legends=d.legend});dojo.forEach(a.layerInfos,function(d){if(d.subLayerIds){var e=[];dojo.forEach(d.subLayerIds,function(f,g){e[g]=b[f]});d.subLayerInfos=e}});var c=[];dojo.forEach(a.layerInfos,function(d){d.parentLayerId==-1&&c.push(d)});a.tocInfos=c}this._serviceNode=new agsjs.dijit._TOCNode({serviceTOC:this,
service:a});this._serviceNode.placeAt(this.domNode);this._visHandler=dojo.connect(a,"onVisibilityChange",this,"_adjustToState");this._visLayerHandler=dojo.connect(a,"setVisibleLayers",this,"_adjustToState");if(agsjs.layers&&this.service instanceof agsjs.layers.GoogleMapsLayer)this._maptypeIdHandler=dojo.connect(a,"onMapTypeIdChanged",this,"_adjustToState")},_refreshLayer:function(){var a=this.service;if(this._refreshTimer){window.clearTimeout(this._refreshTimer);this._refreshTimer=null}this._refreshTimer=
window.setTimeout(function(){a.setVisibleLayers(a.visibleLayers)},1E3)},_adjustToState:function(){this._serviceNode.checkNode.checked=this.service.visible;dojo.forEach(this._layerWidgets,function(a){a._adjustToState()})},destroy:function(){dojo.disconnect(this._visHandler);dojo.disconnect(this._visLayerHandler);dojo.disconnect(this._maptypeIdHandler)}});
dojo.declare("agsjs.dijit.TOC",[dijit._Widget],{indentSize:18,style:"standard",layerInfos:null,slider:false,constructor:function(a){a=a||{};if(!a.map)throw new Error("no map defined in params for TOC");dojo.mixin(this,a);this._serviceWidgets=[];if(!this.layerInfos){this.layerInfos=[];for(a=this.map.layerIds.length-1;a>=0;a--)this.layerInfos.push({layer:this.map.getLayer(this.map.layerIds[a])})}},postCreate:function(){this._createTOC();this._zoomHandler=dojo.connect(this.map,"onZoomEnd",this,"_adjustToState")},
_createTOC:function(){for(var a=0,b=this.layerInfos.length;a<b;a++){var c=new agsjs.dijit._ServiceTOC({service:this.layerInfos[a].layer,info:this.layerInfos[a],toc:this});this._serviceWidgets.push(c);c.placeAt(this.domNode)}},_adjustToState:function(){dojo.forEach(this._serviceWidgets,function(a){a._adjustToState()})},destroy:function(){dojo.disconnect(this._zoomHandler)}});