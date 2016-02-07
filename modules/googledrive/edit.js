Ext.ns("GO.googledrive");

GO.googledrive.showOpenedFilesDialog = function(config){
	
	if(!this.openedFilesDialog){

		this.openedFilesDialog = new GO.googledrive.OpenedFilesDialog({
			file_id:config.file_id
		});
	}else{
		this.openedFilesDialog.addFile(config.file_id);
	}
	this.openedFilesDialog.show(config);
	this.openedFilesDialog.setName(config.file_id);
}

GO.googledrive.edit = function(id){
	window.open(GO.url("googledrive/file/edit", {
		'id':id
	}));
	
	/*Ext.Msg.show({
		title:GO.googledrive.lang.openedFiles,
		msg: GO.googledrive.lang['import'],
		buttons: Ext.Msg.YESNO,
		fn: function(buttonId, text, config){
			if(buttonId=="yes"){
				GO.request({
					url:"googledrive/file/import",
					params:{'id':id}
				});
			}
		},
		icon: Ext.MessageBox.QUESTION
	});*/
	GO.googledrive.showOpenedFilesDialog({file_id:id});
}
