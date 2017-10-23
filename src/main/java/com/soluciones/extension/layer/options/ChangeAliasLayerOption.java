package com.soluciones.extension.layer.options;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.LayerOptionsExtension;


@Component
public class ChangeAliasLayerOption extends LayerOptionsExtension<ChangeAliasOption>{

	public ChangeAliasLayerOption() {
		super("changealias");
	}

	@Override
	public ChangeAliasOption loadOptionExtention(Integer id) {
		ChangeAliasOption changeAliasOption = new ChangeAliasOption();
		changeAliasOption.setName(this.extensionName);
		changeAliasOption.setId(id);
		return changeAliasOption;
	}

}
