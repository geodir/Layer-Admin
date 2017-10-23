var GeodirLayerAdmin = (function() {
	var instance;
	function LayerAdmin(GEODIR) {
		this.GEODIR=GEODIR;
		// always initialize all instance properties
		this.layers = {
			baseLayers : {},
			overlays : {}
		};
		var template;
		this._container = null;
		this.addEvent =null,// new Event('addLayer');
		this.removeEvent = null,//new Event('removeLayer');
		this.changeLayerEvent =null,// new Event('changeLayerEvent');
		this.filterLayerEvent = null,//new Event('filterLayerEvent');
		this.idLayerList = 'geodir-layer-list';
		this.map = null;
		this.currentLayer = null;
		this.currentLayerId = GEODIR.CurrentLayerId;
		this.controlLayer = true;
		this.mapcontrols = {};
	}
	LayerAdmin.prototype.loadControls = function() {
		for (let i = 0; i < this.GEODIR.ControlExtension.length; i++) {
			if (this.mapcontrols.hasOwnProperty(this.GEODIR.ControlExtension[i])) {
				this.mapcontrols[this.GEODIR.ControlExtension[i]].addTo(this.map);
			}
		}
		if (this.controlLayer) {
			this.mapcontrols.controlLayer = L.control.layers(this.layers.baseLayers).addTo(
					this.map);
		}
		// this.mapcontrols.showinfo =L.geodirInfo().addTo(this.map);
	};
	
	LayerAdmin.prototype.getMapControl = function(name) {
		if (this.mapcontrols.hasOwnProperty(name)) {
			return this.mapcontrols[name];
		}
		return null;
	};
	
	LayerAdmin.prototype.getContext = function() {
		return this.serverContext;
	};
	LayerAdmin.prototype.cancelControlActions = function(fn) {
		for (let controlName in this.mapcontrols){
			if (this.mapcontrols[controlName] instanceof L.Control.Geodir) {
				this.mapcontrols[controlName]._cancelAction();
			}
		}

		if (fn) {
			fn();
		}
	};
	//
	// class methods
	LayerAdmin.prototype.getLayers = function() {
		return this.layers.overlays;
	};
	LayerAdmin.prototype.styleLayer = function(sld_url) {
		let currentLayer = this.getCurrentLayer();
	    if(currentLayer!=null){
	    	currentLayer.layer.setStyle(sld_url);
	    	currentLayer.layer.updateMapaStyle();
		}
	};
	LayerAdmin.prototype.filterLayer = function(query) {
		let currentLayer = this.getCurrentLayer();
	    if(currentLayer!=null){
	    	currentLayer.layer.setfiltro(query);
	    	currentLayer.layer.updateMapaStyle();
	    	this.fire(this.GEODIR.Event.FILTERLAYEREVENT,currentLayer);
		}
	};
	LayerAdmin.prototype.getMap = function() {
		return this.map;
	};
	LayerAdmin.prototype.addLayers = function(layers) {
		for (let layer in layers) {
			//var html = this.template(layers[layer]);
			//$("#" + this.idLayerList).append(html);
			// http://192.168.1.30:8082/geoserver/sigvialws/ows
			var _wmsLayer = L.tileLayer.geodirWMS(layers[layer].wmsUrl, {
				name : layers[layer].alias,
				layers : layers[layer].layer,
				nikolasParam : Math.random(),
				sld:layers[layer].sld,
				maxZoom : 19 ,
				format : 'image/png',
				transparent : true,
				tiled : true,
				crs:L.CRS.EPSG4326,
				CQL_FILTER : layers[layer].query,
				columnId : layers[layer].columnId
			})

			var _layer = {
				data : layers[layer],
				layer : _wmsLayer
			}
			this.layers.overlays[layers[layer].id] = _layer;
			
			var count = Object.keys(this.layers.overlays).length;
			if (layers[layer].visible) {
				this.map.addLayer(_layer.layer);
				// _layer.layer.enableInfo();
			}
			if (this.controlLayer) {
				this.mapcontrols.controlLayer.addOverlay(_layer.layer,_layer.data.alias);
			}
			this.layerAdded = _layer.layer;
			this.fire(this.GEODIR.Event.ADDLAYER,_layer);
		}
		if (this.currentLayerId==0) {
			for (let layer in this.layers.overlays) {
				this.currentLayerId=layer;
				break;
			}
		}
		this.selectLayer(this.currentLayerId);
	};
	LayerAdmin.prototype.onbefore = function(type, fn, context) {
		var obj = this;
		var handler = function(e) {
			return fn.call(context || obj, e || window.event);
		};
		this._container.addEventListener(type, handler, false);
	};
	LayerAdmin.prototype.on = function(types, fn, context) {
		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				this._on(type, types[type], fn);
			}
		} else {
			types = L.Util.splitWords(types);
			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}
		return this;
	};
	LayerAdmin.prototype._on = function(type, fn, context) {
		this._events = this._events || {};
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}
		if (context === this) {
			context = undefined;
		}
		var newListener = {fn: fn, ctx: context},
		    listeners = typeListeners;
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}
		listeners.push(newListener);
	};
	LayerAdmin.prototype.fire = function(type, data, propagate) {
		//if (!this.listens(type, propagate)) { return this; }
		if (this._events) {
			var listeners = this._events[type];
			if (listeners) {
				this._firingCount = (this._firingCount + 1) || 1;
				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					//l.fn.call(l.ctx || this, event);
					l.fn.call(data || this, event);
				}
				this._firingCount--;
			}
		}
		return this;
	};
	LayerAdmin.prototype.onAddLayer = function(fn, context) {
		var obj = this;
		var handler = function(e) {
			return fn.call(context || obj.layerAdded, e || window.event);
		};
		this._container.addEventListener('addLayer', handler, false);
	};

	LayerAdmin.prototype.addLayer = function(layer) {
		
		this.layers.overlays.push(layer);
	};
	LayerAdmin.prototype.initTemplate = function(serverContext) {
		var container = this._container = document
				.getElementById(this.idLayerList);
		this.serverContext = serverContext;
		var source = $("#geodir-layer-template").html();
		//this.template = Handlebars.compile(source);
		
		if (this.GEODIR.baselayers) {
			this.layers.baseLayers = this.GEODIR.baselayers;
		}
		
		var configurationMap;
		
		if(GEODIR.MapConfiguracion){
			configurationMap = GEODIR.MapConfiguracion;
		}else{
			configurationMap ={
					"center": "[ -9.297306856327584,-74.37744140625 ]",
					"zoom": 6,
					"baseMap":"Calles"
			}
		}
				
		this.map = mymap = L.map('mapid',{ 
			zoomControl: false,
			center: JSON.parse(configurationMap.center),
			zoom: configurationMap.zoom,
			layers: [this.layers.baseLayers[configurationMap.baseName],]
		});		
		
		if (this.GEODIR.mapcontrols) {
			this.mapcontrols=this.GEODIR.mapcontrols;
		}
		
		L.control.zoom({
			position : 'topright'
		}).addTo(this.map);
		
		
		// add a scale at at your map.
		L.control.scale().addTo(this.map); 
		
		
		this.map.on('zoomend', this.updateConfMap, this.map);
		this.map.on('moveend', this.updateConfMap, this.map);
		this.map.on('baselayerchange', function(e) {
			GEODIR.SelectedBaseLayer =  e.name;
			var map = this;
			var bbox = map.getBounds();
			var url = GEODIR.serverContext + 'geodir/ext/basemap/saveconf';
			$.ajax({
				type : 'PUT',
				contentType : 'application/json',
				url: url,
				dataType : "json",
				data : JSON.stringify({
					"zoom":  map.getZoom(),
					"center": '[ ' + map.getCenter().lat + "," + map.getCenter().lng + ' ]',
					"bbox": bbox.getSouthWest().lng+","+bbox.getSouthWest().lat+","+bbox.getNorthEast().lng+","+bbox.getNorthEast().lat,
					"baseName": GEODIR.SelectedBaseLayer
				})
			});
		});
		
		
		this.loadControls();
		this.activeEvents();
	};
	LayerAdmin.prototype.changeVisible = function(id, visible) {
		if (!id) {
			return;
		}
		if (visible) {
			this.map.addLayer(this.layers.overlays[id].layer);
		} else {
			this.map.removeLayer(this.layers.overlays[id].layer);
		}
		var $token = $("meta[name='_csrf']");
		var $header = $("meta[name='_csrf_header']");
		var url = this.serverContext + 'geodir/ext/layer/changevisible/' + id
				+ "?visible=" + visible;
		$.ajax(
				{
					url : url,
					type : 'PUT',
					beforeSend : function(request) {
						if ($token != null && $token.length > 0
								&& $header != null && $header.length > 0) {
							request.setRequestHeader($header.attr("content"),
									$token.attr("content"));
						}
					}
				}).done(function(result) {
		}).fail(function(jqXHR, status) {
			console.log(jqXHR);
			console.log(status);
		});
	};
	LayerAdmin.prototype.changeAlias = function(id, newAlias){
		if(!id){
			return false;
		}
		this.mapcontrols.controlLayer.removeLayer(this.layers.overlays[id].layer);
		this.map.removeLayer(this.layers.overlays[id].layer);
		
		var layerInfo = this.layers.overlays[id].data;
		layerInfo.alias = newAlias;
		
		
		this.layers.overlays[id] = null;
		
		
		var _wmsLayer = L.tileLayer.geodirWMS(layerInfo.wmsUrl, {
			name : newAlias,
			layers : layerInfo.layer,
			nikolasParam : Math.random(),
			sld:layerInfo.sld,
			format : 'image/png',
			transparent : true,
			tiled : true,
			crs:L.CRS.EPSG4326,
			CQL_FILTER : layerInfo.query,
			columnId : layerInfo.columnId
		});
		
		var _layer = {
				data : layerInfo,
				layer : _wmsLayer
		};

		this.layers.overlays[layerInfo.id] = _layer;
		var count = Object.keys(this.layers.overlays).length;
		if (layerInfo.visible) {
			this.map.addLayer(_layer.layer);
			// _layer.layer.enableInfo();
		}
		
		if (this.controlLayer) {
			this.mapcontrols.controlLayer.addOverlay(_layer.layer,_layer.data.alias);
		}
		this.layerAdded = _layer.layer;
		//this.fire(this.GEODIR.Event.ADDLAYER,_layer);
		
		this.layers.overlays[layerInfo.id].layer.setZIndex(15+(layerInfo.order-1));
		
		
		var $token = $("meta[name='_csrf']");
		var $header = $("meta[name='_csrf_header']");
		var url = serverContext + 'geodir/ext/layer/changealias/' + id +'?newAlias='+newAlias;
		$.ajax(
				{
					url : url,
					type : 'PUT',
					beforeSend : function(request) {
						if ($token != null && $token.length > 0
								&& $header != null && $header.length > 0) {
							request.setRequestHeader($header.attr("content"),
									$token.attr("content"));
						}
					}
				}).done(function(result) {
					return true;
		}).fail(function(jqXHR, status) {
			console.log(jqXHR);
			console.log(status);
			return false;
		});
	};
	LayerAdmin.prototype.updateNumberOfFeatures = function(){
		let _url = this.currentLayer.data.wmsUrl.replace("ows","wfs");
		let wfsParams = {
			'request': 'GetFeature',
			'typeName' : this.currentLayer.data.layer,
			'version' : '1.1.0',
			'resultType' : 'hits',
			'CQL_FILTER' : this.currentLayer.data.query
		};
		let layer = this.currentLayer;
		$.ajax({
			  url: _url,
			  type: "get", //send it through get method
			  data: wfsParams,
			  success: function(xml) {
				  layer.data.records = $("wfs\\:FeatureCollection",xml).attr("numberOfFeatures");
			  },
			  error: function(xhr) {
				  layer.data.records = 0;
			  }
			});
		this.currentLayer = layer;
		
	};
	LayerAdmin.prototype.getCurrentLayer = function() {
		return this.currentLayer;
	};
	LayerAdmin.prototype.updateCurrentLayer = function(){
		this.updateNumberOfFeatures();
		this.currentLayer.layer.updateMapaStyle();
	};
	LayerAdmin.prototype.deleteGeodirlayer = function(id) {
		var $token = $("meta[name='_csrf']");
		var $header = $("meta[name='_csrf_header']");
		var url = this.serverContext + 'geodir/ext/layer/delete/' + id;
		var context = this;
		$.ajax(
				{
					url : url,
					type : 'DELETE',
					beforeSend : function(request) {
						if ($token != null && $token.length > 0
								&& $header != null && $header.length > 0) {
							request.setRequestHeader($header.attr("content"),
									$token.attr("content"));
						}
					}
				}).done(function(result) {
			$("#geodir-layer-id-" + id).remove();
			context.selectLayer(result);
			context.map.removeLayer(context.layers.overlays[id].layer);
			delete context.layers.overlays[id];
		}).fail(function(jqXHR, status) {
			console.log(jqXHR);
			console.log(status);
		});
	};
	LayerAdmin.prototype.selectLayer = function(id) {
		var $token = $("meta[name='_csrf']");
		var $header = $("meta[name='_csrf_header']");
		var url = this.serverContext + 'geodir/ext/layer/select/' + id;
		var context = this;
		context.cancelControlActions(function(){
			$.ajax(
					{
						url : url,
						type : 'PUT',
						beforeSend : function(request) {
							if ($token != null && $token.length > 0
									&& $header != null && $header.length > 0) {
								request.setRequestHeader($header.attr("content"),
										$token.attr("content"));
							}
						}
					}).done(function(result) {
				context.currentLayer = context.layers.overlays[result];
				context.currentLayerId=result;
				context.fire(context.GEODIR.Event.CHANGELAYEREVENT);
				$('#geodir-layer-list').siblings().removeClass('active');
				if(!$('#geodir-layer-id-'+context.currentLayerId).hasClass("active")){
				    $('#geodir-layer-id-'+context.currentLayerId).addClass("active");
				}
			}).fail(function(jqXHR, status) {
				console.log(jqXHR);
				console.log(status);
			})		
			}	
		);
	};
	LayerAdmin.prototype.reorderGeodirlayers = function(order) {
		var comp = this;
		var $token = $("meta[name='_csrf']");
		var $header = $("meta[name='_csrf_header']");
		let orderIds =order;
		var rowIds = order.join(",");
		var url = this.serverContext + 'geodir/ext/layer/reorder/' + rowIds;
		$.ajax(
				{
					url : url,
					type : 'PUT',
					beforeSend : function(request) {
						if ($token != null && $token.length > 0
								&& $header != null && $header.length > 0) {
							request.setRequestHeader($header.attr("content"),
									$token.attr("content"));
						}
					}
				}).done(function(result) {
			let maxIndex = orderIds.length;
			for (i = 0; i < orderIds.length; i++) { 
				comp.layers.overlays[orderIds[i]].layer.setZIndex(15+(maxIndex-i));
			}
		}).fail(function(jqXHR, status) {
			console.log(jqXHR);
			console.log(status);
		});
	};
	LayerAdmin.prototype.activeEvents = function() {
		var inst = this;
		/*$('#geodir-layer-list').on("click", '.btn-delete-layer', function() {
			var $this = $(this);
			var id = $this.attr('geodir-layer-id');
			inst.deleteGeodirlayer(id);
		});*/
		$('#geodir-layer-list').on("click", '.btn-visible-layer', function(event) {
//			event.preventDefault();
	   		event.stopPropagation();
			var $this = $(this);
			var visible = $this.attr('geodir-layer-visible') == "true";
//			$this.children().toggleClass('imgMostrar');
//			$this.children().toggleClass('imgOcultar');
			var changevi = !visible;
			$this.attr('geodir-layer-visible', changevi);
			var id = $this.attr('geodir-layer-id');
			inst.changeVisible(id, !visible);
		});
		$('#geodir-layer-list').on("click", '.geodir-layer', function(event) {
//			event.preventDefault();
//	   		event.stopPropagation();
			var $this = $(this);
			var visible = $this.val() == "true";
			if (!$this.hasClass("active")) {
				$this.addClass("active");
			}
			var id = $this.attr('geodir-layer-id');
			inst.selectLayer(id);
			$this.siblings().removeClass('active');

		});

	};
	LayerAdmin.prototype.updateConfMap = function(){
		var map = this;
		var bbox = map.getBounds();
		var url = GEODIR.serverContext + 'geodir/ext/basemap/saveconf';
		$.ajax({
			type : 'PUT',
			contentType : 'application/json',
			url: url,
			dataType : "json",
			data : JSON.stringify({
				"zoom":  map.getZoom(),
				"center": '[ ' + map.getCenter().lat + "," + map.getCenter().lng + ' ]',
				"bbox": bbox.getSouthWest().lng+","+bbox.getSouthWest().lat+","+bbox.getNorthEast().lng+","+bbox.getNorthEast().lat,
				"baseName": GEODIR.SelectedBaseLayer
			})
		});

	};
	function createInstance(GEODIR) {
		var object = new LayerAdmin(GEODIR);
		object.initTemplate(GEODIR.serverContext);
		return object;
	}
	return {
		getInstance : function(GEODIR) {
			if (!instance) {
				instance = createInstance(GEODIR);			
				GEODIR.fire('loaded',instance);
			}
			return instance;
		}
	};
})();