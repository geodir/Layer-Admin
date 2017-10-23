(function() {
	L.Control.Geodir = L.Control
			.extend({
				_createButton : function(name, container, action, _this) {
					var text = this.options[name + 'Text'] || '';
					var imageClass = this.options[name + 'Image'] || '';
					var tooltip = this.options[name + 'Tooltip'] || '';
					var button = L.DomUtil.create('a', 'history-' + name
							+ '-button', container);
					if (imageClass) {
						var imageElement = '<i class="' + imageClass + '"></i>';
						if (this.options[name + 'ImageBeforeText']) {
							text = imageElement + ' ' + text;
						} else {
							text += ' ' + imageElement;
						}
					}
					button.innerHTML = text;
					button.href = '#';
					button.title = tooltip;

					var stop = L.DomEvent.stopPropagation;

					L.DomEvent.on(button, 'click', stop)
					.on(button,'mousedown', stop)
					.on(button, 'dblclick', stop)
					.on(button, 'click', L.DomEvent.preventDefault)
					.on(button, 'click', action, _this)
					.on(button, 'click', this._refocusOnMap, _this);
					return button;
				},
				_cancelControlActions:function(){
					let
					instance1 = GeodirLayerAdmin.getInstance(GEODIR);
					instance1.cancelControlActions();
				},
				_cancelAction:function(){
					console.log("cancelando por defecto");
				},
				toWKT : function(layer) {
					if (layer instanceof L.Circle) {
						return "CIRCLE(" + layer.getLatLng().lng + " "
								+ layer.getLatLng().lat + ","
								+ layer.getRadius() + ")";
					} else {
						var lng = 0, lat = 0, coords = [];
						if (layer instanceof L.Polygon
								|| layer instanceof L.Polyline) {
							var latlngs = layer.getLatLngs();
							for (var i = 0; i < latlngs.length; i++) {
								latlngs[i];
								coords.push(latlngs[i].lng + " "
										+ latlngs[i].lat);
								if (i === 0) {
									lng = latlngs[i].lng;
									lat = latlngs[i].lat;
								}
							}
							;
							if (layer instanceof L.Polygon) {
								return "POLYGON((" + coords.join(",") + ","
										+ lng + " " + lat + "))";
							} else if (layer instanceof L.Polyline) {
								return "LINESTRING(" + coords.join(",") + ")";
							}
						} else if (layer instanceof L.Marker) {
							return "POINT(" + layer.getLatLng().lng + " "
									+ layer.getLatLng().lat + ")";
						}
					}
				},
				getCurrentlayer : function() {
					let
					instance1 = GeodirLayerAdmin.getInstance(GEODIR);
					return instance1.getCurrentLayer();
				}
			});
}());