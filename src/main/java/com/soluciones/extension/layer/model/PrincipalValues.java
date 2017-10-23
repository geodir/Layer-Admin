package com.soluciones.extension.layer.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PrincipalValues {
	private BigDecimal minValue;

	private BigDecimal maxValue;

	private List<QueryValue> listDistinct;

	public PrincipalValues() {
		listDistinct = new ArrayList<QueryValue>();
	}

	public BigDecimal getMinValue() {
		return minValue;
	}

	public void setMinValue(BigDecimal minValue) {
		this.minValue = minValue;
	}

	public BigDecimal getMaxValue() {
		return maxValue;
	}

	public void setMaxValue(BigDecimal maxValue) {
		this.maxValue = maxValue;
	}

	public List<QueryValue> getListDistinct() {
		return listDistinct;
	}

	public void setListDistinct(List<QueryValue> listDistinct) {
		this.listDistinct = listDistinct;
	}
}
