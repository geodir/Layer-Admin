L.GeodirLegend = L.Control.extend({
    options:{
    	container: '',
        position : 'bottomright',
        title: 'Leyenda',
        showNumRecords: false,
        url_layers: '/geodir/ext/layer/json',
        maxHeight: 300
    },
    initialize: function(options){
    	console.log("initialize");
    	L.Util.setOptions(this, options || {});
    },
    defaultLegendParams: {
    	request: 'GetLegendGraphic',
    	version : '1.0.0',
    	format : 'image/png',
    	width : 20,
		heigth : 20,
    	service: 'WMS',
		SLD_VERSION : '1.0.0',
		LEGEND_OPTIONS : "countMatched:true;fontName:'myFirstFont';fontStyle:bold;fontAntiAliasing:true;fontColor:0x000000;fontSize:10;bgColor:0x000000"
    },
    onAdd: function(map){
    	console.log("onAdd");
    	this._map = map;
        this._container = L.DomUtil.create('div', 'leaflet-control-legend');
        this._containerLegend = this._createLegendContainer();
        this._button = this._createButton();
        
        return this._container;
    },
    
    addTo: function (map) {
    	console.log("addTo");
    	if(this.options.container){
    		this._container = this.onAdd(map);
			this._wrapper = L.DomUtil.get(this.options.container);
			this._wrapper.style.position = 'relative';
			this._wrapper.appendChild(this._container);
    	}else
    		L.Control.prototype.addTo.call(this, map);
    	
    	return this;
    },
    
    addItemLegend: function(layer){

    },
    removeItemLegend: function(layer){

    },
    updateItemLegend: function(layer){
    	
    },
    
    _createTitle: function(container){
    	let title = L.DomUtil.create('div', 'legend-title', container);
    	title.innerHTML = "<b>" + this.options.title + "</b>";
    	
    	let closeButton = L.DomUtil.create('a', 'legend-close', title);
    	closeButton.href = "#";
    	closeButton.innerHTML = "<span>&otimes;</span>";//imageless(see css)
		L.DomEvent.on(closeButton, 'click', L.DomEvent.stop, this)
					.on(closeButton, 'click', this._closeLegend, this);
    	return title;
    },
    
    _createLegendContainer: function(){
    	let containerLegend = L.DomUtil.create('div', 'legend-container', this._container);
    	containerLegend.style.display = 'none';
    	L.DomEvent
    			.on(containerLegend, 'mouseleave', L.DomEvent.stop, this)
    			.on(containerLegend, 'mouseleave', this._closeLegend, this);
    	let title = this._createTitle(containerLegend);
    	
    	return containerLegend;
    },
    
    _createButton: function(){
    	let button = L.DomUtil.create('a', 'legend-button', this._container);
    	button.href = '#';
		button.title = this.options.title;
		L.DomEvent
				.on(button, 'click', L.DomEvent.stop, this)
				.on(button, 'click', this._openLegend, this)
				.on(button, 'mouseover', this._openLegend, this);
		
		return button;
    },
    _openLegend: function(){
    	this._button.style.display = 'none';
    	this._containerLegend.style.display = 'block';
    	this._itemsLegend = this._buildItemsLegend(this._containerLegend);
    	return this;
    },
    
    _closeLegend: function(){
		if(this._containerLegend.style.display  ==  'block'){
			this._containerLegend.style.display = 'none';
			this._button.style.display = 'block';
			L.DomUtil.remove(this._itemsLegend);
		}
		return this;
	},
	
	_buildItemsLegend: function(container){
		let divContent = L.DomUtil.create('div', 'legend-items-content', container);
		divContent.style.maxHeight = this.options.maxHeight+'px';
		let containerItems = L.DomUtil.create('ul', 'legend-items list-group', divContent);
		if(this.options.url_layers){
			let selfDefaultLegendParams = this.defaultLegendParams;
			$.getJSON(this.options.url_layers, function(layers){
				for(let layer in layers){
					let legendLayer = layers[layer];
					
					if(legendLayer.visible ){
						let item = L.DomUtil.create('li', 'legend-item list-group-item', containerItems);
						
						let text = L.DomUtil.create('b', 'legend-text', item);
						text.innerHTML = legendLayer.alias;
						
						if(legendLayer.id != 9999){
							let paramsLegend = {
									request : selfDefaultLegendParams.request,
									service : selfDefaultLegendParams.service,
									SLD_VERSION : selfDefaultLegendParams.SLD_VERSION,
									transparent : true,
									version : selfDefaultLegendParams.version,
									format : selfDefaultLegendParams.format,
									layer : legendLayer.layer,
									geodirParam : Math.random(),
									WIDTH : selfDefaultLegendParams.width,
									HEIGHT : selfDefaultLegendParams.heigth,
									LEGEND_OPTIONS : selfDefaultLegendParams.LEGEND_OPTIONS,
								};
							
							if(legendLayer.sld != null){
								paramsLegend.sld = legendLayer.sld;
							}
							let srcImg = legendLayer.wmsUrl + L.Util.getParamString(paramsLegend, legendLayer.wmsUrl, true);
							let contentImg = L.DomUtil.create('div', 'legend-image', item);
							let image = L.DomUtil.create('img', '', contentImg);
							image.src = srcImg;
							
						}else{
							console.log(legendLayer);
						}	
					}	
					
				}
			});
			
		}
		return containerItems;
	}
    
});

L.geodirLegend = function(options){
	return new L.GeodirLegend(options);
};
