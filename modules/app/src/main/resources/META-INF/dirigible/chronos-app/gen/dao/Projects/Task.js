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

let dao = daoApi.create({
	table: "CHRONOS_TASK",
	properties: [
		{
			name: "Id",
			column: "TASK_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "TASK_NAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "Link",
			column: "TASK_LINK",
			type: "VARCHAR",
		},
 {
			name: "ProjectId",
			column: "TASK_PROJECTID",
			type: "INTEGER",
		},
 {
			name: "TaskStatusId",
			column: "TASK_TASKSTATUSID",
			type: "INTEGER",
			required: true
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CHRONOS_TASK",
		key: {
			name: "Id",
			column: "TASK_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CHRONOS_TASK",
		key: {
			name: "Id",
			column: "TASK_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CHRONOS_TASK",
		key: {
			name: "Id",
			column: "TASK_ID",
			value: id
		}
	});
};

exports.count = function (ProjectId) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CHRONOS_TASK" WHERE "TASK_PROJECTID" = ?', [ProjectId]);
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CHRONOS_TASK"');
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
	producer.queue("chronos-app/Projects/Task/" + operation).send(JSON.stringify(data));
}