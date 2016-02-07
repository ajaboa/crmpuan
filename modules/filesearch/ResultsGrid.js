/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ResultsGrid.js 18590 2014-03-20 08:40:26Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.filesearch.ResultsGrid = function(config){

	config = config || {};


	var fields ={
		fields:['id','name','type', 'size', 'mtime','ctime', 'extension','preview_text','advanced_search', 'subject','to'],
		columns:[{
			id:'name',
			header:GO.lang['strName'],
			dataIndex: 'name',
			renderer:function(v, meta, r){
				var cls = r.get('acl_id')>0 ? 'folder-shared' : 'filetype filetype-'+r.get('extension');
				return '<div class="go-grid-icon '+cls+'">'+v+'</div>';
			}
		},{
			header:GO.lang.strType,
			dataIndex: 'type',
			sortable:false,
			hidden:true,
			width:150
		},{
			header:GO.lang.strMtime,
			dataIndex: 'mtime',
			width:110
		},{
			header:GO.lang.strCtime,
			dataIndex: 'ctime',
			width:110,
			hidden:true
		},{
			header:GO.filesearch.lang.subject,
			dataIndex: 'subject',
			width:100,
			hidden:true
		},{
			header:GO.filesearch.lang.to,
			dataIndex: 'to',
			width:100,
			hidden:true
		}]
	};

	if(GO.customfields)
	{
		GO.customfields.addColumns("GO\\Files\\Model\\File", fields);
	}

	Ext.apply(config, {
		id:'fs-searchresults-grid',
		exportTitle : GO.lang.strSearch,
		cls:'fs-searchresults-grid',
		title:GO.filesearch.lang.searchResults,
		split:true,
		paging:25,
		store: new GO.data.JsonStore({
			url: GO.url("filesearch/filesearch/store"),
			baseParams: {
				folder_id : 0
			},
			fields:fields.fields,
			remoteSort:true
		}),
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:fields.columns
		}),
		autoExpandColumn:'name',
		view:new Ext.grid.GridView({
			emptyText:GO.lang.strNoItems,
			enableRowBody:true,
			getRowClass : function(record, rowIndex, p, store){
				p.body = '<div class="go-links-panel-description">'+record.data.preview_text+'</div>';

				return 'x-grid3-row-expanded';
			}
		}),
		deleteConfig:{
			extraWarning: GO.filesearch.lang.deleteDocBundleWarning+" "
		},
		sm: new Ext.grid.RowSelectionModel(),
		loadMask: true		
	});

	config.tbar = [{
			itemId:'save-docbundle',
			iconCls:'btn-save',
			text:GO.filesearch.lang.saveAsNewBundle,
			scope:this,
			handler:function(){

				var keywords='';
				var p = this.store.baseParams;

				if(!GO.util.empty(p.filename)){
					keywords += p.filename+', ';
				}
				if(!GO.util.empty(p.content_all)){
					keywords += p.content_all.replace(/ /g,', ')+', ';
				}
				if(p.content_exact!=''){
					keywords += p.content_exact+', ';
				}
				if(!GO.util.empty(p.content_or1))
					keywords += p.content_or1+', ';
				if(!GO.util.empty(p.content_or2))
					keywords += p.content_or2+', ';
				if(!GO.util.empty(p.content_or3))
					keywords += p.content_or3+', ';

				keywords = keywords.substring(0, keywords.length-2);

				GO.filesearch.showDocbundleDialog(0, {
					files:this.getSelectionModel().selections.keys,
					values:{keywords:keywords}
				});
			}
		},{
			itemId:'add-to-docbundle',
			iconCls:'btn-add',
			text:GO.filesearch.lang.addToBundle,
			scope:this,
			handler:function(){
				if(!this.selectDocbundleDialog)
					this.selectDocbundleDialog = new GO.filesearch.SelectDocbundleDialog();

				this.selectDocbundleDialog.show({
					files:this.getSelectionModel().selections.keys
				});
			}
		},{
			itemId:'delete-docbundle',
			iconCls:'btn-delete',
			text:GO.filesearch.lang.removeFromBundle,
			scope:this,
			hidden:true,
			handler:function(){
				this.deleteSelected();
			}
		},
		'-',
		{
			iconCls: 'btn-export',
			text: GO.lang.cmdExport,
			cls: 'x-btn-text-icon',
			handler:function(){
				
				if(!this.exportDialog)
				{
					this.exportDialog = new GO.ExportGridDialog({
						url: 'filesearch/filesearch/export',
						name: 'filesearch',
						exportClassPath:'modules/filesearch/export',
						documentTitle:this.exportTitle,
						colModel: this.getColumnModel()
					});
				}
				this.exportDialog.documentTitle=this.exportTitle;
				this.exportDialog.params={filesearchParams:this.store.baseParams};
				
				this.exportDialog.show();

			},
			scope: this
		}
		];

	

