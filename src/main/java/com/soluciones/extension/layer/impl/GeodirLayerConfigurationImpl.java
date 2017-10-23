package com.soluciones.extension.layer.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.soluciones.extension.layer.GeodirLayer;
import com.soluciones.extension.layer.GeodirLayerConfiguration;
import com.soluciones.extension.layer.model.Condition;

@XmlRootElement
@XmlAccessorType(XmlAccessType.NONE)
public class GeodirLayerConfigurationImpl implements GeodirLayerConfiguration {
	protected List<Condition> dafaultConditions;
	private String configurationPath;
	private GeodirLayer layer;
	private List<GeodirLayer> layerlist;
	private int idSequence = 0;
	private int idLayerSelect = 0;

	public GeodirLayerConfigurationImpl() {
		this.layerlist = new ArrayList<>();
		this.dafaultConditions = new ArrayList<>();
	}

	@Override
	@XmlElement
	public GeodirLayer getLayer() {
		return layer;
	}

	@Override
	public void setLayer(GeodirLayer layer) {
		this.idLayerSelect = layer.getId();
		this.layer = layer;
	}

	@Override
	@XmlElement
	public int getIdLayerSelect() {
		return idLayerSelect;
	}

	@Override
	public void setIdLayerSelect(int idLayerSelect) {
		this.idLayerSelect = idLayerSelect;
	}

	@Override
	@XmlElement
	public List<GeodirLayer> getLayerlist() {
		return layerlist;
	}

	@Override
	public void setLayerlist(List<GeodirLayer> layerlist) {
		this.layerlist = layerlist;
	}

	@Override
	@XmlElement
	public String getConfigurationPath() {
		return configurationPath;
	}

	@Override
	@XmlElement
	public int getIdSequence() {
		return idSequence;
	}

	@Override
	public void setIdSequence(int idSequence) {
		this.idSequence = idSequence;
	}

	@Override
	@XmlElement
	public List<Condition> getDafaultConditions() {
		return dafaultConditions;
	}

	@Override
	public void setDafaultConditions(List<Condition> dafaultConditions) {
		this.dafaultConditions = dafaultConditions;
	}

	@Override
	public void setConfigurationPath(String configurationPath) {
		this.configurationPath = configurationPath;
	}

	@Override
	public void onReorderLayers() {
		throw new UnsupportedOperationException();
	}

	@Override
	public void addlayer(GeodirLayer layer) {
		layer.setOrder(this.layerlist.size() + 1);
		this.idSequence++;
		layer.setId(idSequence);
		this.layerlist.add(0,layer);
		if (this.layerlist.size() == 1) {
			this.idLayerSelect = layer.getId();
		}
	}
	
	@Override
	public void removelayer(GeodirLayer layer) {
		this.layerlist.remove(layer);
		if (layer.getId()==this.idLayerSelect) {
			this.idLayerSelect = 0;
			for (GeodirLayer lay : this.layerlist) {
				this.idLayerSelect = lay.getId();
				break;
			}
		}
		layer = null;
	}

	@Override
	public void sort() {
		Collections.sort(this.layerlist, new Comparator<GeodirLayer>() {
			@Override
			public int compare(GeodirLayer z1, GeodirLayer z2) {
				return ((Integer) z1.getOrder()).compareTo((Integer) z2.getOrder());
			}
		});
	}

	@Override
	public String generateSQL() {
		StringBuilder SQL = new StringBuilder();
		List<String> defCon = new ArrayList<>();
		for (Condition def : dafaultConditions) {
			String defSQL = def.toSQL(def.getColumn().getName());
			if (defSQL!=null) {
				defCon.add(defSQL);
			}
		}
		SQL.append(String.join(" AND ", defCon));
		return SQL.toString();
	}

}
