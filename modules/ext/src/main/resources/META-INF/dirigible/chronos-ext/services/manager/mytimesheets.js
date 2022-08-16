var query = require("db/v4/query");
var request = require("http/v4/request");
var response = require("http/v4/response");
var user = require("security/v4/user");
var { options } = require("chronos-ext/services/common/utilities");

let statusFilter = "";
let statusIds = request.getParameterValues('StatusId');
if (statusIds && statusIds.length) {
    statusFilter = ` AND TIMESHEET_STATUS IN ( ${statusIds.map(() => '?').join(',')} )`;
}

var sql = "SELECT * FROM CHRONOS_TIMESHEET, CHRONOS_ITEM, CHRONOS_TASK, CHRONOS_EMPLOYEE "
    + " WHERE TIMESHEET_PROJECTID = ? "
    + " AND TIMESHEET_ID = ITEM_TIMESHEETID "
    + " AND TASK_ID=ITEM_TASKID "
    + " AND EMPLOYEE_ID=TIMESHEET_EMPLOYEEID"
    + statusFilter
    + " ORDER BY TIMESHEET_ID";

let projectId = request.getParameter('ProjectId');

if (projectId) {
    let d = new Date();
    var resultset = query.execute(sql, [
        projectId,
        ...(statusIds || [])
    ]);

    let timesheets = [];
    let timesheet = {};
    timesheet.Id = -1;
    resultset.forEach(function (row) {
        if (timesheet.Id != row.TIMESHEET_ID) {
            timesheet = {};
            timesheet.Id = row.TIMESHEET_ID;
            timesheet.Start = new Date(row.TIMESHEET_START).toLocaleDateString("en-US", options);
            timesheet.End = new Date(row.TIMESHEET_END).toLocaleDateString("en-US", options);
            timesheet.EmployeeName = row.EMPLOYEE_NAME;
            timesheet.StatusId = row.TIMESHEET_STATUS;
            timesheet.Hours = 0;
            timesheet.items = [];
            timesheets.push(timesheet);
        }
        let item = {};
        item.Id = row.ITEM_ID;
        item.Name = row.TASK_NAME;
        item.Hours = row.ITEM_HOURS;
        item.TaskStatus = row.TASK_TASKSTATUSID;

        timesheet.items.push(item);
        timesheet.Hours += item.Hours;
    });

    response.println(JSON.stringify(timesheets));
} else {
    response.println("Parameter ProjectId is missing");
}

response.flush();
response.close();
