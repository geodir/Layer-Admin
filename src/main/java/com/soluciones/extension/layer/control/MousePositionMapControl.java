package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class MousePositionMapControl extends MapControlExtension{

	public MousePositionMapControl() {
		super("mouseposition");
	}

}
