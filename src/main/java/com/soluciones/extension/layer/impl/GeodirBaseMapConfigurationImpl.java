package com.soluciones.extension.layer.impl;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.soluciones.extension.layer.GeodirBaseMapConfiguration;

@XmlRootElement
@XmlAccessorType(XmlAccessType.NONE)
public class GeodirBaseMapConfigurationImpl implements GeodirBaseMapConfiguration {

	private String baseName = "Calles";
	private String center = "[ -9.297306856327584,-74.37744140625 ]";
	private int zoom = 6;
	private String bbox = "-89.7802734375,-18.916679786648565,-58.97460937499999,0.5932511181408705";
	private String configurationPath;

	public GeodirBaseMapConfigurationImpl() {
	}

	@Override
	@XmlElement
	public String getBaseName() {
		return baseName;
	}

	@Override
	public void setBaseName(String baseName) {
		this.baseName = baseName;
	}

	@Override
	@XmlElement
	public String getCenter() {
		return center;
	}

	@Override
	public void setCenter(String center) {
		this.center = center;
	}

	@Override
	@XmlElement
	public int getZoom() {
		return zoom;
	}

	@Override
	public void setZoom(int zoom) {
		this.zoom = zoom;
	}

	@Override
	@XmlElement
	public String getBbox() {
		return bbox;
	}

	@Override
	public void setBbox(String bbox) {
		this.bbox = bbox;
	}

	@Override
	@XmlElement
	public String getConfigurationPath() {
		return configurationPath;
	}

	@Override
	public void setConfigurationPath(String configurationPath) {
		this.configurationPath = configurationPath;

	}

}
