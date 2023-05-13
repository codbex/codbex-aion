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

var sql = 'SELECT * FROM "AION_TASK" '
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