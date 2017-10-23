package com.soluciones.extension.layer.service;

import java.util.List;

import com.soluciones.extension.layer.GeodirLayer;

public interface GeodirExternalLayerService {

	List<GeodirLayer> getLayers(String urlServer);
}
