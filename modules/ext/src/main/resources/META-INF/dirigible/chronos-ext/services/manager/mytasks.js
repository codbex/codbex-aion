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
var request = require("http/v4/request");
var response = require("http/v4/response");
var user = require("security/v4/user");

var sql = 'SELECT * FROM "CHRONOS_TASK" '
    + ' WHERE "TASK_PROJECTID" = ?';

let projectId = parseInt(request.getParameter('ProjectId'));
if (projectId) {
    var resultset = query.execute(sql, [projectId]);

    let tasks = [];
    resultset.forEach(function (row) {
        let task = {};
        task.Id = row.TASK_ID;
        task.Name = row.TASK_NAME;
        task.Link = row.TASK_LINK;
        task.Status = row.TASK_TASKSTATUSID;
        tasks.push(task);
    });

    response.setContentType("application/json");
    response.println(JSON.stringify(tasks));
} else {
    response.println("Parameter ProjectId is missing");
}

response.flush();
response.close();