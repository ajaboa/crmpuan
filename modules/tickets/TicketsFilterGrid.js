/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TicketsFilterGrid.js 15897 2013-05-21 09:02:45Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TicketsFilterGrid = function(config)
{
	if(!config)
		config = {};			
	
	config.bbar=[ this.showMineOnlyField = new Ext.form.Checkbox({
		boxLabel: GO.tickets.lang.showMineOnly,
		labelSeparator: '',
		handler:function()
		{
			var showMineOnly = this.showMineOnlyField.getValue();
			this.store.load({
				params:{showMineOnly:showMineOnly ? 1 : 0}
			});

			var tp = GO.mainLayout.getModulePanel("tickets");
			if(tp)
				tp.centerPanel.store.load();
		},
		scope:this,
		name: 'show_mine_only',
		allowBlank: true,
		ctCls:'ti-show-mine-only-cb'
	})];

	config.store.on('load', function(){
		
		if(this.showMineOnlyField){
			this.showMineOnlyField.setValue(!GO.util.empty(this.store.reader.jsonData.showMineOnly));
			
			if(!this.store.reader.jsonData.hasManagedTypes)
				this.showMineOnlyField.setVisible(false);
			else
				this.showMineOnlyField.setVisible(true);
		}
		
	}, this);

	GO.tickets.TicketsFilterGrid.superclass.constructor.call(this, config);
}

Ext.extend(GO.tickets.TicketsFilterGrid, GO.grid.MultiSelectGrid);