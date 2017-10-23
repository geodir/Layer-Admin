package com.soluciones.extension.layer.service;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.geotools.data.ows.Layer;
import org.geotools.data.ows.WMSCapabilities;
import org.geotools.data.wms.WebMapServer;
import org.springframework.stereotype.Service;

import com.soluciones.extension.layer.GeodirLayer;

@Service
public class GeodirExternalLayerServiceImpl implements GeodirExternalLayerService {

	@Override
	public List<GeodirLayer> getLayers(String urlServer) {
		System.out.println("URL: "+urlServer);
		URL url = null;
		String wmsURL = "";
		try {
			url = new URL(urlServer);
			wmsURL = url.getProtocol() + "://" + url.getAuthority() + url.getPath();
		} catch (Exception e) {
			System.out.println("Url erro "+e.getMessage());
			return null;
		}
		WebMapServer wms = null;
		try {
			wms = new WebMapServer(url);
		} catch (Exception e) {
			System.out.println("WebMapServer error "+e.getMessage());
			return null;
		}
		
		WMSCapabilities capabilities = wms.getCapabilities();
		List<Layer> layers = capabilities.getLayerList();
		List<GeodirLayer> geodirLayers = new ArrayList<>();
		int i = 1;
		for (Layer layer : layers) {
			if(layer.getName() != null) {
				GeodirLayer geodirLayer = new GeodirLayer();
				geodirLayer.setId(i);
				geodirLayer.setAlias(layer.getTitle());
				geodirLayer.setName(layer.getTitle());
				geodirLayer.setDescription(layer.getTitle());
				geodirLayer.setWmsUrl(wmsURL);
				geodirLayer.setLayer(layer.getName());
				geodirLayer.setQuery("");
				geodirLayer.setVisible(true);
				geodirLayers.add(geodirLayer);
				i ++;
			}
			
		}
		return geodirLayers;
	}

}
