package com.soluciones.extension.layer.conf;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@PropertySource(value = { "classpath:application.properties" })
@Configuration
@Component
public class LayeProyectConf {
	@Value("${geodir.ext.layers.proyectworkspace:D:/}")
	private String workspaceProyects;

	public String getWorkspaceProyects() {
		return workspaceProyects;
	}

	public void setWorkspaceProyects(String workspaceProyects) {
		this.workspaceProyects = workspaceProyects;
	}

}
