var query = require("db/v4/query");
var response = require("http/v4/response");
var user = require("security/v4/user");

var sql = "SELECT PROJECT_ID, PROJECT_NAME FROM CHRONOS_PROJECT, CHRONOS_ASSIGNMENT, CHRONOS_EMPLOYEE "
    + " WHERE EMPLOYEE_EMAIL = ? AND ASSIGNMENT_EMPLOYEEID = EMPLOYEE_ID AND ASSIGNMENT_PROJECTID = PROJECT_ID AND PROJECT_PROJECTSTATUSID=1";
var resultset = query.execute(sql, [user.getName()]);

let projects = [];
resultset.forEach(function (row) {
    let project = {};
    project.Id = row.PROJECT_ID;
    project.Name = row.PROJECT_NAME;
    projects.push(project);
});

response.println(JSON.stringify(projects));

response.flush();
response.close();