const rs = require("http/rs");
const dao = require("aion/gen/dao/Timesheets/Item");
const http = require("aion/gen/api/utils/http");

rs.service()
	.resource("")
		.get(function(ctx, request) {
			let queryOptions = {};
			let parameters = request.getParameterNames();
			for (let i = 0; i < parameters.length; i ++) {
				queryOptions[parameters[i]] = request.getParameter(parameters[i]);
			}
			let entities = dao.list(queryOptions);
			http.sendResponseOk(entities);
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("count/{TimesheetId}")
		.get(function(ctx, request) {
			let TimesheetId = parseInt(ctx.pathParameters.TimesheetId);
			TimesheetId = isNaN(TimesheetId) ? ctx.pathParameters.TimesheetId : TimesheetId;
			http.sendResponseOk("" + dao.count(TimesheetId));
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.get(function(ctx) {
			let id = ctx.pathParameters.id;
			let entity = dao.get(id);
			if (entity) {
			    http.sendResponseOk(entity);
			} else {
				http.sendResponseNotFound("Item not found");
			}
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("")
		.post(function(ctx, request, response) {
			let entity = request.getJSON();
			entity.Id = dao.create(entity);
			response.setHeader("Content-Location", "/services/js/aion/gen/api/Item.js/" + entity.Id);
			http.sendResponseCreated(entity);
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.put(function(ctx, request) {
			let entity = request.getJSON();
			entity.Id = ctx.pathParameters.id;
			dao.update(entity);
			http.sendResponseOk(entity);
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.delete(function(ctx) {
			let id = ctx.pathParameters.id;
			let entity = dao.get(id);
			if (entity) {
				dao.delete(id);
				http.sendResponseNoContent();
			} else {
				http.sendResponseNotFound("Item not found");
			}
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
.execute();