package com.soluciones.extension.layer.controller;

import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.soluciones.extension.layer.GeodirLayerExtension;
import com.soluciones.extension.layer.GeodirLayerManager;
import com.soluciones.extension.layer.MapExtensionType;

@Component
public abstract class LayerController {

	@Autowired
	protected GeodirLayerManager geodirLayerManager;

	@Autowired
	protected GeodirLayerExtension geodirLayerExtension;

	public void getLayers(Model model) {
		if (this.geodirLayerManager.getLayerConfiguration() != null) {
			model.addAttribute("layers", geodirLayerManager.getLayerConfiguration().getLayerlist());
			model.addAttribute("CurrentLayerId", geodirLayerManager.getLayerConfiguration().getIdLayerSelect());
		}
	}

	@ModelAttribute
	public void modelAgregation(Model model) {
		Iterator<MapExtensionType> it = geodirLayerExtension.getExtensionNames().keySet().iterator();
		while (it.hasNext()) {
			MapExtensionType key = it.next();
			model.addAttribute(key.name(), geodirLayerExtension.getExtensionNames().get(key));
		}
		// return geodirLayerExtension.getExtensionNames();
	}

}
