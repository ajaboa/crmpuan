GO.leavedays.YearCreditDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
//			titleField:'user_name',
			goDialogId: 'yearcredit',
			title: GO.leavedays.lang.yearCredit,
			height: 200,
			width:350,
			formControllerUrl: 'leavedays/yearCredit'
		});

		GO.leavedays.YearCreditDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.propertiesPanel = new Ext.Panel({
			layout: 'form',
			waitMsgTarget: true,
			baseParams: {},
			border: false,
			fileUpload: true,
			items: [this.yearField = new GO.form.ComboBox({
					fieldLabel: GO.leavedays.lang['year'],
					hiddenName: 'year',
					anchor: '100%',
					emptyText: GO.lang.strPleaseSelect,
					store: new GO.data.JsonStore({
						url: GO.url('leavedays/leaveday/yearsStore'),
						root: 'results',
						totalProperty: 'total',
						id: 'year',
						fields: ['year'],
						remoteSort: true
					}),
					pageSize: parseInt(GO.settings.max_rows_list),
					valueField: 'year',
					displayField: 'year',
					mode: 'remote',
					triggerAction: 'all',
					editable: false,
					selectOnFocus: true,
					forceSelection: true,
					allowBlank: false
				}), this.selectUserField = new GO.form.SelectUser({
					fieldLabel: GO.leavedays.lang['employee'],
					allowBlank: false,
					anchor: '100%'

				}),
				 this.selectUserField = new GO.form.SelectUser({
					hiddenName: 'manager_user_id',
					fieldLabel: GO.leavedays.lang['manager'],
					allowBlank: false,
					anchor: '100%'}),
				this.yearCreditField = new GO.form.NumberField({
					fieldLabel:GO.leavedays.lang['yearCredit'],
					name:'n_hours',
					value: 0,
					decimals: 2,
					maxValue: 8784
				})
				]
		});

		this.addPanel(this.propertiesPanel);
	}
});