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
var query = require("db/query");
var request = require("http/request");
var response = require("http/response");
var user = require("security/user");
var { options } = require("codbex-aion-ext/services/common/utilities");

let statusFilter = "";
let statusIds = request.getParameterValues('StatusId');

if (statusIds && statusIds.length) {
    statusIds = statusIds.map(id => parseInt(id));
    statusFilter = ` AND "TIMESHEET_STATUS" IN ( ${statusIds.map(() => '?').join(',')} )`;
}

var sql = 'SELECT * FROM "AION_TIMESHEET", "AION_ITEM", "AION_TASK", "AION_EMPLOYEE", "AION_TIMESHEETSTATUS" '
    + ' WHERE "TIMESHEET_PROJECTID" = ? '
    + ' AND "TIMESHEET_ID" = "ITEM_TIMESHEETID" '
    + ' AND "TASK_ID"="ITEM_TASKID" '
    + ' AND "EMPLOYEE_ID"="TIMESHEET_EMPLOYEEID" '
    + ' AND "TIMESHEET_STATUS"="TIMESHEETSTATUS_ID" '
    + statusFilter
    + ' ORDER BY "TIMESHEET_ID"';

let projectId = parseInt(request.getParameter('ProjectId'));

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
            timesheet.StatusName = row.TIMESHEETSTATUS_NAME;
            timesheet.Hours = 0;
            timesheet.Reason = row.TIMESHEET_REASON;
            timesheet.items = [];
            timesheets.push(timesheet);
        }
        let item = {};
        item.Id = row.ITEM_ID;
        item.Name = row.TASK_NAME;
        item.Description = row.ITEM_DESCRIPTION;
        item.Day = row.ITEM_DAY;
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
