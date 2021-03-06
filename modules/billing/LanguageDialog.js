/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: LanguageDialog.js 18394 2014-02-27 16:20:31Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.LanguageDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	
	config.autoHeight=true;
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=500;
	config.closeAction='hide';
	config.title= GO.billing.lang.language;					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
			text: GO.lang['cmdOk'],
			handler: function(){
				this.submitForm(true);
			},
			scope: this
		},{
			text: GO.lang['cmdApply'],
			handler: function(){
				this.submitForm();
			},
			scope:this
		},{
			text: GO.lang['cmdClose'],
			handler: function(){
				this.hide();
			},
			scope:this
		}					
	];
	
	GO.billing.LanguageDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.LanguageDialog, Ext.Window,{
	
	show : function (language_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if(!language_id)
		{
			language_id=0;			
		}
			
		this.setLanguageId(language_id);
		
		if(this.language_id>0)
		{
			this.formPanel.load({
				
				success:function(form, action)
				{
					GO.billing.LanguageDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
				
			});
		}else 
		{
			
			this.formPanel.form.reset();
			
			GO.billing.LanguageDialog.superclass.show.call(this);
		}
	},
	
	
		
		
	
	
	setLanguageId : function(language_id)
	{
		this.formPanel.form.baseParams['id']=language_id;
		this.language_id=language_id;
		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url("billing/language/submit"),

			waitMsg:GO.lang['waitMsgSave'],
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else
				{
				
					if(action.result.id)
					{
						this.setLanguageId(action.result.id);
											
					}
				}
				
									
			},		
			failure: function(form, action) {
				if(action.failureType == 'client')
				{					
					Ext.MessageBox.alert(GO.lang['strError'], GO.lang['strErrorsInForm']);			
				} else {
					Ext.MessageBox.alert(GO.lang['strError'], action.result.feedback);
				}
			},
			scope: this
		});
		
	},
	
	
	buildForm : function () {
		this.formPanel = new Ext.form.FormPanel({
			url: GO.url("billing/language/load"),
			border: false,
			baseParams: {task: 'language'},		
			waitMsgTarget:true,				
			cls:'go-form-panel',			
			layout:'form',
			autoHeight:true,
			items:[new Ext.form.ComboBox({
				name: 'language_text',
				store:  new Ext.data.SimpleStore({
						fields: ['id', 'language'],
						data : GO.Languages
					}),
				displayField:'language',
				valueField: 'id',
				hiddenName:'language',
				mode:'local',
				triggerAction:'all',
				selectOnFocus:true,
				forceSelection: true,
				fieldLabel: GO.billing.lang.language,
				anchor: '100%',
				allowBlank:false				
			}),{
				xtype: 'textfield',
			  name: 'name',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: GO.lang.strName
			}
]
				
		});
		    
	}
});