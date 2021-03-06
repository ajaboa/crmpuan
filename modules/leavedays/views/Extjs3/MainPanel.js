GO.leavedays.MainPanel = function (config) {

	if (!config)
	{
		config = {};
	}

	config.layout = 'border';
	config.border = false;

	this.yearsGrid = new GO.grid.GridPanel({
		border: false,
		layout: 'fit',
		title: GO.leavedays.lang['years'],
		region: 'west',
		width: 100,
		split: true,
		store: new GO.data.JsonStore({
			url: GO.url('leavedays/leaveday/yearsStore'),
			fields: ['year'],
			remoteSort: true
		}),
		cls: 'go-grid3-hide-headers',
//			autoScroll:true,
		columns: [{
				header: GO.leavedays.lang['year'],
				dataIndex: 'year',
				id: 'year',
				width: 100
			}],
		view: new Ext.grid.GridView({
			forceFit: true,
			autoFill: true
		}),
		sm: new Ext.grid.RowSelectionModel({singleSelect: true})
	});


	if (GO.leavedays.currentUserIsManager) {

		this.yearsGrid.getSelectionModel().on('rowselect', function (rowSelectionModel, rowIndex, event) {
			var record = rowSelectionModel.getSelected();
			this._setYear(record.data['year']);
			this._setUserId(GO.settings.user_id);
			this.userPanel.show({user_name: ''});
		}, this);

		var isManager = GO.settings.modules.leavedays.write_permission;
		var tbarItems = [{
				iconCls: 'btn-add',
				text: GO.lang['cmdAdd'],
				cls: 'x-btn-text-icon',
				hidden: !isManager,
				handler: function () {
					if (!GO.leavedays.yearCreditDialog) {
						GO.leavedays.yearCreditDialog = new GO.leavedays.YearCreditDialog();
						GO.leavedays.yearCreditDialog.on('save', function () {
							this.yearSummaryGrid.store.load();
						}, this);
					}
					var yearRecord = this.yearsGrid.getSelectionModel().getSelected();

					GO.leavedays.yearCreditDialog.show(0, {
						loadParams: {
							year: yearRecord.data['year']
						}
					});
				},
				scope: this
			}, {
				iconCls: 'btn-delete',
				text: GO.lang['cmdDelete'],
				cls: 'x-btn-text-icon',
				hidden: !isManager,
				handler: function () {
					this.yearSummaryGrid.deleteSelected({
						callback: function () {
							GO.leavedays.activeUserId = 0;
							this.userPanel.show({empty: true});
						},
						scope: this
					});
				},
				scope: this
			},
			{xtype: 'tbseparator',hidden: !isManager},
			{
				iconCls: 'btn-copy',
				text: GO.leavedays.lang['copyLastYearsCredits'],
				cls: 'x-btn-text-icon',
				hidden: !isManager,
				handler: function () {
					var currentYear = GO.leavedays.activeYear;
					var previousYear = currentYear - 1;
					Ext.Msg.show({
						title: GO.leavedays.lang['copyLastYearsCredits'],
//						icon: Ext.MessageBox.WARNING,
						msg: GO.leavedays.lang['copyLastYearsCreditsRUSure'].replace('%y1', previousYear).replace('%y2', currentYear).replace('%y2', currentYear),
						buttons: Ext.Msg.YESNO,
						scope: this,
						fn: function (btn) {
							if (btn == 'yes') {
								GO.request({
									timeout: 300000,
									maskEl: Ext.getBody(),
									url: 'leavedays/leaveday/copyLastYearCredits',
									params: {
										current_year: GO.leavedays.activeYear
									},
									success: function () {
										this.yearSummaryGrid.store.load();
									},
									scope: this
								});
							}
						}
					});
				},
				scope: this
			},
			{xtype: 'tbseparator',hidden: !isManager},
			{
				iconCls: 'btn-export',
				text: GO.lang.cmdExport,
				cls: 'x-btn-text-icon',
				handler: function () {
					window.open(GO.url('leavedays/yearCredit/exportCsv', {'year': GO.leavedays.activeYear}));
				}
			}, {
				iconCls: 'btn-export',
				text: GO.leavedays.lang['monthView'],
				cls: 'x-btn-text-icon',
				handler: function () {
					if (!this.monthView) {
						this.monthView = new GO.leavedays.MonthWindow();
					}
					this.monthView.show(this.yearsGrid.getSelectionModel().getSelected().data.year);
				},
				scope: this
			}
		];

		this.yearSummaryGrid = new GO.grid.GridPanel({
			cls: 'go-white-bg',
			border: false,
			layout: 'fit',
			title: GO.leavedays.lang['leaveHourCredits'],
			region: 'center',
			paging: true,
			store: new GO.data.JsonStore({
				url: GO.url('leavedays/leaveday/yearSummaryStore'),
				fields: ['id', 'year', 'user_id', 'manager_user_id', 'manager_user_name', 'need_approve', 'user_name', 'leftover', 'year_credit', 'whole_year_credit', 'built_up_credit', 'credits_used', 'n_nat_holiday_hours'],
				remoteSort: true
			}),
//			cls: 'go-grid3-hide-headers',
//			autoScroll:true,
			columns: [
//				{
//				header:GO.leavedays.lang['year'],
//				dataIndex: 'year',
//				id:'year',
//				width:40
//			},
				{
					header: GO.leavedays.lang['employee'],
					dataIndex: 'user_name',
					id: 'user_name',
					width: 200,
					renderer: function (v, m, record) {
						if (record.get('need_approve'))
							return '<b>' + v + '</b>';
						return v;
					},
					sortable: true,
					hideable: false
				}, {
					header: GO.leavedays.lang['manager'],
					dataIndex: 'manager_user_name',
					id: 'manager_user_name',
					width: 200,
					sortable: true,
					hideable: false
				}, {
					header: GO.leavedays.lang['leftover'],
					dataIndex: 'leftover',
					id: 'leftover',
					width: 140,
//				hideable: false,
					align: 'right'
				}, {
					header: GO.leavedays.lang['currentYearCredit'],
					dataIndex: 'year_credit',
					id: 'year_credit',
					width: 140,
					sortable: true,
					align: 'right'
				}, {
					header: GO.leavedays.lang['builtUpCredit'],
					dataIndex: 'built_up_credit',
					id: 'built_up_credit',
					width: 140,
//				hideable: false,
					align: 'right'
				}, {
					header: GO.leavedays.lang['creditsUsed'],
					dataIndex: 'credits_used',
					id: 'credits_used',
					width: 140,
//				hideable: false,
					align: 'right'
				}, {
					header: GO.leavedays.lang['wholeYearCredit'],
					dataIndex: 'whole_year_credit',
					id: 'whole_year_credit',
					width: 140,
//				hideable: false,
					align: 'right'
				}, {
					header: GO.leavedays.lang['hoursNationalHolidays'],
					dataIndex: 'n_nat_holiday_hours',
					id: 'n_nat_holiday_hours',
					width: 140,
//				hideable: false,
					align: 'right'
//			},{
//				header:GO.leavedays.lang['currentMonthCredit'],
//				dataIndex: 'current_month_credit',
//				id:'current_month_credit',
//				width:140,
////				hideable: false,
//				align: 'right'
				}],
			sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
			tbar: [tbarItems]
		});

		this.userPanel = new GO.leavedays.UserPanel({region: 'east', split: true});
		config.items = [
			this.yearsGrid,
			this.yearSummaryGrid,
			this.userPanel
		];

		this.yearSummaryGrid.on('delayedrowselect', function (grid, rowIndex, event) {
			var summaryRecord = grid.store.getAt(rowIndex);
			//var yearRecord = this.yearsGrid.getSelectionModel().getSelected();

			this._setUserId(summaryRecord.data['user_id']);
//			this._setYear(yearRecord.data['year']);

			this.userPanel.show({user_name: summaryRecord.data['user_name']});
		}, this);

		this.yearSummaryGrid.on('rowdblclick', function (grid, rowIndex, event) {
			var record = grid.store.getAt(rowIndex);

			if (!GO.leavedays.yearCreditDialog) {
				GO.leavedays.yearCreditDialog = new GO.leavedays.YearCreditDialog();
				GO.leavedays.yearCreditDialog.on('save', function () {
					this.yearSummaryGrid.store.load();
				}, this);
			}
			var yearRecord = this.yearsGrid.getSelectionModel().getSelected();

			GO.leavedays.yearCreditDialog.show(record.id, {
				loadParams: {
					year: yearRecord.data['year']
				}
			});

		}, this);


	} else {

		this.yearsGrid.getSelectionModel().on('rowselect', function (rowSelectionModel, rowIndex, event) {

			var record = rowSelectionModel.getSelected();
			this._setUserId(GO.settings.user_id);
			this._setYear(record.data['year']);

			this.userPanel.show({user_name: ''});
		}, this);

		this.userPanel = new GO.leavedays.UserPanel({region: 'center', split: true});
		config.items = [
			this.yearsGrid,
			this.userPanel
		];
	}

	config.tbar = new Ext.Toolbar({
		cls: 'go-head-tb',
		items: [{
				xtype: 'htmlcomponent',
				html: GO.leavedays.lang.name,
				cls: 'go-module-title-tbar'
			}]
	});

	GO.leavedays.MainPanel.superclass.constructor.call(this, config);

	this.on('afterrender', function (panel) {
		this.yearsGrid.store.load();
	}, this);

	this.yearsGrid.store.on('load', function (store, records, options) {
		if (!GO.util.empty(records[1]))
			this.yearsGrid.getSelectionModel().selectRow(1);
		else
			this.yearsGrid.getSelectionModel().selectRow(0);
	}, this);

}

Ext.extend(GO.leavedays.MainPanel, Ext.Panel, {
	_setUserId: function (userId) {
		GO.leavedays.activeUserId = userId;
	},
	_setYear: function (fullYear) {
		GO.leavedays.activeYear = fullYear;
		if (GO.leavedays.currentUserIsManager) {
			this.yearSummaryGrid.store.baseParams['year'] = fullYear;
			this.yearSummaryGrid.setTitle(fullYear + ': ' + GO.leavedays.lang['leaveHourCredits']);
			this.yearSummaryGrid.store.load();
		}
	}

});


/*
 * This will add the module to the main tabpanel filled with all the modules
 */

GO.moduleManager.addModule('leavedays', GO.leavedays.MainPanel, {
	title: GO.leavedays.lang['name'],
	iconCls: 'go-tab-icon-timeregistration'
});




GO.leavedays.showLeavedayDialog = function (leavedayRecordId, config) {
	if (!GO.leavedays.leavedayDialog) {
		GO.leavedays.leavedayDialog = new GO.leavedays.LeavedayDialog();

	}
	GO.leavedays.leavedayDialog.show(leavedayRecordId, {user_name: this._user_name, loadParams: {user_id: GO.leavedays.activeUserId}});
}