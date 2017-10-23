L.GeodirGoToXY  = L.Control.extend({
	includes: L.Mixin.Events,
	options:{
		container: '',
		position: 'topleft',
		showlabel: true,
		decimals:4,
		textLatitud: 'Latitud',
		textLongitud: 'Longitud',
		textUTMEasting: 'Este',
		textUTMNorthing: 'Norte',
		textZoneNum:'Zona',
		textZoneChar:'Zona letra',
		textHemisferio:'Hemisferio',
		textZoom: 'Zoom',
		textTitle: 'Buscar coordenadas',
		zoomDefault: 12,
		showZoom: false,
		showTitle: false,
		autoRemoveSarch : true,	
		searchDefault: 'latitud_longitude',
		autoRemoveSarchTime : 10000,
	},
	
	initialize:  function(options){
		L.Util.setOptions(this, options || {});
		this._inputCoordinatesMinSize = this.options.decimals ? this.options.decimals + 4 : 9;
	},
	
	onAdd: function(map){
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-gotoxy');
		this._divGoToXY = this._createDivGoToXY(this.options.showlabel, 
				this.options.decimals, this.options.textLatitud,
				this.options.textLongitud, this.options.textZoom, this.options.zoomDefault,
				this.options.textTitle, this.options.textUTMEasting, this.options.textUTMNorthing, this.options.textZoneNum, this.options.textZoneChar,
				this.options.textHemisferio);
		this._button = this._createButton(this.options.textTitle, 'gotoxy-button' );
		
		return this._container;
	},
	
	addTo: function (map) {
		if(this.options.container) {
			this._container = this.onAdd(map);
			this._wrapper = L.DomUtil.get(this.options.container);
			this._wrapper.style.position = 'relative';
			this._wrapper.appendChild(this._container);
		}
		else
			L.Control.prototype.addTo.call(this, map);

		return this;
	},
	
	onRemove: function(map) {
		console.log("onRemove");
	},
	
	_createButton: function(textTitle, className){
		let button = L.DomUtil.create('a', className, this._container);
		button.href = '#';
		button.title = textTitle;
		L.DomEvent
				.on(button, 'click', L.DomEvent.stop, this)
				.on(button, 'click', this._showSearch, this)
		
		return button;
	},
	
	_createDivGoToXY: function(showlabel, decimals, textLatitud,
			textLongitud, textZoom, zoomDefault, textTitle, textUTMEasting, textUTMNorthing, textZoneNum, textZoneChar, textHemisferio){
		let divGoToXY = L.DomUtil.create('div', 'gotoXY-search', this._container );
		divGoToXY.style.display = 'none';
		
		let divTitle = this._createDivTitle(textTitle, divGoToXY );
		let divZoom = this._createDivZoom(showlabel,textZoom, zoomDefault, divGoToXY);
		if(!this.options.showZoom){
			divZoom.style.display = 'none';
		}
		this.divOptions = this._createDivOption(divGoToXY);
		this.divSearchLatLng = this._createDivCoordinates(showlabel, decimals, textLatitud, textLongitud, divGoToXY);
		this.divSearchUTM = this._createDivUTM(showlabel, decimals, textUTMEasting, textUTMNorthing, textZoneNum, textZoneChar,textHemisferio, divGoToXY);
		
		if(this.options.searchDefault == 'latitud_longitude'){
			this._activeGEO();
		}else{
			this._activeUTM();
		}
			
		return divGoToXY;
	},
	
	_createDivTitle : function(textTitle, container){
		let divTitle = L.DomUtil.create('div', 'gotoXY-title', container );
		if(this.options.showTitle){
			divTitle.innerHTML = "<b>"+textTitle+"</b>";
		}
		
		
		let closeButton = L.DomUtil.create('a', 'gotoXY-close', divTitle);
		closeButton.href = "#";
		closeButton.innerHTML = "<span>&otimes;</span>";//imageless(see css)
		L.DomEvent.on(closeButton, 'click', L.DomEvent.stop, this)
					.on(closeButton, 'click', this.close, this);
		
		return divTitle;
	},
	
	_createDivOption : function(container){
		let divOptions = L.DomUtil.create('div', 'btn-group', container );
		
		this._optionGeografica = L.DomUtil.create('a', 'btn btn-primary btn-sm active', divOptions);
		this._optionGeografica.style.cursor = "pointer";
		this._optionGeografica.innerHTML='GEO';
		
		L.DomEvent
				.on(this._optionGeografica, 'click', L.DomEvent.stop, this)
				.on(this._optionGeografica, 'click', this._activeGEO, this);
		
		
		this._optionUTM = L.DomUtil.create('a', 'btn btn-primary btn-sm notActive', divOptions);
		this._optionUTM.style.cursor = "pointer";
		this._optionUTM.innerHTML='UTM';
		
		L.DomEvent
				.on(this._optionUTM, 'click', L.DomEvent.stop, this)
				.on(this._optionUTM, 'click', this._activeUTM, this);
		
		return divOptions;
	},
	
	
	
	_createDivZoom: function(showlabel, textZoom, zoomDefault, divContainer){
		let divZoom = L.DomUtil.create('div', 'gotoXY-div', divContainer );
		let label = null;
		if(showlabel){
			label = L.DomUtil.create('label', 'gotoXY-label', divZoom);
			label.innerHTML  = textZoom;
		}
		
		this._inputZoom = L.DomUtil.create('input', 'gotoXY-input', divZoom);
		this._inputZoom.type = 'number';
		this._inputZoom.size = 6;
		this._inputZoom.value = zoomDefault;
		this._inputZoom.max = 4;
		this._inputZoom.min = 18;
		this._inputZoom.step = 1;
		if(label == null)
			this._inputZoom.placeholder = textZoom;
		
		L.DomEvent
			.disableClickPropagation(this._inputZoom)
			.on(this._inputZoom, 'keydown', this._handleKeypress, this);
		
		return divZoom;
	},
	
	_createDivUTM: function(showlabel, decimals, textUTMEasting, textUTMNorthing, txtZoneNum, txtZoneChar, txtHemisferio, container){
		let divCoordinates = L.DomUtil.create('div', 'gotoXY-div', container );
		
		let step;
		if(decimals > 6){
			step = 0.000001 
		}else{
			for(step ='0'; step.length < decimals -1; step +='0'){
			}
			step = '0.'+step+'1';
		}
		
		//**********EASTING************//
		let labelEasting = null;
		if(showlabel){
			labelEasting = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			labelEasting.innerHTML  = textUTMEasting;
		}
		
		this._inputEasting = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputEasting.type = 'number';
		this._inputEasting.size = this._inputCoordinatesMinSize + 4;
		this._inputEasting.step = step;
		
		if(labelEasting == null){
			this._inputEasting.placeholder = textUTMEasting;
			this._inputEasting.title = textUTMEasting;
		}
		
		L.DomEvent
				.disableClickPropagation(this._inputEasting)
				.on(this._inputEasting, 'keydown', this._handleKeypressUTM, this);
		
		//**********NORTHING************//
		let labelNorthing = null;
		if(showlabel){
			labelNorthing = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			labelNorthing.innerHTML  = textUTMNorthing;
		}
		
		this._inputNorthing = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputNorthing.type = 'number';
		this._inputNorthing.size = this._inputCoordinatesMinSize + 4;
		this._inputNorthing.step = step;
		
		if(labelNorthing == null){
			this._inputNorthing.placeholder = textUTMNorthing;
			this._inputNorthing.title = textUTMNorthing;
		}
		
		L.DomEvent
				.disableClickPropagation(this._inputNorthing)
				.on(this._inputNorthing, 'keydown', this._handleKeypressUTM, this);
		
		let br = L.DomUtil.create('br', '', divCoordinates);
		
		//**********ZONE NUM************//
		let labelZoneNum = null;
		if(showlabel){
			labelZoneNum = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			labelZoneNum.innerHTML  = txtZoneNum;
		}
		
		this._inputZonNum = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputZonNum.type = 'number';
		this._inputZonNum.size =  4;
		this._inputZonNum.step = 1;
		
		if(labelZoneNum == null){
			this._inputZonNum.placeholder = txtZoneNum;
			this._inputZonNum.title = txtZoneNum;
		}
		
		L.DomEvent
				.disableClickPropagation(this._inputZonNum)
				.on(this._inputZonNum, 'keydown', this._handleKeypressUTM, this);
		
		
		//**********ZONE CHAR************//
		let labelZoneChar = null;
		if(showlabel){
			labelZoneChar = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			laberZoneChar.style.display = "none";
			labelZoneChar.innerHTML  = txtZoneChar;
		}
		
		this._inputZoneChar = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputZoneChar.type = 'text';
		this._inputZoneChar.size =  4;
		this._inputZoneChar.style.display = "none";
		
		if(labelZoneChar == null){
			this._inputZoneChar.placeholder = txtZoneChar;
			this._inputZoneChar.title = txtZoneChar;
		}
		
		L.DomEvent
				.disableClickPropagation(this._inputZoneChar)
				.on(this._inputZoneChar, 'keydown', this._handleKeypressUTM, this);
		
		//************HEMISFERIO***************//
		let labelHemisferio = null;
		if(showlabel){
			labelHemisferio = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			labelHemisferio.innerHTML  = txtHemisferio;
		}
		
		this._inputHemisferio = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputHemisferio.type = 'text';
		this._inputHemisferio.size =  4;
		this._inputHemisferio.style.textTransform = "capitalize";
		
		if(labelHemisferio == null){
			this._inputHemisferio.placeholder = txtHemisferio;
			this._inputHemisferio.title = txtHemisferio;
		}
		
		L.DomEvent
			.disableClickPropagation(this._inputHemisferio)
			.on(this._inputHemisferio, 'keydown', this._handleKeypressUTM, this);
		
		
		let divButtonSearch = L.DomUtil.create('div', 'container-search', divCoordinates)
		let button = L.DomUtil.create('a', 'search-button btn btn-primary', divButtonSearch);
		button.innerHTML = 'Buscar';
		button.href = '#';
		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', this._handleUTMSubmit, this);
		
		
		return divCoordinates;
	},
	
	_createDivCoordinates: function(showlabel, decimals, textLatitud, textLongitud, container ){
		let divCoordinates = L.DomUtil.create('div', 'gotoXY-div', container );
		
		let step;
		if(decimals > 6){
			step = 0.000001 
		}else{
			for(step ='0'; step.length < decimals -1; step +='0'){
			}
			step = '0.'+step+'1';
		}
		
		let labelLat = null;
		if(showlabel){
			labelLat = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			labelLat.innerHTML  = textLatitud;
		}
		
		this._inputLatitud = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputLatitud.type = 'number';
		this._inputLatitud.size = this._inputCoordinatesMinSize;
		this._inputLatitud.max = 90;
		this._inputLatitud.min = -90;
		this._inputLatitud.step = step;
		if(labelLat == null){
			this._inputLatitud.placeholder = textLatitud;
			this._inputLatitud.title = textLatitud;
		}
			
		
		L.DomEvent
			.disableClickPropagation(this._inputLatitud)
			.on(this._inputLatitud, 'keydown', this._handleKeypress, this);
		
		let labelLng = null;
		if(showlabel){
			labelLng = L.DomUtil.create('label', 'gotoXY-label', divCoordinates);
			labelLng.innerHTML  = textLongitud;
		}
		
		this._inputLongitud = L.DomUtil.create('input', 'gotoXY-input', divCoordinates);
		this._inputLongitud.type = 'number';
		this._inputLongitud.size = this._inputCoordinatesMinSize;
		this._inputLongitud.max = 180;
		this._inputLongitud.min = -180;
		this._inputLongitud.step = step;
		if(labelLng == null){
			this._inputLongitud.placeholder = textLongitud;
			this._inputLongitud.title = textLongitud;
		}
			
		
		L.DomEvent
			.disableClickPropagation(this._inputLongitud)
			.on(this._inputLongitud, 'keydown', this._handleKeypress, this);
		
		let divButtonSearch = L.DomUtil.create('div', 'container-search', divCoordinates)
		let button = L.DomUtil.create('a', 'search-button btn btn-primary', divButtonSearch);
		button.innerHTML = 'Buscar';
		button.href = '#';
		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', this._handleSubmit, this);
		
		return divCoordinates;
	},
	
	
	
	close: function(){
		if(this._divGoToXY.style.display  ==  'block'){
			this._divGoToXY.style.display = 'none';
			this._button.style.display = 'block';
		}
		return this;
	},
	
	_activeGEO: function(){
		this._optionGeografica.className  = 'btn btn-primary btn-sm active';
		this.divSearchLatLng.style.display = 'block';
		this._optionUTM.className = 'btn btn-primary btn-sm notActive';
		this.divSearchUTM.style.display = 'none';
	},
	
	_activeUTM: function(){
		this._optionGeografica.className = 'btn btn-primary btn-sm notActive';
		this.divSearchLatLng.style.display = 'none';
		this._optionUTM.className = 'btn btn-primary btn-sm active';
		this.divSearchUTM.style.display = 'block';
	},
	
	_showSearch: function(){
		this._button.style.display = 'none';
		this._divGoToXY.style.display = 'block';
		this._inputLatitud.value = '';
		this._inputLongitud.value = '';
		return this;
	},
	
	_handleSubmit: function(){
		if(this._inputLatitud.value != '' &&  this._inputLongitud.value != '' 
			&& this._inputZoom.value != ''){
			
			if(this._inputLatitud.value <= 90 && this._inputLatitud.value >= -90){
				if(this._inputLongitud.value <= 180 && this._inputLongitud.value >= -180){
					let geom = Terraformer.WKT.parse("POINT ("+this._inputLongitud.value+" "+this._inputLatitud.value+")");
					this._drawMarker(geom, this._inputZoom.value, this._inputLongitud.value, this._inputLatitud.value );
				}else{
					this._showAlert();
				}
			}else{
				this._showAlert();
			}
			
			
			
		}
	},
	
	_handleUTMSubmit: function(){
		if(this._inputHemisferio.value != '' && this._inputZonNum.value != '' && this._inputNorthing.value != '' && this._inputEasting.value != ''){
			if(this._inputHemisferio.value == 'N' || this._inputHemisferio.value == 'S'){
				let southHemis = true;
				if(this._inputHemisferio.value == 'N'){
					southHemis = false;
				}
				let utm = L.utm(this._inputEasting.value, this._inputNorthing.value, this._inputZonNum.value,undefined, southHemis);
				let latlng = utm.latLng();
				if(latlng){
					let geom = Terraformer.WKT.parse("POINT ("+latlng.lng+" "+latlng.lat+")");
					this._drawMarker(geom, this._inputZoom.value, latlng.lng, latlng.lat );
				}else{
					this._showAlert();
				}
			}else{
				this._showAlert();
			}
			
		}else{
			this._showAlert();
		}
	},
	
	_handleKeypress: function(e){
		switch(e.keyCode){
			case 13://Enter
				this._handleSubmit();	//do search
				break;
		}
		
		return this;
	},
	
	_handleKeypressUTM: function(e){
		switch(e.keyCode){
			case 13://Enter
				this._handleUTMSubmit();	//do search
				break;
		}
	
		return this;
	},
	
	_showAlert: function(){
		alert("La coordenada ingresada se encuentran fuera de rango.");
	},
	
	_drawMarker: function(geojson, zoom, lng, lat){
		var self = this;
		this.currentSearchLayer = L.geoJSON(geojson).addTo(self._map);
		self._map.flyTo([lat, lng] , zoom);
		this._removeGeometry(this.currentSearchLayer);
		return self;
	},
	
	_removeGeometry: function(layer){
		var self = this;
		if(this.options.autoRemoveSarch){
			setTimeout(function(){ 
				try {
					self._map.removeLayer(layer);
				} catch (e) {
					console.log("Delete layer search error "+e);
				}
			}, this.options.autoRemoveSarchTime);
		}
	}
	
});

L.geodirGotoXY = function(options){
	return new L.GeodirGoToXY (options);
};