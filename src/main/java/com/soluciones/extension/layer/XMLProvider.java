package com.soluciones.extension.layer;

import java.io.File;
import java.io.InputStream;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

public class XMLProvider {
	@SuppressWarnings("unchecked")
	public static <T> T load(Class<T> cl, String pathConfiguracion) {
		File file = new File(pathConfiguracion);
		if (file.exists()) {
			try {
				JAXBContext jaxbContext = JAXBContext.newInstance(cl);
				Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
				return (T) jaxbUnmarshaller.unmarshal(file);
			} catch (JAXBException e) {
				e.printStackTrace();
				return null;
			}
		} else {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public static <T> T load(Class<T> cl, InputStream inputStream) {
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(cl);
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			return (T) jaxbUnmarshaller.unmarshal(inputStream);
		} catch (JAXBException e) {
			e.printStackTrace();
			return null;
		}
	}
}
