package com.soluciones.extension.layer.impl;

import java.io.File;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.soluciones.extension.layer.GeodirBaseMapConfiguration;
import com.soluciones.extension.layer.GeodirBaseMapManager;

public class GeodirBaseMapManagerImpl implements GeodirBaseMapManager {

	private final Logger log = LoggerFactory.getLogger(this.getClass());
	private GeodirBaseMapConfiguration baseMapConfiguration;
	private String pathFileConfiguration;

	@Override
	public void loadConfiguration(Class<? extends GeodirBaseMapConfiguration> clazz, String pathConfiguration) {
		this.pathFileConfiguration = pathConfiguration + "map.xml";
		log.info("Load from: "+this.pathFileConfiguration);
		File file = new File(this.pathFileConfiguration);
		if (file.exists()) {
			try {
				JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
				Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
				this.baseMapConfiguration = (GeodirBaseMapConfiguration) jaxbUnmarshaller.unmarshal(file);
				this.baseMapConfiguration.setConfigurationPath(pathConfiguration);
			} catch (JAXBException e) {
				e.printStackTrace();
				this.baseMapConfiguration = null;
			}
		} else {
			this.baseMapConfiguration = null;
		}
	}

	@Override
	public void newConfiguration(String pathConfiguration) {
		this.pathFileConfiguration = pathConfiguration + "map.xml";
		log.info("New in: "+this.pathFileConfiguration);
		File file = new File(pathFileConfiguration);
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(this.baseMapConfiguration.getClass());
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(this.baseMapConfiguration, file);
			log.info("done..");
		} catch (JAXBException e) {
			log.error("fail creating file..", e);
		}

	}

	@Override
	public void saveConfiguration(String pathConfiguration) {
		log.info("Save in: "+this.pathFileConfiguration);
		File file = new File(this.pathFileConfiguration);
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(this.baseMapConfiguration.getClass());
			Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
			jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			jaxbMarshaller.marshal(this.baseMapConfiguration, file);
			log.info("done..");
		} catch (JAXBException e) {
			log.error("fail creating file..", e);
		}

	}

	@Override
	public GeodirBaseMapConfiguration getMapConfiguration() {
		return baseMapConfiguration;
	}

	@Override
	public void setMapConfiguration(GeodirBaseMapConfiguration mapConfiguration) {
		this.baseMapConfiguration = mapConfiguration;

	}

}
