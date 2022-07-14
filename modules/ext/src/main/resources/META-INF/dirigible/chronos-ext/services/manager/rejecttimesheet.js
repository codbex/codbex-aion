var rs = require("http/v4/rs");
var dao = require("chronos-app/gen/dao/Timesheets/Timesheet");
var http = require("chronos-app/gen/api/utils/http");

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
        var entity = dao.get(id);
        if (entity) {
            entity.Id = ctx.pathParameters.id;
            entity.Approved = 0;
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
