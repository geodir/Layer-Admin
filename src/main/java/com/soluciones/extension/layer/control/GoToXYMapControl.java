package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class GoToXYMapControl extends MapControlExtension{

	public GoToXYMapControl() {
		super("gotoxy");
	}

}
