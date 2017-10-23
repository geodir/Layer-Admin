package com.soluciones.extension.layer;

import java.io.File;

public class GeodirLayer {
	private Class<?> entityClass;

	private int layerId;
	private int id;
	private String name;
	private String alias;
	private String columnId;
	private boolean visible;
	private int order;
	private String description;
	private String geometryType;
	private String geometryColumn;
	private int records;
	private boolean tiled;
	private boolean editable;
	private String path;
	private String sld;
	private String query;
	private String wmsUrl;
	private String layer;

	public int getLayerId() {
		return layerId;
	}

	public void setLayerId(int layerId) {
		this.layerId = layerId;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

	public int getOrder() {
		return order;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getGeometryType() {
		return geometryType;
	}

	public void setGeometryType(String geometryType) {
		this.geometryType = geometryType;
	}

	public int getRecords() {
		return records;
	}

	public void setRecords(int records) {
		this.records = records;
	}

	public boolean isTiled() {
		return tiled;
	}

	public void setTiled(boolean tiled) {
		this.tiled = tiled;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		File layerConfig = new File(path);
		if (!layerConfig.exists()) {
			layerConfig.mkdirs();
		}
		this.path = path;
	}

	public String getGeometryColumn() {
		return geometryColumn;
	}

	public void setGeometryColumn(String geometryColumn) {
		this.geometryColumn = geometryColumn;
	}

	public String getSld() {
		return sld;
	}

	public void setSld(String sld) {
		this.sld = sld;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	public String getColumnId() {
		return columnId;
	}

	public void setColumnId(String columnId) {
		this.columnId = columnId;
	}

	public boolean isEditable() {
		return editable;
	}

	public void setEditable(boolean editable) {
		this.editable = editable;
	}

	public String getWmsUrl() {
		return wmsUrl;
	}

	public void setWmsUrl(String wmsUrl) {
		this.wmsUrl = wmsUrl;
	}

	public String getLayer() {
		return layer;
	}

	public void setLayer(String layer) {
		this.layer = layer;
	}

	public Class<?> getEntityClass() {
		return entityClass;
	}

	public void setEntityClass(Class<?> entityClass) {
		this.entityClass = entityClass;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		GeodirLayer other = (GeodirLayer) obj;
		if (id != other.id)
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "GeodirLayer [entityClass=" + entityClass + ", layerId=" + layerId + ", id=" + id + ", name=" + name
				+ ", alias=" + alias + ", columnId=" + columnId + ", visible=" + visible + ", order=" + order
				+ ", description=" + description + ", geometryType=" + geometryType + ", geometryColumn="
				+ geometryColumn + ", records=" + records + ", tiled=" + tiled + ", editable=" + editable + ", path="
				+ path + ", sld=" + sld + ", query=" + query + ", wmsUrl=" + wmsUrl + ", layer=" + layer + "]";
	}

	
	
}
