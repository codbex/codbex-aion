var response = require("http/v4/response");
var request = require("http/v4/request");
var query = require("db/v4/query");
var pdfDocuments = require("documents/v4/pdf");
var { options, getFirstDayOfMonth, getLastDayOfMonth, toDate } = require("chronos-ext/services/common/utilities");

let projectId = parseInt(request.getParameter('ProjectId'));
let start = request.getParameter('Start');
let end = request.getParameter('End');

if (projectId) {

    var projectName = '';
    var result = query.execute('SELECT PROJECT_NAME FROM CHRONOS_PROJECT WHERE PROJECT_ID = ?', [projectId]);
    if (result.length > 0)
        projectName = result[0].PROJECT_NAME;

    if (!start)
        start = getFirstDayOfMonth(new Date());
    else
        start = toDate(Date.parse(start));

    if (!end)
        end = getLastDayOfMonth(new Date());
    else
        end = toDate(Date.parse(end));

    var sql = 'SELECT * FROM "CHRONOS_TIMESHEET", "CHRONOS_ITEM", "CHRONOS_TASK", "CHRONOS_EMPLOYEE", "CHRONOS_TIMESHEETSTATUS" '
        + ' WHERE "TIMESHEET_PROJECTID" = ? '
        + ' AND "TIMESHEET_ID" = "ITEM_TIMESHEETID" '
        + ' AND "TASK_ID"="ITEM_TASKID" '
        + ' AND "EMPLOYEE_ID"="TIMESHEET_EMPLOYEEID" '
        + ' AND "TIMESHEET_STATUS"="TIMESHEETSTATUS_ID" '
        + ' AND "TIMESHEETSTATUS_NAME" = ? '
        + ' AND "ITEM_DAY" BETWEEN ? AND ? '
        + ' ORDER BY "TIMESHEET_ID", "ITEM_DAY"';

    var resultset = query.execute(sql, [
        projectId,
        "Approved",
        { type: 'DATE', value: start },
        { type: 'DATE', value: end }
    ]);

    let rows = [];
    let timesheetId = -1;
    let timesheetDate = null;
    resultset.forEach(function (row) {
        let employeeName = '';
        let date = '';
        if (timesheetId != row.TIMESHEET_ID) {
            employeeName = row.EMPLOYEE_NAME;
        }

        if (timesheetDate != row.ITEM_DAY) {
            date = new Date(row.ITEM_DAY).toLocaleDateString("en-US", options);
        }

        rows.push({
            employee: employeeName,
            date,
            task: row.TASK_NAME,
            description: row.ITEM_DESCRIPTION,
            hours: row.ITEM_HOURS
        });

        timesheetId = row.TIMESHEET_ID;
        timesheetDate = row.ITEM_DAY;
    });

    var data = {
        title: projectName,
        description: `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`,
        columns: [{
            name: "Employee",
            key: "employee"
        }, {
            name: "Date",
            key: "date",
        }, {
            name: "Task",
            key: "task"
        }, {
            name: "Description",
            key: "description"
        }, {
            name: "Hours",
            key: "hours"
        }],
        rows
    };

    var pdf = pdfDocuments.generateTable(data);

    response.setContentType("application/octet-stream");
    response.setHeader('Content-Disposition', 'attachment; filename="report.pdf');
    response.write(pdf);
} else {
    response.println("Parameter ProjectId is missing");
}

response.flush();
response.close();