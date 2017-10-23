package com.soluciones.extension.layer;

import java.util.List;

import com.soluciones.extension.layer.model.Condition;

public interface GeodirLayerConfiguration {
	
	public GeodirLayer getLayer();

	public void setLayer(GeodirLayer layer);

	public List<GeodirLayer> getLayerlist();

	public void setLayerlist(List<GeodirLayer> layerlist);

	public void onReorderLayers();

	public void addlayer(GeodirLayer layer);

	public String getConfigurationPath();

	public void setConfigurationPath(String configurationPath);

	public int getIdSequence();

	public void setIdSequence(int idSequence);

	public void sort();

	public List<Condition> getDafaultConditions();

	public void setDafaultConditions(List<Condition> dafaultConditions);

	public String generateSQL();

	public int getIdLayerSelect();

	public void setIdLayerSelect(int idLayerSelect);

	void removelayer(GeodirLayer layer);
	
}
