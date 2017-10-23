package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class DistanceMapControl extends MapControlExtension {

	public DistanceMapControl() {
		super("distance");
	}

}
