package com.soluciones.extension.layer.impl;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import com.soluciones.extension.layer.GeodirLayerExtension;
import com.soluciones.extension.layer.GeodirMapExtension;
import com.soluciones.extension.layer.MapExtensionType;

@Component
public class GeodirLayerExtensionImpl implements GeodirLayerExtension {
	protected final Logger log = LoggerFactory.getLogger(this.getClass());
	private final Map<MapExtensionType, Map<String, GeodirMapExtension>> extensionTypesNames;
	private final Map<MapExtensionType, Set<String>> extensionNames;

	@Autowired
	public GeodirLayerExtensionImpl(ApplicationContext ctx) {
		this.extensionTypesNames = new TreeMap<>();
		this.extensionNames = new TreeMap<>();
		Map<String, GeodirMapExtension> producers = ctx.getBeansOfType(GeodirMapExtension.class);
		Iterator<String> it = producers.keySet().iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (!extensionTypesNames.containsKey(producers.get(key).getExtensionType())) {
				extensionTypesNames.put(producers.get(key).getExtensionType(), new TreeMap<>());
				extensionNames.put(producers.get(key).getExtensionType(), new TreeSet<String>());
				log.info("adding new extension type .. " + producers.get(key).getExtensionType());
			}
			log.info("adding new extension : " + producers.get(key).getExtensionType() + " : "
					+ producers.get(key).getExtensionName());
			extensionTypesNames.get(producers.get(key).getExtensionType()).put(producers.get(key).getExtensionName(),
					producers.get(key));
			extensionNames.get(producers.get(key).getExtensionType()).add(producers.get(key).getExtensionName());
		}
	}

	@Override
	public Map<MapExtensionType, Map<String, GeodirMapExtension>> getExtensionTypesNames() {
		return extensionTypesNames;
	}

	@Override
	public Map<MapExtensionType, Set<String>> getExtensionNames() {
		return extensionNames;
	}

}
