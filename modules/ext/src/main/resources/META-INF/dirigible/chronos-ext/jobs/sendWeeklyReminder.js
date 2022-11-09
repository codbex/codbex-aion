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
var query = require("db/v4/query");
var mail = require("mail/v4/client");

var { ProjectStatus, TimesheetStatus, getMonday, getFriday, dateToString, settings } = require("chronos-ext/services/common/utilities");

var sql = 'SELECT DISTINCT "CHRONOS_EMPLOYEE".* FROM "CHRONOS_PROJECT", "CHRONOS_ASSIGNMENT", "CHRONOS_EMPLOYEE"'
    + ' WHERE "PROJECT_PROJECTSTATUSID" = ?'
    + ' AND "ASSIGNMENT_PROJECTID" = "PROJECT_ID"'
    + ' AND "EMPLOYEE_ID" = "ASSIGNMENT_EMPLOYEEID"'
    + ' AND "EMPLOYEE_ID" NOT IN ('
    + '   SELECT "TIMESHEET_EMPLOYEEID" FROM "CHRONOS_TIMESHEET"'
    + '   WHERE CURRENT_TIMESTAMP() BETWEEN "TIMESHEET_START"  AND "TIMESHEET_END"'
    + '   AND "TIMESHEET_STATUS" IN (?, ?)'
    + ' )';

var resultset = query.execute(sql, [
    ProjectStatus.Active,
    TimesheetStatus.Opened,
    TimesheetStatus.Reopened
]);

var recipients = resultset.map(row => row.EMPLOYEE_EMAIL);

if (recipients.length > 0) {
    var monday = dateToString(getMonday(new Date()));
    var friday = dateToString(getFriday(new Date()));

    var from = settings.mailFrom;
    var recipients = {
        bcc: recipients
    };
    var subject = "Timesheet reminder";
    var content = "This is a friendly reminder to log your hours for the period:<br/>" + monday + " - " + friday;
    var subType = "html";

    mail.send(from, recipients, subject, content, subType);

    console.log("Timesheets reminder email sent");
}