package com.soluciones.extension.layer.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import com.soluciones.extension.core.model.ColumnModel;

@XmlAccessorType(XmlAccessType.NONE)
public class Condition {
	private int id;
//	private String column;
//	private String alias;
	private ColumnModel column;
	private Operator operator;
	private QueryValue[] value;
	private List<Condition> conditions;

	public Condition() {
		conditions = new ArrayList<>();
	}

	@XmlElement
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}


	@XmlElement
	public ColumnModel getColumn() {
		return column;
	}

	public void setColumn(ColumnModel column) {
		this.column = column;
	}

	@XmlElement
	public Operator getOperator() {
		return operator;
	}

	public void setOperator(Operator operator) {
		this.operator = operator;
	}

	@XmlElement
	public QueryValue[] getValue() {
		return value;
	}

	public void setValue(QueryValue[] value) {
		this.value = value;
	}

	@XmlElement
	public List<Condition> getConditions() {
		return conditions;
	}

	public void setConditions(List<Condition> conditions) {
		this.conditions = conditions;
	}

	public String toSQL(String column) {
		String SQL = null;
		if (this.conditions.size() > 0) {
			StringBuilder _sub = new StringBuilder();
			List<String> subQuery = new ArrayList<>();
			_sub.append("(");
			for (Condition cn : conditions) {
				String defSQL = cn.toSQL(cn.getColumn().getName());
				if (defSQL != null) {
					subQuery.add(defSQL);
				}
			}
			_sub.append(String.join(" OR ", subQuery));
			_sub.append(")");
			return _sub.toString();
		} else {
			switch (getOperator().getArgs()) {
			case 0:
				SQL = column + " " + getOperator().getOp();
				break;
			case 1:
				SQL = column + " " + String.format(getOperator().getOp(), this.value[0].getValue());
				break;
			case 2:
				if (getOperator() == Operator.WITHIN) {
					SQL = " " + String.format(getOperator().getOp(), this.value[0].getValue(), this.value[1].getValue());
				} else {
					SQL = column + " " + String.format(getOperator().getOp(), this.value[0].getValue(), this.value[1].getValue());
				}

				break;
			case 3:
				if (getOperator() == Operator.DWITHIN) {
					SQL = " " + String.format(getOperator().getOp(), this.value[0].getValue(), this.value[1].getValue(), this.value[2].getValue());
				} else {
					SQL = column + " "
							+ String.format(getOperator().getOp(), this.value[0].getValue(), this.value[1].getValue(), this.value[2].getValue());
				}
				break;
			default:
				break;
			}
			return SQL;
		}
	}

}
