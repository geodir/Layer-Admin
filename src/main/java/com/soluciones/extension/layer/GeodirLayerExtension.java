package com.soluciones.extension.layer;

import java.util.Map;
import java.util.Set;

public interface GeodirLayerExtension {

	Map<MapExtensionType, Map<String, GeodirMapExtension>> getExtensionTypesNames();

	Map<MapExtensionType, Set<String>> getExtensionNames();

}
