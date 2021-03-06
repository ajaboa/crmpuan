GO.projects2.TreeContextMenu = Ext.extend(Ext.menu.Menu,{
	
	treePanel: false,
	
	initComponent : function(){
		
		this.treePanel = this.initialConfig.treePanel;
		
		this.addProjectBtn = new Ext.menu.Item({
			text:GO.projects2.lang['addProject'],
			handler:function(){
				if(GO.projects2.max_projects>0 && this.treePanel.store.totalLength>=GO.projects2.max_projects)
				{
					Ext.Msg.alert(GO.lang.strError, GO.projects2.lang.maxProjectsReached);
				}else
				{
					GO.projects2.showProjectDialog({
						parent_project_id: this.treePanel.selectedNode.id/*,
						values:{
							type_id:this.parentProject ? this.parentProject.type_id : null
						}*/
					});
				}
			},
			scope:this
		});
		
		this.duplicateProjectBtn = new Ext.menu.Item({
			text:GO.projects2.lang['duplicate'],
			handler:function(){
				if(GO.projects2.max_projects>0 && this.treePanel.store.totalLength>=GO.projects2.max_projects)
				{
					Ext.Msg.alert(GO.lang.strError, GO.projects2.lang.maxProjectsReached);
				}else
				{
					GO.projects2.showProjectDialog({
						project_id: this.treePanel.selectedNode.id,
						duplicate_id: this.treePanel.selectedNode.id/*,
						values:{
							type_id:this.parentProject ? this.parentProject.type_id : null
						}*/
					});
				}
			},
			scope:this
		});
		
		this.editProjectBtn = new Ext.menu.Item({
			text: GO.lang['cmdEdit'],
			handler: function(){
				if(this.treePanel.selectedNode.id !== 'root')
				GO.projects2.showProjectDialog({
					project_id: this.treePanel.selectedNode.id
				});
			},
			scope: this
		});
		
		this.deleteProjectBtn = new Ext.menu.Item({
			text:GO.lang.cmdDelete,
			handler:function(){
				if(confirm(GO.lang.areYouSureDeleteItem.replace('{item}',this.treePanel.selectedNode.text))){
					GO.request({
						url:'projects2/project/delete',
						params:{id:this.treePanel.selectedNode.id},
						scope:this,
						success:function(){

							this.treePanel.selectedNode = this.treePanel.selectedNode.parentNode;
							this.treePanel.selectedNode.select();
							this.treePanel.selectedNode.reload();


							this.treePanel.fireEvent('click', this.treePanel.selectedNode);
						}
					});
				}
			},
			scope:this
		});
		
		this.items=[
			this.addProjectBtn,
			this.editProjectBtn,
			this.duplicateProjectBtn,
			this.deleteProjectBtn
		];

		GO.projects2.TreeContextMenu.superclass.initComponent.call(this);
	},
	
	/**
	 * Enable and disable the correct items in the context menu based on the user's permissions
	 * 
	 * @param int x
	 * @param int y
	 * @returns {undefined}
	 */
	showAt : function(x,y){
		
		if(this.treePanel.selectedNode.id == 'root'){
			
			if(!GO.settings.modules.projects2.write_permission){
				this.addProjectBtn.setDisabled(true);
			} else {
				this.addProjectBtn.setDisabled(false);
			}
			
			this.editProjectBtn.setDisabled(true);
			this.duplicateProjectBtn.setDisabled(true);
			this.deleteProjectBtn.setDisabled(true);
		} else {
			
			if(this.treePanel.selectedNode.id && !this.treePanel.selectedNode.attributes.write_permission){
				this.addProjectBtn.setDisabled(true);
				this.editProjectBtn.setDisabled(true);
				this.deleteProjectBtn.setDisabled(true);
			} else {
				this.addProjectBtn.setDisabled(false);
				this.editProjectBtn.setDisabled(false);
				this.deleteProjectBtn.setDisabled(false);
			}
			
			this.duplicateProjectBtn.setDisabled(false);
		
		}
				
		GO.projects2.TreeContextMenu.superclass.showAt.call(this,x,y);
	}
}
);
