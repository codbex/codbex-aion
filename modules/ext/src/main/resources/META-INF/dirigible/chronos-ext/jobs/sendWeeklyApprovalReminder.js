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

var sql = 'SELECT DISTINCT "CHRONOS_EMPLOYEE".* FROM "CHRONOS_PROJECT", "CHRONOS_ASSIGNMENT", "CHRONOS_EMPLOYEE", "CHRONOS_TIMESHEET"'
    + ' WHERE "PROJECT_PROJECTSTATUSID" = ?'
    + ' AND "ASSIGNMENT_PROJECTID" = "PROJECT_ID"'
    + ' AND "ASSIGNMENT_APPROVER" = true'
    + ' AND "ASSIGNMENT_EMPLOYEEID" = "EMPLOYEE_ID"'
    + ' AND "TIMESHEET_PROJECTID" = "PROJECT_ID"'
    + ' AND "TIMESHEET_STATUS" in (? , ?)'

var resultset = query.execute(sql, [
    ProjectStatus.Active,
    TimesheetStatus.Opened,
    TimesheetStatus.Reopened
]);

var recipients = resultset.map(row => row.EMPLOYEE_EMAIL);

if (recipients.length > 0) {
    var from = settings.mailFrom;
    var recipients = {
        bcc: recipients
    };
    var subject = "Timesheet approval reminder";
    var content = "This is a friendly reminder that there are timesheets waiting for your approval.";
    var subType = "html";

    mail.send(from, recipients, subject, content, subType);

    console.log("Timesheets approval reminder email sent");
}