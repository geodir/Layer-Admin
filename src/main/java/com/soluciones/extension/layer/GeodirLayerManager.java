package com.soluciones.extension.layer;

import java.io.InputStream;

public interface GeodirLayerManager {

	public void loadConfiguration(Class<? extends GeodirLayerConfiguration> cl, String pathConfiguracion);

	public void loadConfiguration(Class<? extends GeodirLayerConfiguration> cl, InputStream inputStream);

	public void newConfiguration(String pathConfiguracion);

	public void saveConfiguration();

	public GeodirLayerConfiguration getLayerConfiguration();

	public void setLayerConfiguration(GeodirLayerConfiguration layerConfiguration);

}
