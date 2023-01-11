/*
 * Copyright (c) 2022 codbex or an codbex affiliate company and contributors
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-FileCopyrightText: 2022 codbex or an codbex affiliate company and contributors
 * SPDX-License-Identifier: EPL-2.0
 */
const query = require("db/v4/query");
const producer = require("messaging/v4/producer");
const daoApi = require("db/v4/dao");
const EntityUtils = require("aion-app/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "AION_ASSIGNMENT",
	properties: [
		{
			name: "Id",
			column: "ASSIGNMENT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "EmployeeId",
			column: "ASSIGNMENT_EMPLOYEEID",
			type: "INTEGER",
			required: true
		},
 {
			name: "ProjectId",
			column: "ASSIGNMENT_PROJECTID",
			type: "INTEGER",
			required: true
		},
 {
			name: "Role",
			column: "ASSIGNMENT_ROLE",
			type: "INTEGER",
			required: true
		},
 {
			name: "Start",
			column: "ASSIGNMENT_START",
			type: "DATE",
			required: true
		},
 {
			name: "End",
			column: "ASSIGNMENT_END",
			type: "DATE",
			required: true
		},
 {
			name: "Rate",
			column: "ASSIGNMENT_RATE",
			type: "DOUBLE",
		},
 {
			name: "Approver",
			column: "ASSIGNMENT_APPROVER",
			type: "BOOLEAN",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Start");
		EntityUtils.setDate(e, "End");
		EntityUtils.setBoolean(e, "Approver");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Start");
	EntityUtils.setDate(entity, "End");
	EntityUtils.setBoolean(entity, "Approver");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Start");
	EntityUtils.setLocalDate(entity, "End");
	EntityUtils.setBoolean(entity, "Approver");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "AION_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Start");
	// EntityUtils.setLocalDate(entity, "End");
	EntityUtils.setBoolean(entity, "Approver");
	dao.update(entity);
	triggerEvent("Update", {
		table: "AION_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "AION_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: id
		}
	});
};

exports.count = function (EmployeeId) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "AION_ASSIGNMENT" WHERE "ASSIGNMENT_EMPLOYEEID" = ?', [EmployeeId]);
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "AION_ASSIGNMENT"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("aion-app/Employees/Assignment/" + operation).send(JSON.stringify(data));
}