package com.soluciones.extension.layer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.soluciones.extension.layer.GeodirBaseMapConfiguration;
import com.soluciones.extension.layer.GeodirBaseMapManager;
import com.soluciones.extension.layer.impl.GeodirBaseMapConfigurationImpl;

@Controller
@RequestMapping("geodir/ext/basemap")
public class GeodirBaseMapController {
	
	@Autowired
	private GeodirBaseMapManager geodirBaseMapManager;
	
	
	@GetMapping("/json")
	public ResponseEntity<GeodirBaseMapConfiguration> getConfMap(){
		return new ResponseEntity<GeodirBaseMapConfiguration>(geodirBaseMapManager.getMapConfiguration(), HttpStatus.OK);
	}
	
	
	@PutMapping(value = "/saveconf")
	public ResponseEntity<?> saveConfMap(@RequestBody GeodirBaseMapConfigurationImpl geodirBaseMapConfigurationImpl){
		geodirBaseMapManager.setMapConfiguration(geodirBaseMapConfigurationImpl);
		geodirBaseMapManager.saveConfiguration(geodirBaseMapManager.getMapConfiguration().getConfigurationPath()+"map.xml");
		return new ResponseEntity<>(HttpStatus.OK);
	}

}
