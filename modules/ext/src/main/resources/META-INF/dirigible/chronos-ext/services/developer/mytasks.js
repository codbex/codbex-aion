var query = require("db/v4/query");
var request = require("http/v4/request");
var response = require("http/v4/response");
var user = require("security/v4/user");

var sql = "SELECT TASK_ID, TASK_NAME FROM CHRONOS_TASK "
    + " WHERE TASK_PROJECTID = ? AND TASK_TASKSTATUSID=1";

let projectId = request.getParameter('ProjectId');
if (projectId) {
    var resultset = query.execute(sql, [projectId]);

    let tasks = [];
    resultset.forEach(function (row) {
        let task = {};
        task.Id = row.TASK_ID;
        task.Name = row.TASK_NAME;
        tasks.push(task);
    });

    response.println(JSON.stringify(tasks));
} else {
    response.println("Parameter ProjectId is missing");
}

response.flush();
response.close();