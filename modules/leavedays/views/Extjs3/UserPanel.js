Ext.namespace('GO.leavedays');

GO.leavedays.UserPanel = function(config) {
	
	var config = config || {};
	
	config.title = GO.leavedays.lang['leavedays'];
	config.layout = 'border';
	config.width = 500;
	
	config.cls='go-white-bg';
	
	this.gridPanel = this._buildGridPanel();
	
	config.items = [
		this.gridPanel,
		this.summaryPanel = new Ext.Panel({
			region: 'south',
//			layout: 'form',
//			cls: 'go-form-panel',
			height: 200
//			labelWidth: 150
//			items: [{
//					xtype: 'plainfield',
//					hideLabel: true,
//					value: GO.leavedays.lang['leaveHours'],
//					cls: 'display-panel-heading'
//				},
//				this.leftoverField = new GO.form.PlainField({
//					fieldLabel : GO.leavedays.lang['pastLeftover']
//				}),this.yearCreditField = new GO.form.PlainField({
//					fieldLabel : GO.leavedays.lang['currentYearCredit']
//				}),this.builtUpCreditField = new GO.form.PlainField({
//					fieldLabel : GO.leavedays.lang['builtUpCredit']
//				}),this.usedCreditField = new GO.form.PlainField({
//					fieldLabel : GO.leavedays.lang['currentCreditsUsed']
//				}),this.totalCreditField = new GO.form.PlainField({
//					fieldLabel : GO.leavedays.lang['wholeYearCredit']
//				}),this.availableCreditField = new GO.form.PlainField({
//					fieldLabel : GO.leavedays.lang['currentMonthCredit']
//			})]
		})
	];
	
	GO.leavedays.UserPanel.superclass.constructor.call(this,config);
	
	this.addEvents({'leavedaySaved':true});
	
}

