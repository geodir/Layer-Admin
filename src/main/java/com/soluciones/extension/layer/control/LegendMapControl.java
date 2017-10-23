package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class LegendMapControl extends MapControlExtension{

	public LegendMapControl() {
		super("legend");
	}

}
