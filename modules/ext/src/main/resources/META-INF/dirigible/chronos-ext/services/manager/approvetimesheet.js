let rs = require("http/v4/rs");
let dao = require("chronos-app/gen/dao/Timesheets/Timesheet");
let http = require("chronos-app/gen/api/utils/http");
let { TimesheetStatus } = require("chronos-ext/services/common/utilities");

rs.service()
    .resource("")
    .get(function (ctx, request) {
        http.sendResponseOk("Use POST request by id to approve the timesheet");
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
        let id = ctx.pathParameters.id;
        let entity = dao.get(id);
        if (entity) {
            if (entity.Status !== TimesheetStatus.Opened && entity.Status !== TimesheetStatus.Reopened) {
                http.sendResponseBadRequest('Invalid timesheet status');
                return;
            }

            entity.Id = ctx.pathParameters.id;
            entity.Status = TimesheetStatus.Approved;
            dao.update(entity);
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
