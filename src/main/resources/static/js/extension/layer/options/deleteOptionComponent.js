 Vue.component('geodir-layer-option-delete', {
        	  	props: ['layer','layer-index'],
			  	// template: '<div v-on:click="deleteLayer(optionconfig.id)">A
				// custom DELETE! {{optionconfig.name}} con id
				// {{optionconfig.id}}</div>',
				template:'<a class="dropdown-item btn-delete-layer"'+
						 ' v-on:click="deleteLayer(layer.id)"><span class="fa fa-trash-o"></span> '+
							'{{layer.optionsData.delete.name}}</a>',
				methods: {
				deleteLayer: function (id) {
					var data = this;
					let serverContext = GeodirLayerAdmin.getInstance('').getContext();
					var $token = $("meta[name='_csrf']");
					var $header = $("meta[name='_csrf_header']");
					var url = serverContext + 'geodir/ext/layer/delete/' + id;
					var context = this;
					$.ajax({
						url : url,
						type : 'DELETE',
						beforeSend : function(request) {
							if ($token != null && $token.length > 0 && $header != null && $header.length > 0) {
								request.setRequestHeader($header.attr("content"),$token.attr("content"));
							}
						}
					}).done(function(result) {
						let layerAdminInstance = GeodirLayerAdmin.getInstance(serverContext);
						let curentLayers = layerAdminInstance.getLayers();
						layerAdminInstance.getMap().removeLayer(curentLayers[id].layer);
						delete curentLayers[id];
						data.$parent.layers.splice(data.layerIndex,1);
						data.$parent.layeridactive=layerAdminInstance.currentLayerId;
					}.bind(data)).fail(function(jqXHR, status) {
						console.log(jqXHR);
						console.log(status);
					});
				}
			  },
			})