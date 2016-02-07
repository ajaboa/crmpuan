Ext.ns("GO.googledrive");

GO.googledrive.edit = function(id){
	window.open(GO.url("googledrive/file/edit", {
		'id':id
	}));
	
	Ext.Msg.show({
		title:GO.googledrive.lang.finishedEditing,
		msg: GO.googledrive.lang['import'],
		buttons: Ext.Msg.YESNO,
		fn: function(buttonId, text, config,id){
			if(buttonId=="yes"){
				GO.request({
					url:"googledrive/file/import",
					params: {id: id}
				});
			}
		},
		icon: Ext.MessageBox.QUESTION
	});
}
