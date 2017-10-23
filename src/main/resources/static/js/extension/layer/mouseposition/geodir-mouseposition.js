L.Geodir_MousePosition = L.Control.extend({
	includes: L.Mixin.Events,
	options:{
		container: '',
		position: 'bottomleft',
		separator: ' ',
		emptyString: 'Unavailable',
		lngFirst: false,
		numDigits: 5,
		lngFormatter: undefined,
		latFormatter: undefined,
		prefix: "",
		optionDefault: 'GEO'
	},

	initialize: function(options) {
		L.Util.setOptions(this, options || {});
	},

	onAdd: function(map) {
		this._map = map;
		this._container = L.DomUtil.create('div','leaflet-control-mouseposition');
		this._divOptions = this._createDivOption(this._container);
		this._coordinates = this._createCoordinates(this._container);
		// L.DomEvent.disableClickPropagation(this._container);
		this._map.on('mousemove', this._onMouseMove, this);

		return this._container;
	},

	onRemove: function(map) {
		//map.off('mousemove', this._onMouseMove)
		console.log("onRemove");
	},

	addTo: function (map) {
		if(this.options.container) {
			this._container = this.onAdd(map);
			this._wrapper = L.DomUtil.get(this.options.container);
			this._wrapper.style.position = 'relative';
			this._wrapper.appendChild(this._container);
		} else
			L.Control.prototype.addTo.call(this, map);
		
		return this;
	},

	_onMouseMove: function(e) {
		var lng = this.options.lngFormatter ? this.options
				.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng,
				this.options.numDigits);
		var lat = this.options.latFormatter ? this.options
				.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat,
				this.options.numDigits);

		if (this.options.optionDefault == 'GEO') {
			var value = this.options.lngFirst ? 'X: ' + lng + this.options.separator
					+ 'Y: ' + lat : 'Y: ' + lat + this.options.separator + 'X: ' + lng;
			var prefixAndValue = this.options.prefix + ' ' + value;
			this._coordinates.innerHTML = '<b>' + prefixAndValue + '</b>';
		} else {
			let UTM = (L.latLng(lat, lng)).utm();
			let southHemi = UTM.southHemi;
			let hemisferio = '';
			if (southHemi == true) {
				hemisferio = 'S';
			} else {
				hemisferio = 'N';
			}
			let text = "E: " + UTM.x.toFixed(0) + this.options.separator + "N: " + UTM.y.toFixed(0)
				+ this.options.separator + UTM.zone + hemisferio;
			this._coordinates.innerHTML = '<b>' + text + '</b>';
		}

	},

	_createCoordinates: function(container) {
		let divCoordinates = L.DomUtil.create('div',
				'leaflet-control-mouseposition-text', container);
		divCoordinates.innerHTML = this.options.emptyString;
		return divCoordinates;
	},

	_createDivOption: function(container) {
		let divOptions = L.DomUtil.create('div', 'btn-group', container);
		this._optionGeografica = L.DomUtil.create('a',
				'btn btn-primary btn-sm btn_mouse active', divOptions);
		this._optionGeografica.style.cursor = "pointer";
		this._optionGeografica.innerHTML = 'GEO';

		L.DomEvent.on(this._optionGeografica, 'click', L.DomEvent.stop, this)
				.on(this._optionGeografica, 'click', this._change, this);

		this._optionUTM = L.DomUtil.create('a',
				'btn btn-primary btn-sm btn_mouse notActive');
		this._optionUTM.style.cursor = "pointer";
		this._optionUTM.innerHTML = '';

		L.DomEvent.on(this._optionUTM, 'click', L.DomEvent.stop, this).on(
				this._optionUTM, 'click', this._change, this);

		return divOptions;
	},

	_change : function() {
		if (this.options.optionDefault == 'GEO') {
			this._optionGeografica.className = 'btn btn-primary btn-sm btn_mouse notActive';
			this._optionUTM.className = 'btn btn-primary btn-sm btn_mouse active';
			this.options.optionDefault = 'UTM';
			this._optionGeografica.innerHTML = 'UTM';
		}
		else {
			this._optionGeografica.className = 'btn btn-primary btn-sm btn_mouse active';
			this._optionUTM.className = 'btn btn-primary btn-sm btn_mouse notActive';
			this.options.optionDefault = 'GEO';
			this._optionGeografica.innerHTML = 'GEO';
		}
		return this;
	}

/*	_activeGEO: function() {
		this._optionGeografica.className = 'btn btn-primary btn-sm active';
		this._optionUTM.className = 'btn btn-primary btn-sm notActive';
		this.options.optionDefault = 'GEO';
	},

	_activeUTM: function() {
		this._optionGeografica.className = 'btn btn-primary btn-sm notActive';
		this._optionUTM.className = 'btn btn-primary btn-sm active';
		this.options.optionDefault = 'UTM';
	},*/

});

L.geodirMousePosition = function(options) {
	return new L.Geodir_MousePosition (options);
};
