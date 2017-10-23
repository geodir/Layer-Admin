package com.soluciones.extension.layer;

public interface GeodirBaseMapManager {

	void loadConfiguration(Class<? extends GeodirBaseMapConfiguration> clazz, String pathConfiguration);

	void newConfiguration(String pathConfiguration);

	void saveConfiguration(String pathConfiguration);

	GeodirBaseMapConfiguration getMapConfiguration();

	void setMapConfiguration(GeodirBaseMapConfiguration mapConfiguration);
}
