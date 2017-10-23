package com.soluciones.extension.layer.service;

import com.soluciones.extension.core.model.ColumnModel;
import com.soluciones.extension.layer.model.PrincipalValues;

public interface LayerColumnDetailsService {

	public PrincipalValues obtainColumnMetadata(final String tableName, ColumnModel columnModel);

}
