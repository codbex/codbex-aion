var query = require("db/v4/query");
var producer = require("messaging/v4/producer");
var daoApi = require("db/v4/dao");

var dao = daoApi.create({
	table: "TASK",
	properties: [
		{
			name: "Id",
			column: "TASK_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		}, {
			name: "Name",
			column: "TASK_NAME",
			type: "VARCHAR",
		}, {
			name: "Link",
			column: "TASK_LINK",
			type: "VARCHAR",
		}, {
			name: "ProjectId",
			column: "TASK_PROJECTID",
			type: "INTEGER",
		}, {
			name: "TaskStatusId",
			column: "TASK_TASKSTATUSID",
			type: "INTEGER",
		}]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	var id = dao.insert(entity);
	triggerEvent("Create", {
		table: "TASK",
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
		table: "TASK",
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
		table: "TASK",
		key: {
			name: "Id",
			column: "TASK_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	var resultSet = query.execute("SELECT COUNT(*) AS COUNT FROM TASK");
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