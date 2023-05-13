const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("aion/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_TIMESHEET",
	properties: [
		{
			name: "Id",
			column: "TIMESHEET_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "ProjectId",
			column: "TIMESHEET_PROJECTID",
			type: "INTEGER",
			required: true
		},
 {
			name: "EmployeeId",
			column: "TIMESHEET_EMPLOYEEID",
			type: "INTEGER",
			required: true
		},
 {
			name: "Start",
			column: "TIMESHEET_START",
			type: "DATE",
			required: true
		},
 {
			name: "End",
			column: "TIMESHEET_END",
			type: "DATE",
			required: true
		},
 {
			name: "Reason",
			column: "TIMESHEET_REASON",
			type: "VARCHAR",
		},
 {
			name: "Status",
			column: "TIMESHEET_STATUS",
			type: "INTEGER",
			required: true
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Start");
		EntityUtils.setDate(e, "End");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Start");
	EntityUtils.setDate(entity, "End");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Start");
	EntityUtils.setLocalDate(entity, "End");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_TIMESHEET",
		key: {
			name: "Id",
			column: "TIMESHEET_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Start");
	// EntityUtils.setLocalDate(entity, "End");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_TIMESHEET",
		key: {
			name: "Id",
			column: "TIMESHEET_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_TIMESHEET",
		key: {
			name: "Id",
			column: "TIMESHEET_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_TIMESHEET"');
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
	producer.queue("aion/Timesheets/Timesheet/" + operation).send(JSON.stringify(data));
}