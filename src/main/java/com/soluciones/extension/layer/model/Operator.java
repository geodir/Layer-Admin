package com.soluciones.extension.layer.model;

public enum Operator {
	EQUALS("EQUALS", "= %s", 1), IN("IN", "IN (%s)", 1), DISTINCT("DISTINCT", "!= %s", 1), NOT_IN("NOT_IN",
			"NOT IN (%s)", 1), CONTAINS("CONTAINS", "ILIKE '%%%s%%'", 1), STARTWITH("STARTWITH", "ILIKE '%s%%'",
					1), ENDSWITH("ENDSWITH", "ILIKE '%%%s'", 1), BETWEEN("BETWEEN", "BETWEEN %s AND %s",
							2), LESSTHAN("LESSTHAN", ">=  %s", 1), MORETHAN("MORETHAN", "<= %s", 1), ISNULL("ISNULL",
									"IS NULL", 0), ISNOTNULL("ISNOTNUL", "IS NOT NULL", 0), WITHIN("WITHIN",
											"WITHIN(%s,%s)", 2), DWITHIN("DWITHIN", "DWITHIN(%s,%s,%s,meters)", 3);

	private final String op;
	private final String name;
	private final int args;

	public static final Operator[] ALL = { EQUALS, IN, DISTINCT, NOT_IN, CONTAINS, STARTWITH, ENDSWITH };

	private Operator(final String name, final String op, final int args) {
		this.name = name;
		this.op = op;
		this.args = args;
	}

	public static Operator forName(final String name) {
		if (name == null) {
			throw new IllegalArgumentException("Name cannot be null for feature");
		}
		if (name.toUpperCase().equals("EQUALS")) {
			return EQUALS;
		} else if (name.toUpperCase().equals("IN")) {
			return IN;
		} else if (name.toUpperCase().equals("DISTINCT")) {
			return DISTINCT;
		} else if (name.toUpperCase().equals("NOT_IN")) {
			return NOT_IN;
		}
		throw new IllegalArgumentException("Name \"" + name + "\" does not correspond to any Feature");
	}

	public String getOp() {
		return op;
	}

	public int getArgs() {
		return args;
	}

	public String getName() {
		return name;
	}

	@Override
	public String toString() {
		return getName();
	}

}
