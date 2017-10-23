package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class FullScreenMapControl extends MapControlExtension {

	public FullScreenMapControl() {
		super("fullscreen");
	}

}
