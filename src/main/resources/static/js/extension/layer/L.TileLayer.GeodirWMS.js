L.TileLayer.GeodirWMS = L.TileLayer.WMS.extend({
	
	initialize: function (url, options) {

		this._url = url;

		var wmsParams = L.extend({}, this.defaultWmsParams);
		// all keys that are not TileLayer options go to WMS params
		for (var i in options) {
			if (!(i in this.options)) {
				if (i === 'CQL_FILTER') {
					if (options[i]!=='') {
						wmsParams[i] = options[i];
					}
					continue;
				}
				if (i === 'sld') {
					if (options[i]) {
						wmsParams[i] = options[i];
					}
					continue;
				}
				wmsParams[i] = options[i];
			}
		}

		options = L.setOptions(this, options);

		wmsParams.width = wmsParams.height = options.tileSize * (options.detectRetina && L.Browser.retina ? 2 : 1);

		this.wmsParams = wmsParams;
	},
	onAdd : function(map) {
		L.TileLayer.WMS.prototype.onAdd.call(this, map);
	},
	onRemove : function(map) {
		L.TileLayer.WMS.prototype.onRemove.call(this, map);
	},
	
	getFeatureInfo : function(evt) {
		// Make an AJAX request to the server and hope for the best
		var url = this.getFeatureInfoUrl(evt.latlng), showResults = L.Util
				.bind(this.showGetFeatureInfo, this);
		this._map._container.style.cursor = 'wait';
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'JSONP',
			jsonpCallback : 'parseResponse',
			success : function(data, status, xhr) {
				var err = typeof data === 'string' ? null : data;
				showResults(err, evt.latlng, data);
			},
			error : function(xhr, status, error) {
				showResults(error);
			}
		});
	},
	getFeatureSimpleInfo : function(evt) {
		// Make an AJAX request to the server and hope for the best
		var url = this.getFeatureInfoUrl(evt.latlng), results = L.Util
				.bind(this.showGetFeatureSimpleInfo, this);
		//this._map._container.style.cursor = 'wait';
		$.ajax({
			url : url,
			type : 'GET',
			dataType : 'JSONP',
			jsonpCallback : 'parseResponse',
			success : function(data, status, xhr) {
				var err = typeof data === 'string' ? null : data;
				results(err, data);
			},
			error : function(xhr, status, error) {
				results(error);
			}
		});
	},
	onCreatePopupContent:function(props,popup_content){
		var popup_table = L.DomUtil.create('table','tblDatos',popup_content);	
		for (i in props) {
			var atributo=i;			
				msgForIn = props[i];
				var nombreAtributo = atributo;
				var valorAtributo = props[i] + "";
				var isurl = this.isUrlValidToputlink(valorAtributo);
				if (isurl) {
					popup_table.appendChild(this.totrTableUrl(nombreAtributo, valorAtributo));
				} else {
					valorAtributo = valorAtributo.replace("null", "");
					popup_table.appendChild(this.totrTable(nombreAtributo, valorAtributo));
			}
		}			
	},
	onShowSimpleInfo : function(){
		console.log("onShowSimpleInfo");
	},
	showGetFeatureInfo : function(err, latlng, content) {	
		var ubicaionpopup = "";
			
		var popupCarrousel = null;
		var popup_general = null;
		
		var popupRetorno ;

		var isshow = false;	
		var haveMoreOneFeature = false;
		
		if (typeof content === "undefined") {
			this._map._container.style.cursor = 'auto';
			return;
		}		
		//si tiene mas de un elemento
		if ( content.features.length > 1 ){
			console.log('tiene mas de un elemento');
			popupCarrousel = L.DomUtil.create( 'div','carousel slide'); 		
			popupCarrousel.setAttribute('data-ride', 'carousel');
			popupCarrousel.setAttribute('id', 'carouselSigvial');
			popupCarrousel.setAttribute('style', 'margin: 0px -20px; margin-right: -26px;');
			
			var carrouselIndicators = L.DomUtil.create( 'div','',popupCarrousel);
			carrouselIndicators.setAttribute('id', 'slidetext');
			carrouselIndicators.style='width:100%; height:20px; text-align:center; font-weight: bold;';
		    
			var carrouselPrincipal = L.DomUtil.create( 'div','carousel-inner',popupCarrousel)			
			carrouselPrincipal.setAttribute('role', 'listbox');
			carrouselPrincipal.setAttribute('id', 'carouselinner');
								
			var valuesymbolslider ;				
			valuesymbolslider = "<ol class=\"carousel-indicators\">";
						
			haveMoreOneFeature = true;	
			popupRetorno = popupCarrousel;
		}else{			
			console.log('tiene un elemento');
			popup_general = L.DomUtil.create('div','container' );
			var popup_content = L.DomUtil.create('div','form-group',popup_general); 
			var div_botones =  L.DomUtil.create('div', 'form-group',popup_general);					
						
			popup_general.style='max-width: 250px; overflow:auto; margin-top:15px';
			popupRetorno = popup_general;
		}			
		
		for (var i = 0; i < content.features.length; i++) {			
			//crear item para el carrousel								
			if(haveMoreOneFeature){
				//primer valor
				if(i==0){	
					var carrouselItem = L.DomUtil.create( 'div','carousel-item active',carrouselPrincipal );
					valuesymbolslider += "  <li data-target=\"#carouselSigvial\" data-slide-to=\"0\" class=\"active\"></li>  " 
				}else{
				//siguientes valores
					var carrouselItem = L.DomUtil.create( 'div','carousel-item',carrouselPrincipal );	
					valuesymbolslider += "  <li data-target=\"#carouselSigvial\" data-slide-to=\""+ i +"\" ></li>  "		
				}
				
				let numbberItem = i + 1;
				
				carrouselItem.id= "slide"+ numbberItem;				
			var popup_general = L.DomUtil.create('div','container' , carrouselItem );
			var popup_content = L.DomUtil.create('div','form-group',popup_general); 
			var div_botones =  L.DomUtil.create('div', 'form-group',popup_general);	
			//agregar estilos al slider
			
			popup_general.style='max-width: 250px; overflow:auto;padding: 5px 15px !important;';
			div_botones.setAttribute('style','margin-top: 10px');			
			}	
			
			let from = content.features[i];
			let pkLayer = from.properties[this.options.columnId];
			let infoValues = {};
			if (this.infoAlias) {
				for ( let name in this.infoAlias) {
					infoValues[this.infoAlias[name].aliasInfo] = from.properties[name+'_Alias'] || from.properties[name] || '';
					if (this.infoAlias[name].aliasInfo.indexOf("Fecha") != -1 && infoValues[this.infoAlias[name].aliasInfo] != null) {
						infoValues[this.infoAlias[name].aliasInfo] = infoValues[this.infoAlias[name].aliasInfo].substring(0, 10);
					}
				}
			} else {
				infoValues = from.properties;
			}
			try {
				if (content.features[i].geometry.type == "Point") {
					ubicaionpopup = L.latLng(content.features[i].geometry.coordinates[1],content.features[i].geometry.coordinates[0]);
				} else {
					ubicaionpopup = L.latLng(latlng);
				}
				
				this.onCreatePopupContent(infoValues,popup_content,div_botones, pkLayer);
				isshow = true;
			} catch (e) {
				isshow = false;
				console.log(e)
				return;
			}
			this.namegeometryatribute = from.geometry_name;
			
			//estilo para ambos slider y un elemento
			popup_content.style='max-height:208px; overflow:auto; margin-top:5px';					
			div_botones.align='right';				
			//break;		
		}
						
		valuesymbolslider += "</ol>";

		if (isshow) {
			L.popup({
				'maxWidth' : '500',
				'className' : 'custom-popup',
				'autoPan' : 'true'
			}).setLatLng(ubicaionpopup).setContent(popupRetorno)
					.openOn(this._map);		
			
			//estilo para slider
			if(haveMoreOneFeature){  
			$("#carouselinner").append(
					valuesymbolslider			
			);			
			$("#carouselinner").append(
				     "<a class=\"carousel-control-prev\" href=\"#carouselSigvial\" role=\"button\" data-slide=\"prev\"  > "
				   + "<span class=\"sigvial-icon-back_02\" aria-hidden=\"true\"></span> "
				   + "<span class=\"sr-only\">Previous</span> " 
				   + "</a> "
				   + "<a class=\"carousel-control-next\" href=\"#carouselSigvial\" role=\"button\" data-slide=\"next\"  > "
				   + "<span class=\"sigvial-icon-next-02\" aria-hidden=\"true\"></span> "
				   + "<span class=\"sr-only\">Next</span> "
				   + "</a>");
			}
			
			this._map._container.style.cursor = 'auto';	

		} else {
			this._map._container.style.cursor = 'auto';
		}
		
		
		var totalItems = $('.carousel-item').length;		
		var currentIndex = $('div.active').index() + 1;

		$('#slidetext').html(''+currentIndex+'/'+totalItems+'');
		
		$('.carousel').on('slide.bs.carousel', function(e) {
		    currentIndex = e.relatedTarget.id.replace("slide","");		    
		   $('#slidetext').html(''+currentIndex +'/'+totalItems+'');
		});
		
		
	
	},
	showGetFeatureSimpleInfo : function(err, content) {
		from = content.features[0];
		try {
			var table = this.wmsParams.layers;
			var columId = this.wmsParams.columnId;
			var fieldGeometry = from.geometry_name;
			var featureId = from.properties[this.wmsParams.columnId];
			var geoJson = from.geometry;
			this.onShowSimpleInfo(table, columId, featureId, fieldGeometry, geoJson);
		} catch (e) {
			console.log(e);
			return;
		}
		/*for (var i = 0; i < content.features.length; i++) {
			from = content.features[i];
			try {
				var table = this.wmsParams.layers;
				var columId = this.wmsParams.columnId;
				var fieldGeometry = from.geometry_name;
				var featureId = from.properties[this.wmsParams.columnId];
				var geoJson = from.geometry;
				this.onShowSimpleInfo(table, columId, featureId, fieldGeometry, geoJson);
			} catch (e) {
				console.log(e);
				return;
			}
		}*/
		
	},
	totrTable : function(nombreAtributo, valorAtributo) {
		var tr =  L.DomUtil.create('tr','');
		var td =  L.DomUtil.create('td','',tr);
		var divAtributo =  L.DomUtil.create('div','atributo',td);
		divAtributo.innerHTML=nombreAtributo;
	  //var tdValor =  L.DomUtil.create('td','',tr);
		var divvalor =  L.DomUtil.create('div','valor',td);
		divvalor.innerHTML=valorAtributo;
		return tr;
	},
	
	totrTableUrl : function(nombreAtributo, valorAtributo) {
		var tr =  L.DomUtil.create('tr','');
		var td =  L.DomUtil.create('td','',tr);
		var divAtributo =  L.DomUtil.create('div','atributo',td);
		divAtributo.innerHTML=nombreAtributo;
	  //var tdValor =  L.DomUtil.create('td','',tr);
		var divvalor =  L.DomUtil.create('div','valor',td);
		var a =  L.DomUtil.create('a','',divvalor);
		a.href=valorAtributo;
		a.target="_blank"
		return tr;
	},
	
	isUrlValidToputlink : function(userInput) {
		var res = userInput
				.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
		if (res == null)
			return false;
		else
			return true;
	},
	
	getFeatureInfoUrl : function(latlng) {
		var columnID = this.options.columnId || 'id';
		// Construct a GetFeatureInfo request URL given a point
		var point = this._map.latLngToContainerPoint(latlng, this._map
				.getZoom()), size = this._map.getSize(), params = {
			request : 'GetFeatureInfo',
			service : 'WMS',
			srs : 'EPSG:4326',
			styles : this.wmsParams.styles,
			//sld : this.wmsParams.sld,
			transparent : this.wmsParams.transparent,
			version : this.wmsParams.version,
			format : this.wmsParams.format,
			bbox : this._map.getBounds().toBBoxString(),
			height : size.y,
			'FEATURE_COUNT' : 10,
			width : size.x,
			layers : this.wmsParams.layers,
			query_layers : this.wmsParams.layers,
			info_format : 'text/javascript',
			'EXCEPTIONS' : 'application/vnd.ogc.se_xml',
		};
		if (typeof this.wmsParams.CQL_FILTER === 'undefined'
				|| this.wmsParams.CQL_FILTER == null) {
			delete params.CQL_FILTER;
		} else {
			params.CQL_FILTER = this.wmsParams.CQL_FILTER;
		}
		if (typeof this.wmsParams.sld === 'undefined'
				|| this.wmsParams.sld == null) {
			delete params.sld;
		} else {
			params.sld = this.wmsParams.sld;
		}
		idModificado = columnID ;
		if (typeof this.infopersonailzado === 'undefined'
				|| this.infopersonailzado == null
				|| this.infopersonailzado == "") {
			delete params.propertyName;
		} else {
			params.propertyName = this.infopersonailzado + ',geometria';
			if (!params.propertyName.includes(idModificado)) {
				params.propertyName = this.infopersonailzado + ',geometria,'
				+ idModificado;
			}
		}
		params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
		params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
		return this._url + L.Util.getParamString(params, this._url, true);
	},

	disableInfo : function() {
		if (this.activeshowinfo) {
			this._map.off('click', this.getFeatureInfo, this);
			this.activeshowinfo = false;
		}
		
	},
	enableInfo : function(customCreatePopupContent) {
		if (customCreatePopupContent!=null) {
			this.onCreatePopupContent=customCreatePopupContent;
		}
		this._map.on('click', this.getFeatureInfo, this);
		this.activeshowinfo= true;
	},
	updateInfoAlias:function(_infoAlias,_showImage){
		this.infoAlias = _infoAlias;
		this.showImage = _showImage;
	},
	disableSimpleInfo : function() {
		if (this.activeshowsimpleinfo) {
			this._map.off('click', this.getFeatureSimpleInfo, this);
			this.activeshowsimpleinfo = false;
		}
		
	},
	enableSimpleInfo : function(customShowSimpleInfo) {
		this.onShowSimpleInfo = customShowSimpleInfo;
		this._map.on('click', this.getFeatureSimpleInfo, this);
		this.activeshowsimpleinfo = true;
	},
	setfiltro : function(filto) {
		if (filto == "") {
			delete this.wmsParams.CQL_FILTER;
		} else {
			this.wmsParams.CQL_FILTER = filto;
		}
	},
	setStyle : function(sld) {
		if (sld == "") {
			delete this.wmsParams.sld;
		} else {
			this.wmsParams.sld = sld;
		}
	},
	updateMapaStyle : function() {
		this.wmsParams.nikolasParam = Math.random();
		this.redraw();
	},
});

L.tileLayer.geodirWMS = function(url, options) {
	return new L.TileLayer.GeodirWMS(url, options);
};