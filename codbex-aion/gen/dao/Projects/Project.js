const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-aion/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_PROJECT",
	properties: [
		{
			name: "Id",
			column: "PROJECT_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "PROJECT_NAME",
			type: "VARCHAR",
			required: true
		},
 {
			name: "EmployeeId",
			column: "PROJECT_EMPLOYEEID",
			type: "INTEGER",
			required: true
		},
 {
			name: "Start",
			column: "PROJECT_START",
			type: "DATE",
			required: true
		},
 {
			name: "End",
			column: "PROJECT_END",
			type: "DATE",
			required: true
		},
 {
			name: "ProjectStatusId",
			column: "PROJECT_PROJECTSTATUSID",
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
		table: "CODBEX_PROJECT",
		key: {
			name: "Id",
			column: "PROJECT_ID",
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
		table: "CODBEX_PROJECT",
		key: {
			name: "Id",
			column: "PROJECT_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PROJECT",
		key: {
			name: "Id",
			column: "PROJECT_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PROJECT"');
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
	producer.queue("codbex-aion/Projects/Project/" + operation).send(JSON.stringify(data));
}