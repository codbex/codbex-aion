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
var response = require("http/response");
var user = require("security/user");
var { ProjectStatus } = require("codbex-aion-ext/services/common/utilities");

var sql = 'SELECT "PROJECT_ID", "PROJECT_NAME" FROM "AION_PROJECT", "AION_ASSIGNMENT", "AION_EMPLOYEE" '
    + ' WHERE "EMPLOYEE_EMAIL" = ?'
    + ' AND "ASSIGNMENT_EMPLOYEEID" = "EMPLOYEE_ID"'
    + ' AND "ASSIGNMENT_APPROVER" = ?'
    + ' AND "ASSIGNMENT_PROJECTID" = "PROJECT_ID"'
    + ' AND "PROJECT_PROJECTSTATUSID" = ?';

var resultset = query.execute(sql, [user.getName(), false, ProjectStatus.Active]);

let projects = [];
resultset.forEach(function (row) {
    let project = {};
    project.Id = row.PROJECT_ID;
    project.Name = row.PROJECT_NAME;
    projects.push(project);
});

response.setContentType("application/json");
response.println(JSON.stringify(projects));

response.flush();
response.close();