package com.soluciones.extension.layer.impl;

import java.io.File;
import java.io.InputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.soluciones.extension.layer.GeodirLayerConfiguration;
import com.soluciones.extension.layer.GeodirLayerManager;

public class GeodirLayerManagerImpl implements GeodirLayerManager {
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	private GeodirLayerConfiguration layerConfiguration;
	private String pathFileConfiguration;
	
	

	public GeodirLayerManagerImpl() {

	}

	@Override
	public void loadConfiguration(Class<? extends GeodirLayerConfiguration> cl, String pathConfiguracion) {
		this.pathFileConfiguration = pathConfiguracion + "conf.xml";
		File file = new File(this.pathFileConfiguration);
		if (file.exists()) {
			try {
				JAXBContext jaxbContext = JAXBContext.newInstance(cl);
				Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
				this.layerConfiguration = (GeodirLayerConfiguration) jaxbUnmarshaller.unmarshal(file);
				this.layerConfiguration.setConfigurationPath(pathConfiguracion);
			} catch (JAXBException e) {
				e.printStackTrace();
				this.layerConfiguration = null;
			}
		} else {
			this.layerConfiguration = null;
		}
	}

	@Override
	public void loadConfiguration(Class<? extends GeodirLayerConfiguration> cl, InputStream inputStream) {
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(cl);
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			this.layerConfiguration = (GeodirLayerConfiguration) jaxbUnmarshaller.unmarshal(inputStream);
		} catch (JAXBException e) {
			e.printStackTrace();
			this.layerConfiguration = null;
		}
	}

	@Override
	public GeodirLayerConfiguration getLayerConfiguration() {
		return layerConfiguration;
	}

	@Override
	public void setLayerConfiguration(GeodirLayerConfiguration layerConfiguration) {
		this.layerConfiguration = layerConfiguration;
	}

	@Override
	public void newConfiguration(String pathConfiguracion) {
		this.pathFileConfiguration = pathConfiguracion;
		File file = new File(pathConfiguracion);
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(this.layerConfiguration.getClass());
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(this.layerConfiguration, file);
			log.info("done..");
		} catch (JAXBException e) {
			log.error("fail creating file..", e);
		}
	}

	@Override
	public void saveConfiguration() {
		File file = new File(this.pathFileConfiguration);
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(this.layerConfiguration.getClass());
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(this.layerConfiguration, file);
			log.info("done..");
		} catch (JAXBException e) {
			log.error("fail creating file..", e);
		}
	}
}
