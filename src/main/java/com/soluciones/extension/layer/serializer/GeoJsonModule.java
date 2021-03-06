package com.soluciones.extension.layer.serializer;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.vividsolutions.jts.geom.Geometry;

public class GeoJsonModule extends SimpleModule {

	public GeoJsonModule() {
		super("GeoJson", new Version(1, 0, 0, null, "com.bedatadriven", "jackson-geojson"));

		addSerializer(Geometry.class, new GeometrySerializer());
		addDeserializer(Geometry.class, new GeometryDeserializer());
	}
}