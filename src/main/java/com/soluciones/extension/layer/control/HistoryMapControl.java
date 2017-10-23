package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class HistoryMapControl extends MapControlExtension {

	public HistoryMapControl() {
		super("history");
	}

}