//	if (GO.customfields) {
//		config.tbar.push(
//			'-'
//		);
//		config.tbar.push({
//			iconCls: 'btn-edit',
//			text: GO.customfields.lang.bulkEdit,
//			cls: 'x-btn-text-icon',
//			handler:function(){
//				if (this.selModel.getSelections().length > 0 ) {
//					if (!GO.customfields.bulkEditDialog)
//						GO.customfields.bulkEditDialog = new GO.customfields.BulkEditDialog();
//					GO.customfields.bulkEditDialog.show(this.selModel.getSelections());
//				} else {
//					Ext.MessageBox.alert(GO.lang['strError'], GO.customfields.lang.noFileSelected);
//				}
//			},
//			scope: this
//		});
//	}

	GO.filesearch.ResultsGrid.superclass.constructor.call(this, config);

	if (GO.customfields) {
		this.on('rowcontextmenu', function(grid,rowIndex,e) {
			this.onContextMenu(e);
		},this);
	}

}

Ext.extend(GO.filesearch.ResultsGrid, GO.grid.GridPanel, {
	
	onContextMenu : function(e) {
		if (!this.contextMenu) {
			this.contextMenu = new Ext.menu.Menu({
				id: 'gridCtxMenu',
				items: [{
					iconCls: 'btn-edit',
					text: GO.filesearch.lang.editSelection,
					cls: 'x-btn-text-icon',
					handler:function(){
						var ids = [];
						if(this.selModel.getSelections().length > 0 ) {
							var selected = this.selModel.getSelections();
							for (var i = 0; i < selected.length; i++) {
								if (!GO.util.empty(selected[i].data.id))
									ids.push(selected[i].data.id);
							}

							GO.base.model.showBatchEditModelDialog('GO\\Files\\Model\\File', ids, this.grid,{},'name,user_id,extension,expire_time,random_code',GO.filesearch.lang.editSelection);
						} else {
							Ext.MessageBox.alert(GO.lang['strError'], GO.customfields.lang.noFileSelected);
						}
						
					},
					scope: this
				}]
			});
		}
		var xy = e.getXY();
		this.contextMenu.showAt(xy);
		e.preventDefault();
	},

	setDocumentBundle : function(docbundleRecord){

		var tbItems = this.getTopToolbar().items;

		if(docbundleRecord){
			this.store.baseParams.docbundle_id=docbundleRecord.id;
			this.store.baseParams.keywords=docbundleRecord.get('keywords');
			tbItems.get('save-docbundle').hide();
			//tbItems.get('add-to-docbundle').hide();
			tbItems.get('delete-docbundle').show();
		}else
		{
			delete this.store.baseParams.docbundle_id;
			delete this.store.baseParams.keywords;
			tbItems.get('save-docbundle').show();
			//tbItems.get('add-to-docbundle').show();
			tbItems.get('delete-docbundle').hide();
		}
	}
});