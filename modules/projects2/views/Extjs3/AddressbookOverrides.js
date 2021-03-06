/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: AddressbookOverrides.js 20387 2015-04-03 13:40:32Z wsmits $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */

GO.moduleManager.onModuleReady('addressbook',function(){

	Ext.override(GO.addressbook.CompanyDialog, {

		show : GO.addressbook.CompanyDialog.prototype.show.createSequence(function(company_id){
			
			if(!this.incomeContractGrid){
				this.incomeContractGrid = new GO.projects2.CompanyIncomeContractGrid();
				this.tabPanel.add(this.incomeContractGrid);
			}
			
			this.tabPanel.hideTabStripItem(this.incomeContractGrid);
			
			this.incomeContractGrid.store.baseParams.companyId = company_id;	
			this.incomeContractGrid.store.load({
				callback:function(records, options, success){
					if(records.length > 0){
						this.tabPanel.unhideTabStripItem(this.incomeContractGrid);
					}
				},
				scope:this
			});
		})
	});
});