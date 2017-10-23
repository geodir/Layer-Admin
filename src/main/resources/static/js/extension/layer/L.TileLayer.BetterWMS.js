Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd = this.getDate().toString();
	return yyyy + '/' + (mm[1] ? mm : "0" + mm[0]) + '/'
			+ (dd[1] ? dd : "0" + dd[0]); // padding
};

function encode_utf8(s) {
	  return unescape(encodeURIComponent(s));
	}


L.Control.WMSLegend = L.Control
		.extend({
			url : '',
			options : {
				position : 'bottomright',
			},
			leyendascpas : {},
			img : {},
			defauldparams : {
				nombredysplay : 'leyenda',
				tipotematico : '',
				columnatematico : '',
				request : 'GetLegendGraphic',
				service : 'WMS',
				width : 20,
				heigth : 20,
				version : '1.0.0',
				format : 'image/png',
				SLD_VERSION : '1.0.0',
				LEGEND_OPTIONS : "fontName:'myFirstFont';fontStyle:bold;fontAntiAliasing:true;fontColor:0x000000;fontSize:10;bgColor:0x000000"
			},
			initialize : function(url, options) {

			},

			onAdd : function() {

				var contenedor = L.DomUtil.create('div', 'resizediv');

				if (!L.Browser.touch) {
					L.DomEvent.disableClickPropagation(contenedor)
							.disableScrollPropagation(contenedor);
				} else {
					L.DomEvent.on(contenedor, 'click',
							L.DomEvent.stopPropagation);
				}

				this.contenido = L.DomUtil.create('div', 'leyendas');
				var controlClassName = 'legend', legendClassName = 'legend', stop = L.DomEvent.stopPropagation;
				this.container = L.DomUtil.create('div', controlClassName);

				this.container.appendChild(this.contenido);
				contenedor.appendChild(this.container);
				contenedor.onmouseover = deshabilitar(this._map);
				contenedor.onmouseout = habilitar(this._map);
				return contenedor;
			},
			addLeyenda : function(capawms) {
				var contenido = this.leyendascpas[capawms.namelayer] = L.DomUtil
						.create('div', 'legendContenido', this.contenido);
				var titulo = L.DomUtil.create('div', 'legendTitulo', contenido);
				titulo.innerHTML = ('' + capawms.namelayer + '');
				this.defauldparams.tipotematico = capawms.tipotematico;
				var params = {
					request : this.defauldparams.request,
					service : this.defauldparams.service,
					SLD_VERSION : this.defauldparams.SLD_VERSION,
					transparent : capawms.wmsParams.transparent,
					
					version : this.defauldparams.version,
					format : this.defauldparams.format,
					layer : capawms.wmsParams.layers,
					nikolasParam : Math.random(),
					WIDTH : this.defauldparams.width,
					HEIGHT : this.defauldparams.heigth,
					LEGEND_OPTIONS : this.defauldparams.LEGEND_OPTIONS,
				};

				if (capawms.wmsParams.sld != undefined) {
					params.sld =capawms.wmsParams.sld;
				}
				// var src = capawms._url+ L.Util.getParamString(params,
				// capawms._url, true);

				var src = null;
				var divimage = L.DomUtil.create('div', 'legendaggrafico',
						contenido);
				this.img[capawms.namelayer] = L.DomUtil.create('img',
						'legendContenido', divimage);
				this.img[capawms.namelayer].style.margin = '5px';
				if (capawms.tipotematico == 'heatmap') {
					var base_url = window.location.origin;
					src = base_url
							+ '/geodirapp/javax.faces.resource/tematicos/punto/image_heatmap_leyend.png.jsf?ln=images';
					this.img[capawms.namelayer].style.display = 'block';
				} else if (capawms.tipotematico == 'cluster') {
					this.img[capawms.namelayer].style.display = 'none';
				} else if (capawms.tipotematico == 'simple') {
					src = capawms._url
							+ L.Util.getParamString(params, capawms._url, true);
					this.img[capawms.namelayer].style.margin = 'auto';
				} else {
					src = capawms._url
							+ L.Util.getParamString(params, capawms._url, true);
					this.img[capawms.namelayer].style.display = 'block';
				}

				this.img[capawms.namelayer].src = src;
			},
			removeLeyenda : function(capawms) {
				this.contenido
						.removeChild(this.leyendascpas[capawms.namelayer]);
			},
			updateLeyendaCapa : function(capawms) {
				var params = {
					request : this.defauldparams.request,
					service : this.defauldparams.service,
					SLD_VERSION : this.defauldparams.SLD_VERSION,
					transparent : capawms.wmsParams.transparent,
					version : this.defauldparams.version,
					format : this.defauldparams.format,
					layer : capawms.wmsParams.layers,
					nikolasParam : Math.random(),
					WIDTH : this.defauldparams.width,
					HEIGHT : this.defauldparams.heigth,
					LEGEND_OPTIONS : this.defauldparams.LEGEND_OPTIONS,
				};
				if (capawms.wmsParams.sld != undefined) {
					params.sld =capawms.wmsParams.sld;
				}
				var src = null;
				this.img[capawms.namelayer].style.margin = '5px';
				if (capawms.tipotematico == 'heatmap') {
					var base_url = window.location.origin;
					src = base_url
							+ '/geodirapp/javax.faces.resource/tematicos/punto/image_heatmap_leyend.png.jsf?ln=images';
					this.img[capawms.namelayer].style.display = 'block';
				} else if (capawms.tipotematico == 'cluster') {
					this.img[capawms.namelayer].style.display = 'none';
				} else if (capawms.tipotematico == 'simple') {
					src = capawms._url
							+ L.Util.getParamString(params, capawms._url, true);
					this.img[capawms.namelayer].style.margin = 'auto';
				} else {
					src = capawms._url
							+ L.Util.getParamString(params, capawms._url, true);
					this.img[capawms.namelayer].style.display = 'block';

				}
				this.img[capawms.namelayer].src = src;
			},
			updateLegeda : function() {
				this.img.style.display = '';
				this.titulo.innerHTML = '';
				if (this.defauldparams.tipotematico == "categoria") {
					this.titulo.innerHTML = ('<h5>'
							+ this.defauldparams.nombredysplay
							+ '</h5><h5 class="columna">('
							+ this.defauldparams.columnatematico + ')</h5>');
				} else {
					this.titulo.innerHTML = ('<h5>'
							+ this.defauldparams.nombredysplay + '</h5>');

				}

				var params = {
					request : this.defauldparams.request,
					service : this.defauldparams.service,
					SLD_VERSION : this.defauldparams.SLD_VERSION,
					// SLD: this.wmsParams.sld,
					transparent : this.wmsParams.transparent,
					version : this.defauldparams.version,
					format : this.defauldparams.format,
					layer : this.wmsParams.layers,
					nikolasParam : Math.random(),
					WIDTH : this.defauldparams.width,
					HEIGHT : this.defauldparams.heigth,
					LEGEND_OPTIONS : this.defauldparams.LEGEND_OPTIONS,
				};

				if (this.defauldparams.tipotematico == 'heatmap') {
					var base_url = window.location.origin;
					this.img.src = base_url
							+ '/sigutapp/javax.faces.resource/tematicos/punto/image_heatmap_leyend.png.jsf?ln=images';

				} else {
					if (this.defauldparams.tipotematico == 'cluster') {
						this.img.style.display = 'none';
					} else {
						this.img.src = this._url
								+ L.Util
										.getParamString(params, this._url, true);
					}
				}

			},
		});

L.wmsLegend = function(url, uri) {
	return wmsLegendControl = new L.Control.WMSLegend(url, uri);
};

