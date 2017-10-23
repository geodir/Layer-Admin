package com.soluciones.extension.layer;

public interface GeodirBaseMapConfiguration {

	public String getBaseName();

	public void setBaseName(String baseName);

	public String getCenter();

	public void setCenter(String center);

	public int getZoom();

	public void setZoom(int zoom);

	public String getBbox();

	public void setBbox(String bbox);
	
	public String getConfigurationPath();
	
	public void setConfigurationPath(String configurationPath);
}
