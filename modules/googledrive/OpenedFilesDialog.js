/**
 * Copyright Sofistec
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: OpenedFilesDialog.js 19244 2015-12-08 20:15:02Z wsmits $
 * @copyright Copyright Sofistec
 * @author Abraham Aguilar
 */

GO.googledrive.OpenedFilesDialog = function(config){
	
	if(!config)
	{
		config={};
	}

	this.buildForm(config);
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.width=350;
	config.height=200;
	config.closeAction='hide';
	config.items= this.formPanel;
	config.title=GO.googledrive.lang.openedFiles;
	config.buttons=[{
		text: GO.googledrive.lang.clear,
		handler: function(){
			this.removeFile();
		},
		scope: this
	},{
		text: GO.lang['cmdClose'],
		handler: function(){
			this.hide();
		},
		scope:this
	}];

	GO.googledrive.OpenedFilesDialog.superclass.constructor.call(this, config);
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.googledrive.OpenedFilesDialog, Ext.Window,{

	focus : function(){
		//this.formPanel.form.findField('name').focus();
	},
	
	removeFile : function(){
		var adfile = function(config){
				this.addFile(config);
		};
		Ext.getCmp('openedFilesView').removeAll();
		GO.request({
					url:"googledrive/file/editinglist",
					success: function(response){
						var text = response.responseText;
						// process server response here
						editing_files = Ext.decode(text);
						editing_files.values.forEach(function(element, index, array){
							Ext.getCmp('openedFilesView').add(
							{
								fieldLabel: editing_files.names[index],
								id: element,
								name: element,
								items:[{
									hiddenName: element,
									cls:'fileButton',
									xtype: 'button',
									text: GO.googledrive.lang.save,
									handler: function() {
											GO.request({
												url:"googledrive/file/import",
												params:{'id':element}
											});
											Ext.getCmp(element).removeAll();
										}
									},
									{
									hiddenName: element,
									cls:'fileButton',
									xtype: 'button',
									text: GO.googledrive.lang.errase,
										handler: function() {
											GO.request({
												url:"googledrive/file/delete",
												params:{'id':element}
											});
											Ext.getCmp(element).removeAll();
										}
									}]
							});
							Ext.getCmp('openedFilesView').doLayout();
						});
					},
					scope: this
				});
	},
	
	setName : function(config){
		GO.request({
					url:"googledrive/file/filename",
					params:{'id':config},
					success: function(response){
						var text = response.responseText;
						// process server response here
						fname = Ext.decode(text);
						Ext.getCmp(config).label.update(fname.results);
					},
					scope: this
				});
	},
	
	addFile : function(config){
		
		//var options = [[1,GO.googledrive.lang.save],[2,GO.googledrive.lang.errase]];
		
		this.openedFilesPanel.add(
		/*new GO.form.ComboBox({
				fieldLabel: config,
				hiddenName: config,
				anchor:'100%',
				emptyText:GO.googledrive.lang.editing,
				store:options,
				//[GO.googledrive.lang.save,GO.googledrive.lang.errase],
				displayField:'name',
				valueField:'id',
				triggerAction: 'all',
				editable: false,
				allowBlank: true,
				selectOnFocus:true,
				forceSelection: true,
				mode:'local'
			})*/
				{
					fieldLabel: 'File',
					id: config,
					name: config,
					items:[{
						hiddenName: config,
						cls:'fileButton',
						xtype: 'button',
						text: GO.googledrive.lang.save,
						handler: function() {
								GO.request({
									url:"googledrive/file/import",
									params:{'id':config}
								});
								Ext.getCmp(config).removeAll();
							}
						},
						{
						hiddenName: config,
						cls:'fileButton',
						xtype: 'button',
						text: GO.googledrive.lang.errase,
							handler: function() {
								GO.request({
									url:"googledrive/file/delete",
									params:{'id':config}
								});
								Ext.getCmp(config).removeAll();
							}
						}]
				}
			);
		this.formPanel.doLayout();
	},

	show : function (config) {		

		if(!this.rendered)
			this.render(Ext.getBody());
		
		GO.googledrive.OpenedFilesDialog.superclass.show.call(this);
	},

	buildForm : function (config) {
		
		//var options = [[1,GO.googledrive.lang.save],[2,GO.googledrive.lang.errase]]
								
		this.openedFilesPanel = new Ext.Panel({
			id: 'openedFilesView',
			layout:'form',
			border: false,
			cls:'go-form-panel',
			waitMsgTarget:true,
			items: [ // de invoervelden
			/*this.selectAction = new GO.form.ComboBox({
				fieldLabel: config.file_id,
				hiddenName: config.file_id,
				anchor:'100%',
				emptyText:GO.googledrive.lang.editing,
				store:options,
				//[GO.googledrive.lang.save,GO.googledrive.lang.errase],
				displayField:'name',
				valueField:'id',
				triggerAction: 'all',
				editable: false,
				allowBlank: true,
				selectOnFocus:true,
				forceSelection: true,
				mode:'local'
			})*/
				{
				fieldLabel: "File",
				id:config.file_id,
				name:config.file_id,
				//xtype:'label',
				items:[
						{
							hiddenName: config.file_id,
							cls:'fileButton',
							xtype: 'button',
							text: GO.googledrive.lang.save,
							handler: function() {
									GO.request({
										url:"googledrive/file/import",
										params:{'id':config.file_id}
									});
									Ext.getCmp(config.file_id).removeAll();
								}
						},
						{
							hiddenName: config.file_id,
							cls:'fileButton',
							xtype: 'button',
							text: GO.googledrive.lang.errase,
								handler: function() {
									GO.request({
										url:"googledrive/file/delete",
										params:{'id':config.file_id}
									});
									Ext.getCmp(config.file_id).removeAll();
								}
						}
					]
				}
						
			]
		});
                
		this.items = [this.openedFilesPanel];
		this.formPanel = new Ext.form.FormPanel({
			baseParams : {
				id: 0
			},
			items: this.items
		});
		
	}
});