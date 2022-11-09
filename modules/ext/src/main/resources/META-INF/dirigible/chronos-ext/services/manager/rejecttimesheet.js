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
var rs = require("http/v4/rs");
var dao = require("chronos-app/gen/dao/Timesheets/Timesheet");
var http = require("chronos-app/gen/api/utils/http");
var query = require("db/v4/query");
var mail = require("mail/v4/client");
const { settings, dateToString, TimesheetStatus } = require("chronos-ext/services/common/utilities");

rs.service()
    .resource("")
    .get(function (ctx, request) {
        http.sendResponseOk("Use POST request by id to reject the timesheet");
    })
    .produces(["application/json"])
    .catch(function (ctx, error) {
        if (error.name === "ForbiddenError") {
            http.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            http.sendResponseBadRequest(error.message);
        } else {
            http.sendInternalServerError(error.message);
        }
    })
    .resource("{id}")
    .post(function (ctx, request, response) {
        var id = ctx.pathParameters.id;
        var data = request.getJSON();
        var entity = dao.get(id);
        if (entity) {
            if (entity.Status !== TimesheetStatus.Opened && entity.Status !== TimesheetStatus.Reopened) {
                http.sendResponseBadRequest('Invalid timesheet status');
                return;
            }

            entity.Id = ctx.pathParameters.id;
            entity.Reason = data.reason;
            entity.Status = TimesheetStatus.Rejected;
            dao.update(entity);

            notifyEmployee(entity.EmployeeId, entity.Start, entity.End, entity.Reason);

            http.sendResponseOk(entity);
        } else {
            http.sendResponseNotFound("Timesheet not found");
        }
    })
    .produces(["application/json"])
    .catch(function (ctx, error) {
        if (error.name === "ForbiddenError") {
            http.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            http.sendResponseBadRequest(error.message);
        } else {
            http.sendInternalServerError(error.message);
        }
    })
    .execute();

function notifyEmployee(employeeId, dateFrom, dateTo, reason) {
    try {
        var sql = 'SELECT "CHRONOS_EMPLOYEE".* FROM "CHRONOS_EMPLOYEE" WHERE "EMPLOYEE_ID" = ?';
        var resultset = query.execute(sql, [employeeId]);

        var recipients = resultset.map(row => row.EMPLOYEE_EMAIL);

        if (recipients.length > 0) {
            var from = settings.mailFrom;
            var subject = "Timesheet rejected :(";
            var content = "Your timesheet for the period: " + dateToString(new Date(dateFrom)) + " - " + dateToString(new Date(dateTo)) + " has been rejected.";
            if (reason) {
                content += '<br/>Reason: ' + reason;
            }

            var subType = "html";

            mail.send(from, recipients[0], subject, content, subType);

            console.log("Timesheets reminder email sent");
        }
    } catch (ex) {
        console.error('Sending timesheet rejected notification failed. Reason: ' + ex.message);
    }
}