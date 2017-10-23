package com.soluciones.extension.layer;

public abstract class GeodirMapExtension {
	protected final MapExtensionType extensionType;
	protected final String extensionName;

	public GeodirMapExtension(MapExtensionType extensionType, String extensionName) {
		this.extensionType = extensionType;
		this.extensionName = extensionName;
	}

	public MapExtensionType getExtensionType() {
		return extensionType;
	}

	public String getExtensionName() {
		return extensionName;
	}

}