Ext.extend( GO.leavedays.UserPanel, Ext.Panel, {
	
	_user_name : '',
	
	show : function(config) {
		
		GO.leavedays.UserPanel.superclass.show.call(this);
		
		if(this.gridPanel.store.baseParams['user_id']!=GO.leavedays.activeUserId || this.gridPanel.store.baseParams['year'] != GO.leavedays.activeYear){
			this.gridPanel.store.baseParams['user_id'] = GO.leavedays.activeUserId;
			this.gridPanel.store.baseParams['year'] = GO.leavedays.activeYear;
			this.gridPanel.store.load();

			this._loadYearSummary();

			this._user_name = config['user_name'];
			this.setTitle(GO.leavedays.lang['leavedays']+': '+this._user_name+' ('+GO.leavedays.activeYear+')');
		} else if (!GO.util.empty(config['empty'])) {
			this.gridPanel.store.baseParams['user_id'] = 0;
			this.gridPanel.store.load();
			this._user_name = '';
			this.setTitle(GO.leavedays.lang['leavedays']);
			this._loadYearSummary();
		}
	},
	
	_buildGridPanel : function() {
		
		
		var columns = [{
					header: GO.leavedays.lang['id'],
					dataIndex: 'id',
					width:20,
					hidden: true
				},{
					header: GO.leavedays.lang['firstDate'],
					dataIndex: 'first_date',
					width:90,
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
//					,align: 'right'
				},{
					header: GO.leavedays.lang['lastDate'],
					dataIndex: 'last_date',
					width:90,
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
//					,align: 'right'
				},{
					header: GO.leavedays.lang['hours'],
					dataIndex: 'n_hours',
					width:50,
					align: 'right',
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: GO.leavedays.lang['hoursNationalHolidays'],
					dataIndex: 'n_nat_holiday_hours',
					width:50,
					align: 'right',
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: GO.leavedays.lang['strDescription'],
					dataIndex: 'description',
					width:120,
					align: 'right',
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: GO.lang['strCtime'],
					dataIndex: 'ctime',
					width: 110,
					align: 'right',
					hidden: true,
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: GO.lang['strMtime'],
					dataIndex: 'mtime',
					width: 110,
					align: 'right',
					hidden: true,
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				}];
			
		var icons = {
			appr: '<div title="GOED" style="float:left" class="tasks-complete-icon"></div>',
			disa: '<div class="go-icon-cross"><div style="float:left; height:16px;width:16px;padding-left:3px !important;" class="x-grid3-cell-inner"></div></div>',
			none: '<div style="float:left" class="go-important-icon"></div>'
		};
			
		if(GO.leavedays.currentUserIsManager){
			
			var radioRenderer = function(value, meta, r, row, col) {
				var id = Ext.id();
				Ext.defer(function () {
					new Ext.form.Radio({
						renderTo: id,
						name: 'ld-status-'+row,
						checked: r.get('status')==columns[col].emptyGroupText,
						width: 75,
						handler: function (me, checked) { 
							if(!checked) return;
							GO.request({
								url:'leavedays/leaveday/update',
								params:{
									id:r.id,
									user_id:r.data.user_id,
									status:columns[col].emptyGroupText
								},
								success:function(){
									//r.commit();
								}
							});

						}
					});
				}, 50);
				return String.format('<div id="{0}"></div>', id);
			};
			
			columns.push({
				header:icons['appr'],
				width: 30,
				emptyGroupText: 1, //abusing this property to pass value to radio select
				sortable:false,
				hideable:false,
				menuDisabled:true,
				resizable:false,
				renderer: radioRenderer
			});
			columns.push({
				header:icons['disa'],
				width: 30,
				emptyGroupText: 2,
				sortable:false,
				hideable:false,
				menuDisabled:true,
				resizable:false,
				renderer: radioRenderer
			});
			columns.push({
				header:icons['none'],
				width: 30,
				emptyGroupText: 0,
				sortable:false,
				hideable:false,
				menuDisabled:true,
				resizable:false,
				renderer: radioRenderer
			});
		} else {
			columns.push({ 
				header: GO.lang.strStatus, 
				//dataIndex: 'name',
				renderer:function(v, meta, record){

				  if(record.get('status')==0) {
					  return '';// icons['none'];
				  }
				  if(record.get('status')==1) {
					  return icons['appr'];
				  }
				  if(record.get('status')==2) {
					  return icons['disa'];
				  }
			  }
			});
		}
						
		var gridPanelConfig = {
			plugins: this.checkColumn ? this.checkColumn : [],
			region: 'center',
			store: new GO.data.JsonStore({
				url: GO.url('leavedays/leaveday/store'),
//				sortInfo: {
//					field: 'first_date',
//					direction: 'ASC'
//				},
				remoteSort:true,
				fields: ['id', 'user_id', 'first_date', 'last_date','n_hours', 'n_nat_holiday_hours', 'description','ctime','mtime', 'status', 'has_negative_credit']
			}),
			noDelete: !GO.settings.modules.leavedays.write_permission,
			paging: true,
			cm: new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:columns
			}),
			view: new Ext.grid.GridView({
				emptyText: GO.lang['strNoItems']
			}),
			sm: new Ext.grid.RowSelectionModel(),
			loadMask: true,
			clicksToEdit: 1
		};
		
		
			this.addButton = new Ext.Button({
				iconCls: 'btn-add',
				text: GO.lang['cmdAdd'],
				cls: 'x-btn-text-icon',
				disabled: true,
				handler: function(){
					GO.leavedays.showLeavedayDialog(0);
					
					if(!this.saveListenerAdded){
						this.saveListenerAdded=true;
						GO.leavedays.leavedayDialog.on('save',function(){
							this.gridPanel.store.load();
							this._loadYearSummary();
						}, this);
					}
				},
				scope: this
			});
			this.delButton = new Ext.Button({
				iconCls: 'btn-delete',
				text: GO.lang['cmdDelete'],
				cls: 'x-btn-text-icon',
				disabled: true,
				handler: function(){
					this.gridPanel.deleteSelected();
				},
				scope: this
			});
			
		if (GO.settings.modules.leavedays.write_permission) {
			gridPanelConfig.tbar = [this.addButton,this.delButton];
		}else
		{
			gridPanelConfig.tbar = [this.addButton];
		}
						
		var gridPanel = new GO.grid.GridPanel(gridPanelConfig);
				
		gridPanel.store.on('load',function(){
			this._loadYearSummary();
		}, this);
				
		if (GO.settings.modules.leavedays.write_permission)
			gridPanel.on('rowdblclick',function(grid,rowIndex,event){
				var record = grid.store.getAt(rowIndex);
				GO.leavedays.showLeavedayDialog(record.data['id']);
				
				if(!this.saveListenerAdded){
					this.saveListenerAdded=true;
					GO.leavedays.leavedayDialog.on('save',function(){
						this.gridPanel.store.load();
						this._loadYearSummary();
					}, this);
				}

			}, this);
				
		return gridPanel;
		
	},
	
	
	_loadYearSummary : function() {
		
			
			this.summaryPanel.load({
				url: GO.url('leavedays/user/yearInfo'),
				params: {
					'userId' : GO.leavedays.activeUserId,
					'selectedYear' : GO.leavedays.activeYear
				}
				,scope: this
				,callback: function(panel,success,action) {
					if(typeof(this.addButton)=='object')
						this.addButton.setDisabled(GO.util.empty(action.responseText));
					if(typeof(this.delButton)=='object')
						this.delButton.setDisabled(GO.util.empty(action.responseText));
				}
			});
				
//			GO.request({
//				url: 'leavedays/user/yearInfo',
//				params: {
//					'userId' : GO.leavedays.activeUserId,
//					'selectedYear' : GO.leavedays.activeYear
//				},
//				success: function(options, response, result) {
//					if (!GO.util.empty(result.feedback))
//						Ext.MessageBox.alert('', result.feedback);
//
//					this.leftoverField.setValue(result.data['leftover']);
//					this.yearCreditField.setValue(result.data['year_credit']);
//					this.builtUpCreditField.setValue(result.data['built_up_credit']);
//					this.usedCreditField.setValue(result.data['credits_used']);
//					this.totalCreditField.setValue(result.data['whole_year_credit']);
//					this.availableCreditField.setValue(result.data['current_month_credit']);
//
//					this._user_name = result.data['user_name'];
//
//					this.setTitle(GO.leavedays.lang['leavedays']+': '+this._user_name+' ('+GO.leavedays.activeYear+')');
//
//
//					if (GO.settings.modules.leavedays.write_permission) {
//
//						this.addButton.setDisabled(!result.success);
//						this.delButton.setDisabled(!result.success);
//
//					}
//
//				},
//				failure: function() {
//
//
//					if (GO.settings.modules.leavedays.write_permission) {
//
//						this.addButton.setDisabled(true);
//						this.delButton.setDisabled(true);
//
//					}
//
//				},
//				scope: this
//			});
//		} else {
//			
//			this.leftoverField.setValue('');
//			this.yearCreditField.setValue('');
//			this.builtUpCreditField.setValue('');
//			this.usedCreditField.setValue('');
//			this.totalCreditField.setValue('');
//			this.availableCreditField.setValue('');
//
//			this._user_name = '';
//
//			this.setTitle(GO.leavedays.lang['leavedays']);
//
//
//			if (GO.settings.modules.leavedays.write_permission) {
//
//				this.addButton.setDisabled(true);
//				this.delButton.setDisabled(true);
//
//			}
//			
		
	}
	
});