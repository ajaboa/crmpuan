/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: PrintCategoryCountDialog.js 16635 2014-01-17 14:37:56Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.calendar.PrintCategoryCountDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	initComponent : function(){

		Ext.apply(this, {
			goDialogId:'printCategoryCountDialog',
			title:GO.calendar.lang.cmdPrintCategoryCount,
			formControllerUrl:'calendar/calendar',
			collapsible:true,
			loadOnNewModel:false,
			layout:'fit',
			modal:false,
			resizable:true,
			maximizable:true,
			width:400,
			height:165,
			closeAction:'hide',
			enableOkButton : false,
			enableApplyButton : false,
			enableCloseButton : false,
			
			buttons:[{
				text: GO.lang['cmdExport'],
				handler: function(){
					this.submitForm(true);
				},
				scope: this
			},{
				text: GO.lang['cmdClose'],
				handler: function(){
					this.hide();
				},
				scope:this
			}]
		});		
		
		GO.calendar.PrintCategoryCountDialog.superclass.initComponent.call(this);	
	},
	
	beforeSubmit : function(params){
		
		this.formPanel.form.standardSubmit = true;
		this.formPanel.form.getEl().dom.target = '_blank';
		this.formPanel.form.getEl().dom.action = GO.url('calendar/calendar/printCategoryCount');
		
		GO.calendar.PrintCategoryCountDialog.superclass.beforeSubmit.call(this,params);	
	},
		
	buildForm : function () {	
		
		var now = new Date();
		var startOfLastMonth = now.getFirstDateOfMonth();
		var endOfLastMonth = now.getLastDateOfMonth();

		this.startDateField = new Ext.form.DateField({
			flex:1,
			name : 'startDate',
			anchor: '100%',
			format : GO.settings['date_format'],
			allowBlank : false,
			fieldLabel: GO.calendar.lang.startDate,
			value: startOfLastMonth.format(GO.settings.date_format)
		});
		
		this.endDateField = new Ext.form.DateField({
			flex:1,
			name : 'endDate',
			anchor: '100%',
			format : GO.settings['date_format'],
			allowBlank : false,
			fieldLabel: GO.calendar.lang.endDate,
			value: endOfLastMonth.format(GO.settings.date_format)
		});
	
		this.previousMonthButton = new Ext.Button({
			flex:1,
			text: GO.calendar.lang.previousMonth,
			handler: function(){
				this.changeMonth(-1);
			},
			scope:this
		});
		
		this.nextMonthButton = new Ext.Button({
			flex:1,
			text: GO.calendar.lang.nextMonth,
			handler: function(){
				this.changeMonth(1);
			},
			scope:this
		});
		
		this.startComp = new Ext.form.CompositeField({
			items:[
				this.startDateField,
				this.previousMonthButton
			]
		});
		
		this.endComp = new Ext.form.CompositeField({
			items:[
				this.endDateField,
				this.nextMonthButton
			]
		});
	
	
		this.propertiesPanel = new Ext.Panel({
			waitMsgTarget:true,			
			border: false,
			autoScroll:true,
			title:GO.lang['strProperties'],
			layout:'form',
			cls:'go-form-panel',
			items : [
				this.startComp,
				this.endComp
			]
		});
			
		this.addPanel(this.propertiesPanel);
	},
	changeMonth : function(increment)
	{
		var date = this.startDateField.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDateField.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDateField.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));
	}
});