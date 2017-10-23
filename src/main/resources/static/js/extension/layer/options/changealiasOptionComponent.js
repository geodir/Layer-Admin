Vue.component('modal-edit-alias', {
	 props:['alias', 'id'],
	 template:
		    '<transition name="modal">'+
		 		'<div class="modal-mask">'+
	      			'<div class="modal-wrapper">'+
	        			'<div class="modal-container">'+
	          				'<div class="modal-header">'+
	            				'<h4 class="modal-title">'+'Editar Alias'+'</h4>'+
	            				'<button class="close" v-on:click="cancel">'+
	            					'×'+
	              				'</button>'+
	            				
	          				'</div>'+
		          			'<div class="modal-body">'+
		            			'<slot name="body">'+
		              				'<input type="text" v-model="layerAlias" placeholder="Ingrese alias" class="form-control"/>'+
		              				'<br/>'+
		              				'<label class="text-muted">'+'Alias anterior: {{alias}}'+'</label>'+
		            			'</slot>'+
		          			'</div>'+
			 				'<div class="modal-footer">'+
		            			'<slot name="footer">'+
			              			'<button class="btn btnCyan" v-on:click="saveAlias">'+
			                			'Guardar'+
			              			'</button>'+
			              			
		            			'</slot>'+
		          			'</div>'+
		          		'</div>'+
		          	'</div>'+
		          '</div>'+
		 	'</transition>',
    data: function(){
    	return{
    		layerAlias: this.alias
    	}
    },
	methods: {
		saveAlias: function(){
			
			if(this.layerAlias != ''){	
				if(this.layerAlias != this.alias){
					var subInst = GeodirLayerAdmin.getInstance('');
		        	if(subInst.changeAlias(this.id, this.layerAlias)){
		        		this.$parent.$parent.layers[this.$parent.layerIndex]['alias'] = this.layerAlias;
		        	}
				}			
			}
			this.$parent.showModal = false;
		},
		cancel: function(){
			this.$parent.showModal = false;
		}
	},
	computed: {
		textAlias: function(){
			return this.alias;
		}
	}
 });

Vue.component('geodir-layer-option-changealias', {
        	  	props: ['layer','layer-index'],
			  	// template: '<div v-on:click="deleteLayer(optionconfig.id)">A
				// custom DELETE! {{optionconfig.name}} con id
				// {{optionconfig.id}}</div>',
				template:'<div><a class="dropdown-item btn-edit-layer" '+
						 ' @click="showDialog"><span class="fa fa-pencil"></span> '+
							'Cambiar alias</a>'+
							'<modal-edit-alias v-if="showModal" @close="showModal = false" :alias="layer.alias" :id="layer.id"></modal-edit-alias></div>',
				
				data: function(){
					return {
						showModal: false,
						layerEdit: {alias:''}
					}
				},
				methods: {
					showDialog: function () {
						this.showModal = true;
						let id = this.layer.id;
						setTimeout(function(){$("#btnGroupDrop"+id ).trigger( "click" );},1000);
				},
				changeAlias: function(){
					console.log(this.layerEdit);
				},
				getIdModel: function(id){
					return "changealias" + id;
				},
				getIdModelTarget: function(id){
					return "#changealias" + id;
				}
			  },
			});
 
 