package com.soluciones.extension.layer.model;

public class QueryValue {
	private String value;
	private String alias;
	private Object realValue;

	public QueryValue() {

	}

	public QueryValue(String value, String alias) {
		this.value = value;
		this.alias = alias;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public Object getRealValue() {
		return realValue;
	}

	public void setRealValue(Object realValue) {
		this.realValue = realValue;
	}

}
