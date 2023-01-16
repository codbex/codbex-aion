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
	table: "AION_ITEM",
	properties: [
		{
			name: "Id",
			column: "ITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "TimesheetId",
			column: "ITEM_TIMESHEETID",
			type: "INTEGER",
		},
 {
			name: "TaskId",
			column: "ITEM_TASKID",
			type: "INTEGER",
			required: true
		},
 {
			name: "Description",
			column: "ITEM_DESCRIPTION",
			type: "VARCHAR",
		},
 {
			name: "Hours",
			column: "ITEM_HOURS",
			type: "INTEGER",
			required: true
		},
 {
			name: "Day",
			column: "ITEM_DAY",
			type: "DATE",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Day");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Day");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Day");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "AION_ITEM",
		key: {
			name: "Id",
			column: "ITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Day");
	dao.update(entity);
	triggerEvent("Update", {
		table: "AION_ITEM",
		key: {
			name: "Id",
			column: "ITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "AION_ITEM",
		key: {
			name: "Id",
			column: "ITEM_ID",
			value: id
		}
	});
};

exports.count = function (TimesheetId) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "AION_ITEM" WHERE "ITEM_TIMESHEETID" = ?', [TimesheetId]);
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "AION_ITEM"');
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
	producer.queue("aion-app/Timesheets/Item/" + operation).send(JSON.stringify(data));
}