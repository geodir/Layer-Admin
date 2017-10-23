package com.soluciones.extension.layer.options;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.LayerOptionsExtension;

@Component
public class DeleteLayerOption extends LayerOptionsExtension<DeleteOption> {

	public DeleteLayerOption() {
		super("delete");
	}

	@Override
	public DeleteOption loadOptionExtention(Integer id) {
		DeleteOption deleteOption = new DeleteOption();
		deleteOption.setName(this.getExtensionName());
		deleteOption.setId(id);
		return deleteOption;
	}

}
