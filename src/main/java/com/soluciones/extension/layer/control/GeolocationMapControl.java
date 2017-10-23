package com.soluciones.extension.layer.control;

import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.MapControlExtension;

@Component
public class GeolocationMapControl extends MapControlExtension{

	public GeolocationMapControl() {
		super("geolocation");
	}

}
