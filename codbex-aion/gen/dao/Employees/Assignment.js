const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-aion/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_ASSIGNMENT",
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
		table: "CODBEX_ASSIGNMENT",
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
		table: "CODBEX_ASSIGNMENT",
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
		table: "CODBEX_ASSIGNMENT",
		key: {
			name: "Id",
			column: "ASSIGNMENT_ID",
			value: id
		}
	});
};

exports.count = function (EmployeeId) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ASSIGNMENT" WHERE "ASSIGNMENT_EMPLOYEEID" = ?', [EmployeeId]);
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ASSIGNMENT"');
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
	producer.queue("codbex-aion/Employees/Assignment/" + operation).send(JSON.stringify(data));
}