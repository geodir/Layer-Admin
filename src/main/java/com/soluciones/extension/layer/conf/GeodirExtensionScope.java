package com.soluciones.extension.layer.conf;

import org.springframework.stereotype.Component;


public abstract class GeodirExtensionScope {

	protected boolean activate;

	public GeodirExtensionScope(boolean activate) {
		super();
		this.activate = activate;
	}

}
