GO.moduleManager.onModuleReady('customfields', function(){
	GO.customfields.nonGridTypes.push('file');

	GO.customfields.dataTypes['GO\\Phpcustomfield\\Customfieldtype\\Php'] = {
			label : 'Php',
			onSelect: function(fieldDialog) {
				if(!fieldDialog.code_field) {
					fieldDialog.code_field = new Ext.form.TextArea({
						name:'extra_options',
						height:200,
						fieldLabel:'PHP code',
						value: fieldDialog.loadData.extra_options,
						emptyText: "eg: return $model->name . ' = ' . $cf->col_1;",
						anchor: '-20 -20'
					});
					fieldDialog.extraOptions.setHeight(245);
					fieldDialog.extraOptions.add(fieldDialog.code_field);
					fieldDialog.extraOptions.doLayout();
				}
				fieldDialog.code_field.setValue(fieldDialog.loadData.extra_options || '');
				fieldDialog.extraOptions.setVisible(true);
			},
			onDeselect: function(fieldDialog) {
				fieldDialog.extraOptions.setVisible(false);
			},
			getFormField : function(customfield, config){

				var f = GO.customfields.dataTypes['GO\\Customfields\\Customfieldtype\\Text'].getFormField(customfield, config);
				delete f.anchor;

				return Ext.apply(f, {
					xtype:'displayfield',
					width:120
				});
			}
		};
	});