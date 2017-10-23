L.Polyline.Measure = L.Draw.Polyline.extend({
    addHooks: function() {
        L.Draw.Polyline.prototype.addHooks.call(this);
        if (this._map) {
            this._markerGroup = new L.LayerGroup();
            this._map.addLayer(this._markerGroup);

            this._markers = [];
            this._map.on('click', this._onClick, this);
            this._startShape();
        }
    },

    removeHooks: function () {
        L.Draw.Polyline.prototype.removeHooks.call(this);

        this._clearHideErrorTimeout();

        //!\ Still useful when control is disabled before any drawing (refactor needed?)
        this._map
            .off('pointermove', this._onMouseMove, this)
            .off('mousemove', this._onMouseMove, this)
            .off('click', this._onClick, this);

        this._clearGuides();
        this._container.style.cursor = '';

        this._removeShape();
    },

    _startShape: function() {
    	
        this._drawing = true;
        this._poly = new L.Polyline([], this.options.shapeOptions);
        //this is added as a placeholder, if leaflet doesn't recieve this when the tool is turned off all onclick events are removed
        this._poly._onClick = function() {};
        
        this._container.style.cursor = 'crosshair';

        this._updateTooltip();
        this._map
            .on('pointermove', this._onMouseMove, this)
            .on('mousemove', this._onMouseMove, this);
    },

    _finishShape: function () {
    	this._showBoton();
        this._drawing = false;

        this._cleanUpShape();
        this._clearGuides();

        this._updateTooltip();

        this._map
            .off('pointermove', this._onMouseMove, this)
            .off('mousemove', this._onMouseMove, this);

        this._container.style.cursor = '';
    },

    _removeShape: function() {
        if (!this._poly)
            return;
        this._map.removeLayer(this._poly);
        delete this._poly;
        this._markers.splice(0);
        this._markerGroup.clearLayers();
    },
  
    _onClick: function(e) {
        if (!this._drawing) {
            this._removeShape();
            this._startShape();
            return;
        }
    },
	_showBoton:function(){
		document.getElementById("lnkMedir").style.display="block";
    	document.getElementById('btnMedirDistancia').innerHTML="";
	},
	_hideBoton:function(){
	},
    _getTooltipText: function() {
        var labelText = L.Draw.Polyline.prototype._getTooltipText.call(this);
        
        if (!this._drawing) {
            labelText.text = '';
        }
        
        var metros;
        var kilometros;
        var pies;
        
        if(labelText.subtext!=null){
        	var pies=0;
        	var textDistancia=labelText.subtext.split(" ");
            var distance=textDistancia[0];
           
            if(textDistancia[1]=="km"){
            	kilometros=distance;
            	metros=distance*1000;
            	pies=metros/0.3048;
            }else{
            	metros=distance;
            	kilometros=distance/1000;
            	pies=distance/0.3048;
            }
            pies=Math.round(pies * 100) / 100;
            switch (unidadMedida) {
    		case "metros":
    			labelText.subtext=metros+" m";
    			break;
    		case "kilometros":
    			labelText.subtext=kilometros+" km";
    			break;
    		case "pies":
    			labelText.subtext=pies+" ft";
    			break;
    		default:
    			break;
    		}
        }
        
        
        
        return labelText;
    }
});

var htmlUnidadesMedidas="<div style='background:white;margin-left:0px;color: #337ab7;padding:10px;'><form><p>Seleccione unidad de medida:</p>" +
		"<input type='radio' id='rbmetros' name='metros' value='metros' checked='checked' onclick='selectUnidad(1)'> <label for='rbmetros'>Metros</label><br>"+
  "<input type='radio' id='rbkilometros' name='kilometros' value='kilometros' onclick='selectUnidad(2)'> <label for='rbkilometros'>Kilometros</label><br>"+
  "<input type='radio' id='rbpies' name='Pies' value='pies' onclick='selectUnidad(3)'> <label for='rbpies'>Pies</label> <br/>" +
  "<p onclick='cancelarMedicion()' style='cursor:pointer;margin-left:95px;'>Cancelar</p>" +
		"<form></div>";

var unidadMedida='metros';
function selectUnidad(unidad){
	switch (unidad) {
	case 1:
		unidadMedida='metros';
		document.getElementById("rbkilometros").checked = false;
		document.getElementById("rbpies").checked = false;
		break;
	case 2:
		unidadMedida='kilometros';
		document.getElementById("rbmetros").checked = false;
		document.getElementById("rbpies").checked = false;
		break;
	case 3:
		unidadMedida='pies';
		document.getElementById("rbmetros").checked = false;
		document.getElementById("rbkilometros").checked = false;
		break;
	default:
		break;
	}
}

function cancelarMedicion(){
	document.getElementById("lnkMedir").click();
	document.getElementById("lnkMedir").style.display="block";
	unidadMedida='metros';
	document.getElementById('btnMedirDistancia').innerHTML="";
}


L.Control.MeasureControl = L.Control.extend({

    statics: {
        TITLE: 'Medir distancia'
    },
    options: {
        position: 'topright',
        handler: {}
    },

    toggle: function() {
        if (this.handler.enabled()) {
        	document.getElementById('btnMedirDistancia').innerHTML="";
            this.handler.disable.call(this.handler);
        } else {
        	document.getElementById('btnMedirDistancia').innerHTML=htmlUnidadesMedidas;
        	unidadMedida='metros';
            this.handler.enable.call(this.handler);
            document.getElementById("lnkMedir").style.display="none";
        }
    },

    onAdd: function(map) {
        var className = 'leaflet-control-draw';

        this._container = L.DomUtil.create('div', 'leaflet-bar');

        this.handler = new L.Polyline.Measure(map, this.options.handler);

        this.handler.on('enabled', function () {
            this.enabled = true;
            L.DomUtil.addClass(this._container, 'enabled');
        }, this);

        this.handler.on('disabled', function () {
            delete this.enabled;
            L.DomUtil.removeClass(this._container, 'enabled');
        }, this);

        var link = L.DomUtil.create('a', className+'-measure sizeOpcionesMapa', this._container);
        link.href = '#';
        link.title = L.Control.MeasureControl.TITLE;
        link.id="lnkMedir";
        
        var divpanel= L.DomUtil.create('div','' ,this._container);
        divpanel.id="btnMedirDistancia";

        L.DomEvent
            .addListener(link, 'click', L.DomEvent.stopPropagation)
            .addListener(link, 'click', L.DomEvent.preventDefault)
            .addListener(link, 'click', this.toggle, this);

        return this._container;
    }
});


L.Map.mergeOptions({
    measureControl: false
});


L.Map.addInitHook(function () {
    if (this.options.measureControl) {
        this.measureControl = L.Control.measureControl().addTo(this);
    }
});


L.Control.measureControl = function (options) {
    return new L.Control.MeasureControl(options);
};

GEODIR.mapcontrols.distance = new L.Control.measureControl({});
