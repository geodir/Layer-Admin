// IIFE - Immediately Invoked Function Expression
(function(extendDatatables) {

  // The global jQuery object is passed as a parameter
  extendDatatables(window.jQuery, window, document);

}(function($, window, document) {

  // The $ is now locally scoped, it won't collide with other libraries

  // Listen for the jQuery ready event on the document
  // READY EVENT BEGIN
  $(function() {
    // Initialize all datatables in current page
    $('table[data-datatables="true"]').each(function(){
      // Use the advanced extension to auto-configure all
      // advanced features (ajax, export, add, edit, show, delete, etc.)
      $(this).DataTable({
	  		language: {
		        processing:     "Proceso en curso...",
		        search:         "Buscar:",
		        lengthMenu:    "Mostrar  _MENU_ registros por pagina",
		        info:           "Mostrando registros de _START_ al _END_ de un total de _TOTAL_ elementos",
		        infoEmpty:      "No existen registros",
		        infoFiltered:   "(filtrado de un  total de _MAX_ registros)",
		        infoPostFix:    "",
		        loadingRecords: "Cargando recursos...",
	//	        zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
		        emptyTable:     "No hay registros",
		        paginate: {
		            first:      "Primero",
		            previous:   "Previo",
		            next:       "Siguiente",
		            last:       "Ultimo"
		        },
		        aria: {
		            sortAscending:  ": activer pour trier la colonne par ordre croissant",
		            sortDescending: ": activer pour trier la colonne par ordre décroissant"
		        }
		    },	
    	  mark: true,
          advanced: true
      });
    });
    
    $('table[data-tatable-edit="true"]').each(function(){
    	DATATABLES_EDIT._addDatatable(this);
      
      });
    
  });

  // READY EVENT END
  //console.log('The DOM may not be ready');

  // The rest of code goes here!
}));




//****************************************DATATABLES EDTIT***************************************************//


function TABLE_EDIT(id, fieldId, url_update, columns){
	this.id = id;
	this.fieldId = fieldId;
	this.url_update = url_update;
	this.columns = columns;
	this.getIndexColumnId = function(){
		for(var i = 0; i < this.columns.length; i++){
			if( this.fieldId == this.columns[i]){
				return i;
			}
		}
	}
}

var DATATABLES_EDIT = {
		_datatables : [],
		_deleteDatatable : function(tableId){
			var _indice = null;
			for(var i = 0; i < this._datatables.length; i++){
				if(this._datatables[i].id == tableId){
					_indice = i;
				}
			}
			delete this._datatables[_indice]; 
		},
		_addDatatable : function(table){
			console.log("Sigvial - datatable edit");
			
			if(table.id === undefined){
				table = table[0];
			}
			
			this._deleteDatatable(table.id);
			
			var tableID = table.id;
			var columnsTable = [];
			// get columns from table
			$("#"+tableID+ " > thead > tr > th").each(function(){
				try{
					columnsTable.push($(this).attr("data-data"));
				}catch(e){
					columnsTable.push("");
				}
				
			})
			//Initialize table edit
			var _tableEdit = new TABLE_EDIT(table.id, $(table).attr("data-row-id"), $(table).attr("data-update-url"), columnsTable );
			
			// Add element array tablesEdit 
			this._datatables.push(_tableEdit);
			
			//Event clic cell
			var that = this;
			$("#"+tableID).on('click', 'tbody td', function (e) {
				if ( $(this).html().indexOf('input') == -1 ) {
					//get id table
					var idTable = $(this).parent().parent().parent()[0].id;
					//get tableEditSelected
					var tableEditSelected = null;
					for(var index in  that._datatables){
						if(that._datatables[index].id == idTable ){
							tableEditSelected = that._datatables[index];
							break;
						}
					}
					//
					var fieldname = tableEditSelected.columns[$(this)[0].cellIndex];
					var idRow = $(this).parent().children()[tableEditSelected.getIndexColumnId()].innerText;
					if(idRow == ""){
						idRow = $(this).parent()[0].id;
					}
				
					
					var val = $(this).html();
		            $(this).html(inlineEdit(this, idRow, fieldname, val));
		            var myTd = this;
		            // implement the blur
		            $("#" + idRow + '_' + fieldname ).on('blur', function() {
		                // create ajax call to save data
		            	var that = this;
		               
		               $.ajax({
		            	    url: tableEditSelected.url_update, 
		            	    data: { id : idRow, fieldname: fieldname, val: $(this).val() },
		            	    method: 'post',
		            	    error: function(XMLHttpRequest, textStatus, errorThrown){
		            	    	stopEdit(that, myTd, false, val);
		            	    },
		            	    success: function(data){
		            	    	stopEdit(that, myTd, true, "");
		            	    }
		            	});
		               
		              
		            });
		            // implement the enter press
		            $("#" + idRow + '_' + fieldname ).on('keypress', function(event) {
		                if ( event.keyCode == 13 ) {
		                    $(this).trigger('blur');
		                }
		            });
		            // focus the input
		            $("#" + idRow + '_' + fieldname ).focus();
		            // put the cursor on the end
		            var tmpStr = $("#" + idRow + '_' + fieldname ).val();
		            $("#" + idRow + '_' + fieldname ).val('');
		            $("#" + idRow + '_' + fieldname ).val(tmpStr);
					
				}
			 });
		}
}


function inlineEdit(td, rel, fieldname, val) {
    return $('<input/>').attr({ type: 'text', rel: rel, name: fieldname, autofocus: 'true', value: val, id: rel + '_' + fieldname})
}

// stop input
function stopEdit(input, myTd, iscorrect, oldValue) {
	if(iscorrect){
		$(myTd).html($(input).val());
	}else{
		$(myTd).html(oldValue);
	}
    
}
//**********************************FIN DATATABLES EDIT ****************************************************//