L.TileLayer.BetterWMS = L.TileLayer.WMS
		.extend({
			leyendageosam : null,
			namelayer : '',
			_tiles : {},

			initialize : function(url, options) { // (String, Object)
				this.options.editable = options.editable;
				this._url = url;

				var wmsParams = L.extend({}, this.defaultWmsParams), tileSize = options.tileSize
						|| this.options.tileSize;

				if (options.detectRetina && L.Browser.retina) {
					wmsParams.width = wmsParams.height = tileSize * 2;
				} else {
					wmsParams.width = wmsParams.height = tileSize;
				}
				for ( var i in options) {
					// all keys that are not TileLayer options go to WMS params
					if (!this.options.hasOwnProperty(i) && i !== 'crs') {
						if (options[i]=='') {
						}else {
							wmsParams[i] = options[i];
						}
					}
				}

				this.wmsParams = wmsParams;

				this._bounds = L.latLngBounds(null);

				L.setOptions(this, options);
			},
			onAdd : function(map) {
				// Triggered when the layer is added to a map.
				// Register a click listener, then do all the upstream WMS
				// things
				if (map.hasOwnProperty('legendapanel')) {
					map.legendapanel.addLeyenda(this);
				}

				this.namelayer = this.options.legendparam.nombredysplay;

				if (this.options.tiled) {
					this._crs = this.options.crs || map.options.crs;

					this._wmsVersion = parseFloat(this.wmsParams.version);

					var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
					this.wmsParams[projectionKey] = this._crs.code;

					this._map = map;
					this._animated = map._zoomAnimated;

					// create a container div for tiles
					this._initContainerTiled();

					// set up events
					map.on({
						'viewreset' : this._reset,
						'moveend' : this._update
					}, this);

					if (this._animated) {
						map.on({
							'zoomanim' : this._animateZoom,
							'zoomend' : this._endZoomAnim
						}, this);
					}

//					if (!this.options.updateWhenIdle) {
//						this._limitedUpdate = L.Util.limitExecByInterval(
//								this._update, 150, this);
//						map.on('move', this._limitedUpdate, this);
//					}

					this._reset();
					this._update();

					this.addEventsTile();
				} else {
					var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs'
							: 'srs';
					// this.wmsParams[projectionKey] = 'EPSG:4326'; // this is
					// incorrect!
					this.wmsParams[projectionKey] = map.options.crs.code;
					this._map = map;
					this._animated = map._zoomAnimated;
					this._initContainerTiled();

					if (!this._image) {
						this._initImage();
					}
					this._tileContainer.appendChild(this._image);

					this.addEventsSimpleTile();
				}

			},
			onRemove : function(map) {
				L.TileLayer.WMS.prototype.onRemove.call(this, map);
				map.off('click', this.getFeatureInfo, this);
				if (map.hasOwnProperty('legendapanel')) {
					map.legendapanel.removeLeyenda(this);
				}
				if (this.wmsParams["tiled"] == false) {
					map.off('viewreset', this._resetSimple, this);
					if (map.options.zoomAnimation && L.Browser.any3d) {
						map.off('zoomanim', this._animateZoomSingleTile, this);
					}
					map.off('moveend', this._updateImageUrl, this);
				} else {

					// this._container.parentNode.removeChild(this._container);

					map.off({
						'viewreset' : this._reset,
						'moveend' : this._update
					}, this);

					if (this._animated) {
						map.off({
							'zoomanim' : this._animateZoom,
							'zoomend' : this._endZoomAnim
						}, this);
					}
				}
			},
			_initContainerTiled : function() {
				var tilePane = this._map._panes.tilePane;

				if (!this._container) {
					this._container = L.DomUtil.create('div', 'leaflet-layer');

					this._updateZIndex();

					if (this._animated) {
						var className = 'leaflet-tile-container';

						this._bgBuffer = L.DomUtil.create('div', className,
								this._container);
						this._tileContainer = L.DomUtil.create('div',
								className, this._container);

					} else {
						this._tileContainer = this._container;
					}

					tilePane.appendChild(this._container);

					if (this.options.opacity < 1) {
						this._updateOpacity();
					}
				}
			},
			_reloadContainerTiled : function() {
				this._container.innerHTML = '';
				if (this._animated) {
					var className = 'leaflet-tile-container';

					this._bgBuffer = L.DomUtil.create('div', className,
							this._container);
					this._tileContainer = L.DomUtil.create('div', className,
							this._container);

				} else {
					this._tileContainer = this._container;
				}

				if (this.options.opacity < 1) {
					this._updateOpacity();
				}
			},

			addEventsTile : function() {
				// var map = this._map;
				// map.on('click', this.getFeatureInfo, this);
			},

			addEventsSimpleTile : function() {
				var map = this._map;
				map.on('viewreset', this._resetSimple, this);
				if (map.options.zoomAnimation && L.Browser.any3d) {
					map.on('zoomanim', this._animateZoomSingleTile, this);
				}
				this._resetSimple();
				//
				this._updateImageUrl;
				map.on('moveend', this._updateImageUrl, this);
			},

			/* METODOS DE IMAGEOVERLAY */

			_animateZoomSingleTile : function(e) {
				var map = this._map, image = this._image, scale = map
						.getZoomScale(e.zoom), nw = this._bounds.getNorthWest(), se = this._bounds
						.getSouthEast(),

				topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center), size = map
						._latLngToNewLayerPoint(se, e.zoom, e.center)
						._subtract(topLeft), origin = topLeft._add(size
						._multiplyBy((1 / 2) * (1 - 1 / scale)));

				image.style[L.DomUtil.TRANSFORM] = L.DomUtil
						.getTranslateString(origin)
						+ ' scale(' + scale + ') ';
			},

			_resetSimple : function() {
				var image = this._image, topLeft = this._map
						.latLngToLayerPoint(this._bounds.getNorthWest()), size = this._map
						.latLngToLayerPoint(this._bounds.getSouthEast())
						._subtract(topLeft);

				L.DomUtil.setPosition(image, topLeft);

				image.style.width = size.x + 'px';
				image.style.height = size.y + 'px';
			},

			_clear : function(e) {
				for ( var key in this._tiles) {
					this.fire('tileunload', {
						tile : this._tiles[key]
					});
				}

				this._tiles = {};
				this._tilesToLoad = 0;

				if (this.options.reuseTiles) {
					this._unusedTiles = [];
				}

				this._tileContainer.innerHTML = '';

				if (this._animated && e && e.hard) {
					this._clearBgBuffer();
				}
			},

			_reset : function(e) {
				for ( var key in this._tiles) {
					this.fire('tileunload', {
						tile : this._tiles[key]
					});
				}

				this._tiles = {};
				this._tilesToLoad = 0;

				if (this.options.reuseTiles) {
					this._unusedTiles = [];
				}

				this._tileContainer.innerHTML = '';

				if (this._animated && e && e.hard) {
					this._clearBgBuffer();
				}

				this._initContainerTiled();
			},

			redraw : function() {
				this._updateImageUrl();
			},

			_initImage : function() {
				this._image = L.DomUtil.create('img', 'leaflet-image-layer');

				if (this._map.options.zoomAnimation && L.Browser.any3d) {
					L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
				} else {
					L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
				}

				this._updateOpacity();
				this._bounds = this._map.getBounds();

				// TODO createImage util method to remove duplication
				L.extend(this._image, {
					galleryimg : 'no',
					onselectstart : L.Util.falseFn,
					onmousemove : L.Util.falseFn,
					onload : L.bind(this._onImageLoad, this),
					src : this._constructUrl()
				});
			},

			_onImageLoad : function() {
				this._bounds = this._map.getBounds();
				this._resetSimple();
				this.fire('load');
			},

			_updateImageUrl : function() {
				this._image.src = this._constructUrl();
				// this._tileContainer.appendChild(this._image);
			},

			_constructUrl : function() {
				var size = this._map.getSize();
				var b = this._map.getBounds();
				var map = this._map;
				this._crs = map.options.crs;
				var nw = this._crs.project(map.getBounds().getNorthWest()), se = this._crs
						.project(map.getBounds().getSouthEast()), bbox = this._wmsVersion >= 1.3
						&& this._crs === L.CRS.EPSG4326 ? [ se.y, nw.x, nw.y,
						se.x ].join(',') : [ nw.x, se.y, se.x, nw.y ].join(',');
				delete this.wmsParams.width;
				delete this.wmsParams.height;
				return this._url
						+ L.Util.getParamString(this.wmsParams, this._url)
						+ "&width=" + size.x + "&height=" + size.y + "&bbox="
						+ bbox;// b.toBBoxString();
			},

			/** *********************************************************************************************************** */

			getFeatureInfoAlerta : function(coordenadas) {
				// Make an AJAX request to the server and hope for the best

				var url = this.getFeatureInfoUrl(coordenadas), showResultsAlerta = L.Util
						.bind(this.showGetFeatureInfo, this);
				
				console.log('BETTERWMS ingresa a getfeatureinfo');
				console.log(url);
				this._map._container.style.cursor = 'wait';
				$.ajax({
					url : url,
					type : 'GET',
					dataType : 'JSONP',
					jsonpCallback : 'parseResponse',
					success : function(data, status, xhr) {
						var err = typeof data === 'string' ? null : data;
						showResultsAlerta(err, coordenadas, data);
					},
					error : function(xhr, status, error) {
						showResultsAlerta(error);
					}
				});
			},
			
			
			getFeatureInfo : function(evt) {
				// Make an AJAX request to the server and hope for the best
				var url = this.getFeatureInfoUrl(evt.latlng), showResults = L.Util
						.bind(this.showGetFeatureInfo, this);
				
				console.log('BETTERWMS ingresa a getfeatureinfo');
				console.log(url);
				console.log(evt.latlng);
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
			

			getFeatureInfoUrl : function(latlng) {
				// Construct a GetFeatureInfo request URL given a point
				console.log('BETTERWMS ingresa a getfeatureinfoURL');
				
				var point = this._map.latLngToContainerPoint(latlng, this._map
						.getZoom()), size = this._map.getSize(), params = {
					request : 'GetFeatureInfo',
					service : 'WMS',
					srs : 'EPSG:4326',
					styles : this.wmsParams.styles,
					sld : this.wmsParams.sld,
					transparent : this.wmsParams.transparent,
					version : this.wmsParams.version,
					format : this.wmsParams.format,
					bbox : this._map.getBounds().toBBoxString(),
					height : size.y,
					'FEATURE_COUNT' : 50,
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
				
				
				idModificado=this.columna_pk;
				console.log("IDDDD: "+idModificado);

				if (typeof this.infopersonailzado === 'undefined'
						|| this.infopersonailzado == null
						|| this.infopersonailzado == "") {
					delete params.propertyName;
				} else {
					params.propertyName = this.infopersonailzado + ',geometria';

					
					if (params.propertyName.includes(idModificado)) {

					} else {e
						params.propertyName = this.infopersonailzado
								+ ',geometria,'+idModificado;
					}
				}

				params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
				params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

				return this._url
						+ L.Util.getParamString(params, this._url, true);
			},

			changeTileToSimple : function(isTiled) {
				var map = this._map;
				var _istile;
				if (isTiled) {
					_istile = true;
				} else {
					_istile = false;
				}
				if (this.options.tiled == _istile) {
				} else {
					this._tiles = {};
					this._clear();
					if (_istile) {
						map.off('viewreset', this._resetSimple, this);
						if (map.options.zoomAnimation && L.Browser.any3d) {
							map.off('zoomanim', this._animateZoomSingleTile,
									this);
						}
						map.off('moveend', this._updateImageUrl, this);

						this._crs = this.options.crs || map.options.crs;

						this._wmsVersion = parseFloat(this.wmsParams.version);

						var projectionKey = this._wmsVersion >= 1.3 ? 'crs'
								: 'srs';
						this.wmsParams[projectionKey] = this._crs.code;

						this._map = map;
						this._animated = map._zoomAnimated;

						// create a container div for tiles
						this._initContainerTiled();

						// set up events
						map.on({
							'viewreset' : this._reset,
							'moveend' : this._update
						}, this);

						if (this._animated) {
							map.on({
								'zoomanim' : this._animateZoom,
								'zoomend' : this._endZoomAnim
							}, this);
						}

						if (!this.options.updateWhenIdle) {
							this._limitedUpdate = L.Util.limitExecByInterval(
									this._update, 150, this);
							map.on('move', this._limitedUpdate, this);
						}

						this._reset();
						this._update();

						this.addEventsTile();
					} else {

						// this._container.parentNode.removeChild(this._container);

						map.off({
							'viewreset' : this._reset,
							'moveend' : this._update
						}, this);

						if (this._animated) {
							map.off({
								'zoomanim' : this._animateZoom,
								'zoomend' : this._endZoomAnim
							}, this);
						}

						if (!this.options.updateWhenIdle) {
							map.off('move', this._limitedUpdate, this);
						}
						var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs'
								: 'srs';
						// this.wmsParams[projectionKey] = 'EPSG:4326'; // this
						// is
						// incorrect!
						this.wmsParams[projectionKey] = map.options.crs.code;
						this._map = map;
						this._animated = map._zoomAnimated;
						this._reloadContainerTiled();

						if (!this._image) {
							this._initImage();
						}
						this._tileContainer.appendChild(this._image);

						this.addEventsSimpleTile();
					}

				}
				this.options.tiled = _istile;
				this.updateMapastyle();
			},

			updateMapastyle : function() {
				if (this._map.hasOwnProperty('legendapanel')) {
					this._map.legendapanel.updateLeyendaCapa(this);
				}
				this.wmsParams.nikolasParam = Math.random();
				// this.leyendageosam.updateLegeda();
				if (this.options.tiled) {
					this._reset();
					this._update();
				} else {
					this._resetSimple();
					this._updateImageUrl();
				}

			},

			setfiltro : function(filto) {
				if (filto == "") {
					delete this.wmsParams.CQL_FILTER;
				} else {
					this.wmsParams.CQL_FILTER = filto;
				}
			},

			showGetFeatureInfo : function(err, latlng, content) {
				var ubicaionpopup = "";
				var htmlPopUp = "";
				var popup_general = L.DomUtil.create('div','');
				var popup_content = L.DomUtil.create('div','',popup_general);
				var isshow = false;
				if (typeof content === "undefined") {
					this._map._container.style.cursor = 'auto';
					return;
				}

				for (var i = 0; i < content.features.length; i++) {
					from = content.features[i];
					
					try {
						if (content.features[i].geometry.type == "Point") {
							ubicaionpopup = L
									.latLng(
											content.features[i].geometry.coordinates[1],
											content.features[i].geometry.coordinates[0]);
						} else {
							ubicaionpopup = L.latLng(latlng);
						}

						isshow = true;
					} catch (e) {
						isshow = false;
						return "";
					}
					this.namegeometryatribute = from.geometry_name;
					popup_content.style='width: 280px; max-height:200px; overflow:auto;';
					
					var popup_table = L.DomUtil.create('table','tblDatos',popup_content);
				

					
					for (i in from.properties) {
						var atributo=i;
						if (this.columnalias.hasOwnProperty(i)) {
							atributo = this.columnalias[i].columnaAlias;
							msgForIn = from.properties[i];
							var nombreAtributo = atributo;
							var valorAtributo = from.properties[i] + "";
							var isurl = this.isUrlValidToputlink(valorAtributo);
							
							if (isurl) {
								popup_table.appendChild(this.totrTableUrl(nombreAtributo, valorAtributo));
							} else {
								valorAtributo = valorAtributo.replace("null", "");
								popup_table.appendChild(this.totrTable(nombreAtributo, valorAtributo));
							}
						}
					}
					
					break;
				}
				
				var divisor_botones = L.DomUtil.create('hr', '',popup_general);
				divisor_botones.style ='margin-top: 5px;margin-bottom: 5px;border-top: 1.5px solid #AFAFAF; width: 95%;';
//				<hr style='margin-top: 5px;margin-bottom: 5px;border-top: 1.5px solid #AFAFAF; width: 95%;'/>
				var div_botones =  L.DomUtil.create('div', '',popup_general);
				div_botones.align='right';
				
				//BOTON TOMAR FOTO
//				var btn_editar = L.DomUtil.create('button', '',div_botones);
//				btn_editar.setAttribute('coorx',ubicaionpopup.lat);
//				btn_editar.setAttribute('coory',ubicaionpopup.lng);
//				btn_editar.setAttribute('idfeature',from.properties[idModificado]);
//				btn_editar.setAttribute('layers',this.wmsParams.layers);
//				btn_editar.setAttribute('namelayer',this.namelayer);
//				btn_editar.style='color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;';
//				btn_editar.setAttribute('onClick','startToEditParameters(this);');
//				btn_editar.title='Editar atributos';
//				var img_editar = L.DomUtil.create('img', '',btn_editar);
//				img_editar.src='resources/images/iconPanelAtributos/editar_atributos.png';
				
				//BOTON EDITAR
				var btn_editar = L.DomUtil.create('button', 'stylebtnMinifichaEdicion',div_botones);
				btn_editar.setAttribute('coorx',ubicaionpopup.lat);
				btn_editar.setAttribute('coory',ubicaionpopup.lng);
				btn_editar.setAttribute('idfeature',from.properties[idModificado]);
				btn_editar.setAttribute('layers',this.wmsParams.layers);
				btn_editar.setAttribute('namelayer',this.namelayer);
				btn_editar.setAttribute('onClick','startToEditParameters(this);');
				btn_editar.title='Editar atributos';
				var img_editar = L.DomUtil.create('img', '',btn_editar);
				img_editar.src='resources/images/iconPanelAtributos/editar_atributos.png';
				
				//EDICION GEOMETRIA
				var btn_editar_geometria = L.DomUtil.create('button', 'stylebtnMinificha',div_botones);
				btn_editar_geometria.setAttribute('coorx',ubicaionpopup.lat);
				btn_editar_geometria.setAttribute('coory',ubicaionpopup.lng);
				btn_editar_geometria.setAttribute('idfeature',from.properties[idModificado]);
				btn_editar_geometria.setAttribute('layers',this.wmsParams.layers);
				btn_editar_geometria.setAttribute('namelayer',this.namelayer);
				btn_editar_geometria.setAttribute('onClick','startToEdit(this);');
				btn_editar_geometria.title='Mover';
				var img_editar_geometria = L.DomUtil.create('img', '',btn_editar_geometria);
				img_editar_geometria.src='resources/images/iconPanelAtributos/editar_geometria.png';
				
				//ADICION DOCUMENTO
				var btn_add_doc = L.DomUtil.create('button', 'stylebtnMinificha',div_botones);
				btn_add_doc.setAttribute('coorx',ubicaionpopup.lat);
				btn_add_doc.setAttribute('coory',ubicaionpopup.lng);
				btn_add_doc.setAttribute('idfeature',from.properties[idModificado]);
				btn_add_doc.setAttribute('layers',this.wmsParams.layers);
				btn_add_doc.setAttribute('namelayer',this.namelayer);
				btn_add_doc.setAttribute('onClick','startAdjuntarDocumento(this);');
				btn_add_doc.title='Archivos adjuntos';
				var img_add_doc = L.DomUtil.create('img', '',btn_add_doc);
				img_add_doc.src='resources/images/iconPanelAtributos/archivos_adjuntos.png';
				
				
				console.log('VALORES PROPERTIRS');
				console.log(this.namelayer);
				console.log(from.properties);
				
				/*if(this.namelayer.includes("AreaAfectada")){
					//AREA AFECTADA
					var btn_area_afectada = L.DomUtil.create('button', 'stylebtnMinificha',div_botones);
					btn_area_afectada.setAttribute('pkMemoriaDescriptiva',from.properties['FK_eMemoriaDescriptivaAA']);
					btn_area_afectada.setAttribute('idfeature',from.properties[idModificado]);
					btn_area_afectada.setAttribute('layers',this.wmsParams.layers);
					btn_area_afectada.setAttribute('namelayer',this.namelayer);
					btn_area_afectada.setAttribute('onClick','startFichaMemoriaDescriptiva(this);');
					btn_area_afectada.title='Ficha memoria descriptiva';
					var img_area_afectada = L.DomUtil.create('img', '',btn_area_afectada);
					img_area_afectada.src='resources/images/iconPanelAtributos/fichascap.png';
				}*/
				
				if (this.namelayer.includes("Puente")) {
					//SCAP
					var btn_scap = L.DomUtil.create('button', 'stylebtnMinificha',div_botones);
					btn_scap.setAttribute('idfeature',from.properties[idModificado]);
					btn_scap.setAttribute('layers',this.wmsParams.layers);
					btn_scap.setAttribute('namelayer',this.namelayer);
					btn_scap.setAttribute('onClick','startFichaScap(this);');
					btn_scap.title='Ficha Scap';
					var img_btn_scap = L.DomUtil.create('img', '',btn_scap);
					img_btn_scap.src='resources/images/iconPanelAtributos/fichascap.png';				
				}
				
				if (this.namelayer.includes("Emergencia")) {
					var btn_emergencia = L.DomUtil.create('button', 'stylebtnMinificha',div_botones);
					btn_emergencia.setAttribute('idfeature',from.properties[idModificado]);
					btn_emergencia.setAttribute('layers',this.wmsParams.layers);
					btn_emergencia.setAttribute('namelayer',this.namelayer);
					btn_emergencia.setAttribute('onClick','startFichaEmergencia(this);');
					btn_emergencia.title='Ficha Emergencia';
					var img_btn_emergencia = L.DomUtil.create('img', '',btn_emergencia);
					img_btn_emergencia.src='resources/images/iconPanelAtributos/fichascap.png';
					
					
					var btn_emergencia = L.DomUtil.create('button', 'stylebtnMinificha',div_botones);
					btn_emergencia.setAttribute('idfeature',from.properties[idModificado]);
					btn_emergencia.setAttribute('layers',this.wmsParams.layers);
					btn_emergencia.setAttribute('namelayer',this.namelayer);
					btn_emergencia.setAttribute('onClick','copyEmergency(this);');
					btn_emergencia.title='COPIAR';
					var img_btn_emergencia = L.DomUtil.create('img', '',btn_emergencia);
					img_btn_emergencia.src='resources/images/iconPanelAtributos/copiar.png';
								
				} 
				
				if (isshow) {
					L.popup({
						'maxWidth' : '800',
						'className' : 'custom-popup',
						'autoPan' : 'true'
					}).setLatLng(ubicaionpopup).setContent(popup_general)
							.openOn(this._map);
					this._map._container.style.cursor = 'auto';
					//this.validarstreetview(ubicaionpopup, htmlPopUp);
				} else {
					this._map._container.style.cursor = 'auto';
				}

			},

			
			validarstreetview : function(ubicacion, contenido) {
				var map = this._map;
				var ubicaionpopup = ubicacion;
				var namelayer = this.namelayer;
				var layers = this.wmsParams.layers;
				var retorno = {};
				retorno.status = false;
				retorno.editable = this.options.editable;
				this.incrementarRangoStreetView(20, ubicacion, retorno,
						contenido, this);
			},
			
			incrementarRangoStreetView : function(rango, ubicacion, _retorno,
					_contenido, obj) {
				var _obj = obj;
				var contenido = _contenido;
				var retorno = _retorno;
				retorno.stado=true;
				var namelayer = obj.namelayer;
				if (retorno.stado) {
					var map = obj._map;
					//var namelayer = obj.namelayer;
					var layers = obj.wmsParams.layers;
					
					var popupContent = "<div style='width: 280px; max-height:160px; overflow:auto;'>  <table class='tblDatos'  >"
							+ contenido
							+ "</table>   </div><hr style='margin-top: 5px;margin-bottom: 5px;border-top: 1.5px solid #AFAFAF; width: 95%;'/>";
					popupContent += "<div align='right'>";
					
					if (retorno.stadoStreet) {
						popupContent += "";
					}
					
					console.log('MAP');
					console.log(map);

					console.log('VALORES PROPERTIRS');
					console.log(namelayer);
					console.log(from.properties);
									
					
					if (retorno.editable) {
						popupContent +="<button coorx='"
						+ ubicacion.lat
						+ "' coory='"
						+ ubicacion.lng
						+ "' idfeature='"
						+ from.properties[idModificado]
						+ "'  layers='"
						+ layers
						+ "'  namelayer='"
						+ namelayer
						+ "'  style='display: #{mbProyectoSigVial.obtenerVisibilidadOpcion('EDICION')} ; color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;' onClick='startToEditParameters(this);' title='Editar atributos'><img src='resources/images/iconPanelAtributos/editar_atributos.png'/></button> ";					
					}
					
					if (retorno.editable) {

						popupContent += "<button coorx='"
								+ ubicacion.lat
								+ "' coory='"
								+ ubicacion.lng
								+ "' idfeature='"
								+ from.properties[idModificado+""]
								+ "'  layers='"
								+ layers
								+ "'  namelayer='"
								+ namelayer
								+ "'  style='color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;' onClick='startToEdit(this);' title='Mover'><img src='resources/images/iconPanelAtributos/editar_geometria.png'/></button> "
								+ "<button idfeature='"+from.properties[idModificado+""]
								+ "'  layers='"
								+ layers
								+ "'  namelayer='"
								+ namelayer
								+"' onClick='startAdjuntarDocumento(this);' style='color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;' title='Archivos adjuntos'><img src='resources/images/iconPanelAtributos/archivos_adjuntos.png'/></button>";
					}
					
					/*if(namelayer=='AreaAfectada'){
						popupContent += "<button idfeature='"+from.properties[idModificado+""]
						+ "'  pkMemoriaDescriptiva='"+ from.properties['FK_eMemoriaDescriptivaAA']
						+ "'  layers='"
						+ layers
						+ "'  namelayer='"
						+ namelayer
						+"' onClick='startFichaMemoriaDescriptiva(this);' style='color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;' title='Ficha memoria descriptiva'><img src='resources/images/iconPanelAtributos/fichascap.png'/></button>";								
					}*/
					
					if (namelayer=='Puente') {
						popupContent += "<button idfeature='"+from.properties[idModificado+""]
						+ "'  layers='"
						+ layers
						+ "'  namelayer='"
						+ namelayer
						+"' onClick='startFichaScap(this);' style='color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;' title='Ficha Scap'><img src='resources/images/iconPanelAtributos/fichascap.png'/></button>";
		
					}

					if (namelayer==''){
						popupContent += "<button idfeature='"+from.properties[idModificado+""]
						+ "'  layers='"
						+ layers
						+ "'  namelayer='"
						+ namelayer
						+"' onClick='startFichaEmergencia(this);' style='color: #45e986;font-weight: bold;font-size:13px;cursor: pointer;text-align: center; margin: 5px 0px;background: white;border-color: #EEEEEE;' title='Ficha Scap'><img src='resources/images/iconPanelAtributos/fichascap.png'/></button>";
		
					}
					
					popupContent += "<div>";
					L.popup({
						'maxWidth' : '800',
						'className' : 'custom-popup',
						'autoPan' : 'true'
					}).setLatLng(ubicacion).setContent(popupContent)
							.openOn(map);
					map._container.style.cursor = 'auto';
					return;
				}
				retorno.ubicacionIn = ubicacion;
				var ubicacionGoogle = new google.maps.LatLng(ubicacion.lat,
						ubicacion.lng);
				var markerGoogle = new google.maps.Marker({
					position : ubicacionGoogle
				});
				var _ubicacion = ubicacion;
				var service = new google.maps.StreetViewService();
				
				service.getPanoramaByLocation(markerGoogle.getPosition(),
						rango, function(result, status) {
							if (status == google.maps.StreetViewStatus.OK) {
								visibleStreetView = true;
								retorno.lugar = result.location.latLng
										.toString();
								retorno.stado = true;
								retorno.stadoStreet = true;
								_obj.incrementarRangoStreetView(rango,
										_ubicacion, retorno, contenido, _obj);
							} else {
								if (rango > 70) {
									retorno.stado = true;
									retorno.stadoStreet = false;
								}
								rango += 20;
								_obj.incrementarRangoStreetView(rango,
										_ubicacion, retorno, contenido, _obj);
							}
						});
				// }

			},
			totrTable : function(nombreAtributo, valorAtributo) {
				var tr =  L.DomUtil.create('tr','');
				var td =  L.DomUtil.create('td','',tr);
				var divAtributo =  L.DomUtil.create('div','',td);
				divAtributo.innerHTML=nombreAtributo;
				var tdValor =  L.DomUtil.create('td','',tr);
				var divvalor =  L.DomUtil.create('div','',tdValor);
				divvalor.innerHTML=valorAtributo;
				return tr;
			},
			totrTableUrl : function(nombreAtributo, valorAtributo) {
				var tr =  L.DomUtil.create('tr','');
				var td =  L.DomUtil.create('td','',tr);
				var divAtributo =  L.DomUtil.create('div','',td);
				divAtributo.innerHTML=nombreAtributo;
				var tdValor =  L.DomUtil.create('td','',tr);
				var divvalor =  L.DomUtil.create('div','',tdValor);
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
			
			disableminificha : function() {
				console.log("deshabilitar minificha");
				this._map.off('click', this.getFeatureInfo, this);
			},
			
			enableminificha : function() {
				console.log("habilitar minificha");
				this._map.on('click', this.getFeatureInfo, this);
			},

		});

L.tileLayer.betterWms = function(url, options) {
	return new L.TileLayer.BetterWMS(url, options);
};

var editMarcador;
function startToEdit(ev) {
	var coory = ev.getAttribute("coory");
	var coorx = ev.getAttribute("coorx");
	var id = ev.getAttribute("idfeature");
	var layer = ev.getAttribute("layers");
	var nameLayer = ev.getAttribute("namelayer");
	
	try {
		editMarcador.onCancelEdicion();
	} catch (e) {
		// TODO: handle exception
	}
	editMarcador = new L.editmarker({
		lat : coory,
		lng : coorx,
		id : id,
		layer : layer,
		nameLayer : nameLayer
	}).addTo(leaflet.map);
}

function startToEditParameters(ev){
	var id = ev.getAttribute("idfeature");
	var nameLayer = ev.getAttribute("namelayer").trim();
	nameLayer = nameLayer.replace("SigLev_VW_", "").replace("Linea","").replace("Punto","").replace("Poligono","").replace(" ","");
	var namebutton = "frmPageLevantamiento:btn" + nameLayer;
	
	console.log('nombre boton');
	console.log(namebutton);
	
	ejecutarAccesoPaginaEditar(
			function(){
				console.log("nombre del boton " + namebutton);
		document.getElementById(namebutton).click();
				
		var layer = ev.getAttribute("layers");
		var nameLayer = ev.getAttribute("namelayer");
	} , id  );
}


function startFichaScap(ev){
	var id=ev.getAttribute("idfeature");
	document.getElementById("frmPageLevantamiento:valuePKEditar").value=id;	
	rcIniciarScap();
}


function startFichaEmergencia(ev){
	
	console.log('Nueva emergencia');
	var id=ev.getAttribute("idfeature");
	document.getElementById("frmPageLevantamiento:valuePKEditar").value=id;	
	console.info('pk emergencia: ' + id);	
	rcIniciarDiarioEmergenciaNuevo();
	
//	if (pkEmergencia == 'null') {
//		console.log('Nueva memoria Descriptiva');
//		rcIniciarDiarioEmergenciaNuevo();
//	} else {
//		console.log('Edicion memoria Descriptiva');
//		document.getElementById("frmPageLevantamiento:valuePKEditar").value = pkEmergencia;
//		rcIniciarDiarioEmergencia();
//	}
}


function copyEmergency(ev){
	console.log('copiar emergencia');
	var id=ev.getAttribute("idfeature");
	document.getElementById("frmPageLevantamiento:valuePKEditarEmergencia").value=id;	
	console.info('pk emergencia: ' + id);	
	rcCrearCopia();
	
}

function startFichaMemoriaDescriptiva(ev) {
	var pkMDescriptiva = ev.getAttribute("pkMemoriaDescriptiva");
	console.info('pk Memoria Descriptiva: ' + pkMDescriptiva);

	if (pkMDescriptiva == 'null') {
		console.log('Nueva memoria Descriptiva');
		rcIniciarMemoriaDescriptivaNuevo();
	} else {
		console.log('Edicion memoria Descriptiva');
		document.getElementById("frmPageLevantamiento:valuePKEditar").value = pkMDescriptiva;
		rcIniciarMemoriaDescriptiva();
	}
}


function ejecutarAccesoPaginaEditar(callback , id){

	document.getElementById("frmPageLevantamiento:valuePKEditar").value = id;
	console.log("id " + id);
	console.log("despues ejecutar funcion");
	callback();
}


function startAdjuntarDocumento(ev){
	var id = ev.getAttribute("idfeature");
	var nameLayer = ev.getAttribute("namelayer");
	document.getElementById("frmPageLevantamiento:txtIdObjeto").value=id;
	document.getElementById("frmPageLevantamiento:txtNombreTabla").value=nameLayer;
	rcActualizarFeature();
}


L.EditMarker = L.Control
		.extend({
			options : {
				// topright, topleft, bottomleft, bottomright
				position : 'topright',
				placeholder : 'Search...'
			},
			capaeditar: null,
			nodos: null,
			centronodo: null,
			marker : null,
			geometriasToEdit : null,
			latlng : null,
			nodos : null,
			initialize : function(options) {
				L.Util.setOptions(this, options);
				this.capaeditar = this.options.nameLayer;
				var marcador = this.marker;
			},
			onAdd : function(map) {
				var componente = this;
				var options = this.options;
				var mapa = this._map = map;

				this._map.closePopup();
				var container = L.DomUtil.create('div', 'search-container');
				this.form = L.DomUtil.create('form', 'form', container);
				var group = L.DomUtil.create('div', 'form-group', this.form);
				this.input = L.DomUtil.create('input', 'waves-effect waves-light btn', group);
				this.input.type = 'button';
				this.input.value = 'Aceptar';
				L.DomEvent.on(this.input, 'click', this.onAceptarEdicion, this);
				this.cancel = L.DomUtil.create('input', 'waves-effect waves-light btn', group);
				this.cancel.type = 'button';
				this.cancel.value = 'Cancelar';
				L.DomEvent.on(this.cancel, 'click', this.onCancelEdicion, this);
				this.results = L.DomUtil.create('div', 'list-group', group);
				L.DomEvent.addListener(this.form, 'submit', this.submit, this);
				L.DomEvent.disableClickPropagation(container);
				this._controlUI = container;
				
				var containerbtnpopup = L.DomUtil.create('div',
						'search-container', container);
				this.formbtnpopup = L.DomUtil.create('form', 'form',
						containerbtnpopup);
				var groupbtnpopup = L.DomUtil.create('div', 'form-group',
						this.formbtnpopup);
				
				this.popupNodos = L.DomUtil.create('input', 'waves-effect waves-light btn',
						groupbtnpopup);
				this.popupNodos.type = 'button';
				this.popupNodos.value = 'Nodos';
				L.DomEvent.on(this.popupNodos, 'click', this.onOpenPopupNodos, this);

				var base_url = window.location.origin;
				var idregistro = this.options.id;
				var schematabla = this.options.layer;
				var printgeometry = L.Util.bind(this.onPrintGeometry, this);
				var listnodos=  L.Util.bind(this.onListNodos, this);
				var namegeometry = this.nameGeometry =  leaflet.capasproyecto[this.capaeditar].namegeometryatribute;
//				leaflet.capasproyecto[this.capaeditar].nameGeometry=this.nameGeometry;
				$.ajax({										
					url : base_url + '/sigvialweb/rest/json/sigvial/geometria?id='
							+ idregistro + '&table=' + schematabla + '&columna_geometria=' + namegeometry,
					type : 'GET',
					dataType : 'JSON',
					jsonpCallback : 'parseResponse',
					success : function(data, status, xhr) {
						var err = typeof data === 'string' ? null : data;
						console.log( base_url + '/sigvialweb/rest/json/sigvial/geometria?id='
								+ idregistro + '&table=' + schematabla + '&columna_geometria=' + namegeometry);
						console.log(idregistro);
						console.log(schematabla);
						console.log(data);
						printgeometry(err, data);
						listnodos(err, data);
					},
					error : function(xhr, status, error) {
						printgeometry(error);
					}
				});
			
				return container;
			},
			
			onListNodos : function(err, content) {
				var featuretype = this.fetureType = content.type;
				
				this.nodos = "";
				
			switch (featuretype) {
			case "Point":
				var array = [];
				array.push(content.coordinates);
				this.nodos = array;
				break;
				
			case "Polygon":
				this.nodos = content.coordinates[0];
				
				break;
				
			case "LineString":
				this.nodos = content.coordinates;
				break;

			default:
				break;
			}
			},
			
			onPrintGeometry : function(err, content) {              
				var mapa = this._map;
				var options = this.options;
				var featureGroup = this.geometriasToEdit = L.featureGroup()
						.addTo(mapa);

				console.log(content);
				
				var featuretype = this.fetureType = content.type;

				switch(featuretype) {
				case 'MultiPolygon': case 'MultiLineString':
						content.coordinates.forEach(function(
								shapeCoords, i) {
							var polygon = {
								type : "Polygon",
								coordinates : shapeCoords
							};
							L.geoJson(polygon, {
							      onEachFeature: function (feature, layer) {
							    	  var _editable= null;
							    	  _editable = layer.addTo(mapa);
							    	  _editable.snapediting = new L.Handler.PolylineSnap(mapa, _editable,{snapDistance: 1});
							    	  _editable.snapediting.addGuideLayer(_editable);
							    	  _editable.snapediting.enable();
							    	  //editablesfinal.push(_editable);
							    	 
							    	  featureGroup.addLayer(_editable);
							      }
							 });
	
						});
					break;
				case 'Polygon': case 'LineString':
					L.geoJson(content, {
					      onEachFeature: function (feature, layer) {
					    	  var _editable= null;
					    	  _editable = layer.addTo(mapa);
					    	  _editable.snapediting = new L.Handler.PolylineSnap(mapa, _editable,{snapDistance: 1});
					    	  _editable.snapediting.addGuideLayer(_editable);
					    	  _editable.snapediting.enable();
					    	  featureGroup.addLayer(_editable);
					      }
					 });	
			        break;
			    case 'Point':
			    	L.geoJson(content, {
			    		
					      onEachFeature: function (feature, layer) {
					    	  var _editable= null;
					    	  layer.setIcon(L.icon(
					    			  	{
											iconUrl : 'javax.faces.resource/images/default_marker.png.jsf?ln=leaflet',
											iconSize : [ 22,22 ],
										}));
					    	  _editable = layer.addTo(mapa);
					    	  _editable.snapediting = new L.Handler.MarkerSnap(mapa, _editable,{snapDistance: 1});
					    	  _editable.snapediting.addGuideLayer(_editable);
					    	  _editable.snapediting.enable();
					    	  featureGroup.addLayer(_editable);
					      }
					 });
			    	break;
			   
			}
			if (featuretype=='MultiPolygon') {
				
			}
			
//			this.capaeditar.setOpacity(0.5);
			leaflet.capasproyecto[this.options.nameLayer].setOpacity(0.5);
			
			},
			
			
			obtenerfina : function() {
				this.latlng = this.marker.getLatLng();
			},
			onOpenPopupNodos : function() {
			
				var componente = this;
				componente.nodos_ediados = [];
				var table = document.getElementById("myTable");
				var elementoDiv = document.getElementById("divbtn");
				var nro = 0;

				table.innerHTML = "";
				elementoDiv.innerHTML = "";
				
					for ( var _nod in componente.nodos) {
						nro++;
						var _nodo_edicion = [];
						var _fila = L.DomUtil.create('tr', '', table);
						_fila.setAttribute("id-indexnodo", _nod);
					
						var _col_id = L.DomUtil.create('td', '', _fila);
						var _col_x = L.DomUtil.create('td', '', _fila);
						var _col_y = L.DomUtil.create('td', '', _fila);
						var _col_boton = L.DomUtil.create('td', '', _fila);

						var _id = L.DomUtil.create('input', 'inputNodoid center-align', _col_id);
						_id.value = nro;
						_id.disabled = true;
						
						var _coordenaX = L.DomUtil.create('input', 'inputNodo',	_col_x);
						_coordenaX.type = "text";
						_coordenaX.value = componente.nodos[_nod][1];
						_nodo_edicion.push(_coordenaX);
						
						var _coordenaY = L.DomUtil.create('input', 'inputNodo',	_col_y);
						_coordenaY.type = "text";
						_coordenaY.value = componente.nodos[_nod][0];
						_nodo_edicion.push(_coordenaY);

						componente.nodos_ediados.push(_nodo_edicion);
						
						L.DomEvent.addListener(_fila, 'click',	componente.onCentrarPunto, componente);
					}

				if (!componente.hasOwnProperty("_boton")) {
					console.log("no hay boton");
					componente._boton = L.DomUtil.create('input', 'waves-effect waves-light btn center-align',
							elementoDiv);
					componente._boton.type = "button";
					componente._boton.value = "Guardar";

					L.DomEvent.on(componente._boton, 'click', this.onChange,
							componente);
				}else{
					console.log("hay boton");
					L.DomEvent.on(componente._boton, 'click', this.onChange,
							componente);
				}		
				
				PF('dlg1').show();

			},
			
			onCentrarPunto : function(e) {
				var _trSle4ccionado = e.path[1];
				var num= _trSle4ccionado.getAttribute("id-indexnodo");
				var componente = this;
				if (componente.centroNodo == null) {
					componente.centroNodo = L.circle([componente.nodos_ediados[num][0].value,componente.nodos_ediados[num][1].value], 15,
							{
								color : 'red',
								weight : 1,
								opacity : 0.5,
								dashArray : '4 2'
							}).addTo(leaflet.map);
				} else {
					componente.centroNodo.setLatLng([componente.nodos_ediados[num][0].value,componente.nodos_ediados[num][1].value]);
				}
				
			},
			
			onChange : function() {
				
				var componente = this;
				componente.coordenadaseditadas = [];

				var latlng = L.latLng(
						componente.nodos_ediados[0][0].value,
						componente.nodos_ediados[0][1].value);
				
				componente.coordenadaeditadapunto =  latlng;

//				
//				if (componente.nodos_ediados.length == 1) {  
//					
//				}
				
//				for ( var _nod in componente.nodos_ediados) {
//					var latlng = L.latLng(
//							componente.nodos_ediados[_nod][0].value,
//							componente.nodos_ediados[_nod][1].value);
//					componente.coordenadaseditadas.push(latlng);
//				}				
				
				componente.geometriasToEdit.getLayers()[0].setLatLng(componente.coordenadaeditadapunto);			
				
				
				
			},
			
			
			onCancelEdicion : function() {

				this.geometriasToEdit.eachLayer(function(layer){
						layer.snapediting.disable();
				});		
				leaflet.capasproyecto[this.options.nameLayer].setOpacity(1);
				try {
					this._map.removeLayer(this.geometriasToEdit);
					this._map.removeLayer(this.centroNodo);
				} catch (e) {
					console.log(e);
				}
								
				this._map.removeControl(this);
				
				
				PF('dlg1').hide();
				
			},
			onAceptarEdicion : function() {
				
				var datapost = {};
				datapost.tipo = this.fetureType;
				var componente = this;
				datapost.geometrias = [];
				datapost.idGeometria = this.options.id;
				datapost.nameGeometry = this.nameGeometry;
				
				var nombretabla = [];
				nombretabla = this.options.layer.split(":");			
				datapost.schematable = nombretabla[1];	

				this.geometriasToEdit.eachLayer(function(layer) {
					layer.snapediting.disable();
					datapost.geometrias.push(componente.toWKT(layer));
				});

//				var host = window.location.host;
//				var wkt = this.toWKT(this.marker);
//				var idregistro = this.options.id;
//				var schematabla = this.options.layer;				
				var showResults = L.Util.bind(this.showGetFeatureInfo, this);
				var base_url = window.location.origin;

				$.ajax({
					url : base_url + '/sigvialweb/rest/json/sigvial/post',
					type : "POST",
					data : JSON.stringify(datapost),
					contentType : "application/json",
					dataType : "json",
					success : function(data, status, xhr) {
						var err = typeof data === 'string' ? null : data;
						showResults(err, data);
					},
					error : function(xhr, status, error) {
						showResults(error);
					}
				});
				
//				$.ajax({
//					url : base_url + '/sigvialweb/rest/json/sigvial/update?wkt='
//							+ wkt + '&id=' + idregistro + '&table='
//							+ schematabla,
//					type : 'GET',
//					dataType : 'JSONP',
//					jsonpCallback : 'parseResponse',
//					success : function(data, status, xhr) {
//						var err = typeof data === 'string' ? null : data;
//						showResults(err, data);
//					},
//					error : function(xhr, status, error) {
//						showResults(error);
//					}
//				});
				leaflet.capasproyecto[this.options.nameLayer].setOpacity(1);
				// evento guarda cambios
//				this._map.removeLayer(this.marker);
//				this._map.removeControl(this);
				
				
				
				PF('dlg1').hide();
				
				
			},
			showGetFeatureInfo : function(err, content) {
//				if (content.state == 1) {
					leaflet.capasproyecto[this.options.nameLayer].updateMapastyle();
					this.onCancelEdicion();
//					} else {
//					alert('a ocurrido un error al actualizar la ubicacion del punto...');
//				}

			},
			submit : function(e) {
				L.DomEvent.preventDefault(e);
			},

			toWKT : function(layer) {
				if (layer instanceof L.Circle) {
					return "CIRCLE(" + layer.getLatLng().lng + " "
							+ layer.getLatLng().lat + "," + layer.getRadius()
							+ ")";
				} else {
					var lng = 0, lat = 0, coords = [];
					if (layer instanceof L.Polygon
							|| layer instanceof L.Polyline) {
						var latlngs = layer.getLatLngs();
						for (var i = 0; i < latlngs.length; i++) {
							latlngs[i];
							coords.push(latlngs[i].lng + " " + latlngs[i].lat);
							if (i === 0) {
								lng = latlngs[i].lng;
								lat = latlngs[i].lat;
							}
						}
						;
						if (layer instanceof L.Polygon) {
							return "POLYGON((" + coords.join(",") + "," + lng
									+ " " + lat + "))";
						} else if (layer instanceof L.Polyline) {
							return "LINESTRING(" + coords.join(",") + ")";
						}
					} else if (layer instanceof L.Marker) {
						return "POINT(" + layer.getLatLng().lng + " "
								+ layer.getLatLng().lat + ")";
					}
				}
			}
		});

L.editmarker = function(options) {
	return new L.EditMarker(options);
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

var atributosOcultos;
function obtenerAtributosOcultos(nombreAtributo) {
	var encontrado = false;
	var jsonCapasCompleto = JSON.parse(document
			.getElementById("formGeodirListcapas:txtJsonCapasCompleto").value);
	CAPAS_GEODIR_TM = jsonCapasCompleto.GEODIR_TM;

	for ( var capa in CAPAS_GEODIR_TM) {
		var infoCapa = CAPAS_GEODIR_TM[capa];
		if (infoCapa["ACTIVO_INFO"] == true) {
			try {
				atributosOcultos = infoCapa["ATRIBUTOS_OCULTOS"];
				var res = atributosOcultos.split(" ");

				for (h = 0; h < res.length; h++) {
					if (nombreAtributo == res[h]) {
						encontrado = true;
					}
				}
			} catch (e) {
				console.log("Error en agregar habilitar minificha " + e);
			}
		} else {
		}
	}
	if (encontrado) {
		return true;
	} else {
		return false;
	}
}

function deshabilitar(__map) {
	__map.dragging.disable();
	__map.touchZoom.disable();
	__map.doubleClickZoom.disable();
	__map.scrollWheelZoom.disable();
};

function habilitar(__map) {
	__map.dragging.enable();
	__map.touchZoom.enable();
	__map.doubleClickZoom.enable();
	__map.scrollWheelZoom.enable();
};

L.SingleTile = L.ImageOverlay
		.extend({
			defaultWmsParams : {
				service : 'WMS',
				request : 'GetMap',
				version : '1.1.1',
				layers : '',
				styles : '',
				format : 'image/png',
				transparent : true

			},

			initialize : function(url, options) {
				this.defaultWmsParams.layers = options.layers;
				this.defaultWmsParams.sld = options.sld;
				this.wmsParams = L.extend({}, this.defaultWmsParams);
				L.ImageOverlay.prototype.initialize.call(this, url, null,
						options);

			},

			setParams : function(params) {
				L.extend(this.wmsParams, params);
				return this;
			},

			redraw : function() {
				this._updateImageUrl();
			},

			onAdd : function(map) {
				var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs'
						: 'srs';
				// this.wmsParams[projectionKey] = 'EPSG:4326'; // this is
				// incorrect!
				this.wmsParams[projectionKey] = map.options.crs.code;
				L.ImageOverlay.prototype.onAdd.call(this, map);
				map.on('moveend', this._updateImageUrl, this);
			},

			onRemove : function(map) {
				map.on('moveend', this._updateImageUrl, this);
				L.ImageOverlay.prototype.onRemove.call(this, map);
			},

			// Copypasted from L.ImageOverlay (dirty hack)
			_initImage : function() {
				this._image = L.DomUtil.create('img', 'leaflet-image-layer');

				if (this._map.options.zoomAnimation && L.Browser.any3d) {
					L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
				} else {
					L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
				}

				this._updateOpacity();
				this._bounds = this._map.getBounds();

				// TODO createImage util method to remove duplication
				L.extend(this._image, {
					galleryimg : 'no',
					onselectstart : L.Util.falseFn,
					onmousemove : L.Util.falseFn,
					onload : L.bind(this._onImageLoad, this),
					src : this._constructUrl()
				});
			},

			_onImageLoad : function() {
				this._bounds = this._map.getBounds();
				this._reset();
				this.fire('load');
			},

			_updateImageUrl : function() {
				this._image.src = this._constructUrl();
			},

			_constructUrl : function() {
				var size = this._map.getSize();
				var b = this._map.getBounds();
				var map = this._map;
				this._crs = map.options.crs;
				var nw = this._crs.project(map.getBounds().getNorthWest()), se = this._crs
						.project(map.getBounds().getSouthEast()), bbox = this._wmsVersion >= 1.3
						&& this._crs === L.CRS.EPSG4326 ? [ se.y, nw.x, nw.y,
						se.x ].join(',') : [ nw.x, se.y, se.x, nw.y ].join(',');
				return this._url
						+ L.Util.getParamString(this.wmsParams, this._url)
						+ "&width=" + size.x + "&height=" + size.y + "&bbox="
						+ bbox;// b.toBBoxString();
			}
		});

L.singleTile = function(url, options) {
	return new L.SingleTile(url, options);
};

//
//
// L.TileLayer.SimpleWMS = L.TileLayer.WMS.extend({
// defaultWmsParams: {
// service: 'WMS',
// request: 'GetMap',
// version: '1.1.1',
// layers: '',
// styles: '',
// format: 'image/png',
// transparent: true
//		
// },
// /*
// initialize: function( url, options ) {
// this.defaultWmsParams.layers=options.layers;
// this.defaultWmsParams.sld=options.sld;
// this.wmsParams = L.extend({}, this.defaultWmsParams);
// L.ImageOverlay.prototype.initialize.call(this, url, null, options);
//
// },
// */
// setParams: function (params) {
// L.extend(this.wmsParams, params);
// return this;
// },
//
// redraw: function () {
// this._updateImageUrl();
// },
//
// onAdd: function (map) {
// /*
// var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' :
// 'srs';
// //this.wmsParams[projectionKey] = 'EPSG:4326'; // this is incorrect!
// this.wmsParams[projectionKey] = map.options.crs.code;
// L.ImageOverlay.prototype.onAdd.call(this, map);
// */
// this._crs = this.options.crs || map.options.crs;
//
// this._wmsVersion = parseFloat(this.wmsParams.version);
//
// var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
// this.wmsParams[projectionKey] = this._crs.code;
//
// L.TileLayer.prototype.onAdd.call(this, map);
// //map.on('moveend', this._updateImageUrl, this);
// },
// /*
// onRemove: function (map) {
// map.on('moveend', this._updateImageUrl, this);
// L.ImageOverlay.prototype.onRemove.call(this, map);
// },
//
// // Copypasted from L.ImageOverlay (dirty hack)
// _initImage: function () {
// this._image = L.DomUtil.create('img', 'leaflet-image-layer');
//
// if (this._map.options.zoomAnimation && L.Browser.any3d) {
// L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
// } else {
// L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
// }
//
// this._updateOpacity();
// this._bounds = this._map.getBounds();
//
// //TODO createImage util method to remove duplication
// L.extend(this._image, {
// galleryimg: 'no',
// onselectstart: L.Util.falseFn,
// onmousemove: L.Util.falseFn,
// onload: L.bind(this._onImageLoad, this),
// src: this._constructUrl()
// });
// },
//
// _onImageLoad: function () {
// this._bounds = this._map.getBounds();
// this._reset();
// this.fire('load');
// },
//
// _updateImageUrl: function () {
// this._image.src = this._constructUrl();
// },
//
// _constructUrl: function () {
// var size = this._map.getSize();
// var b = this._map.getBounds();
// var map = this._map;
// this.wmsParams.width=size.x ;
// this.wmsParams.height=size.y ;
// this._crs = map.options.crs;
// var
// nw = this._crs.project(map.getBounds().getNorthWest()),
// se = this._crs.project(map.getBounds().getSouthEast()),
// bbox = this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
// [se.y, nw.x, nw.y, se.x].join(',') :
// [nw.x, se.y, se.x, nw.y].join(',');
// return this._url + L.Util.getParamString(this.wmsParams, this._url) +
// "&bbox=" + bbox;//b.toBBoxString();
// }*/
// });
//
// L.tileLayer.simpleWMS = function (url, options) {
// return new L.TileLayer.SimpleWMS(url, options);
// };

function mostarStreetView(ev) {

	var box = document.getElementById('pano');
	// document.getElementById('closeStreetView').style.display='';
	box.style.display = '';
	var coordenadas = ev.getAttribute("coordenadas");
	coordenadas = coordenadas.replace('(', '{"lat":');
	coordenadas = coordenadas.replace(')', '}');
	coordenadas = coordenadas.replace(',', ',"lng":');
	var coorJson = JSON.parse(coordenadas);
	var panoramaOptions = {
		position : coorJson,
		pov : {
			heading : 34,
			pitch : 10
		},
		zoom : 1
	};

	panorama = new google.maps.StreetViewPanorama(box, panoramaOptions);

	PF('dlgMapStreetView').show();
}
