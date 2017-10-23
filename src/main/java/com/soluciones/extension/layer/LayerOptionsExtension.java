package com.soluciones.extension.layer;

public abstract class LayerOptionsExtension<T extends LayerOption> extends GeodirMapExtension {

	
	public LayerOptionsExtension(String extensionName) {
		super(MapExtensionType.LAYER_OPTION_EXTENSION, extensionName);
	}

	public abstract T loadOptionExtention(Integer id);
}
