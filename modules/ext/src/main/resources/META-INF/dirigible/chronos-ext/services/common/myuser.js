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
var response = require("http/v4/response");
var user = require("security/v4/user");

var sql = 'SELECT "EMPLOYEE_ID", "EMPLOYEE_NAME", "EMPLOYEE_EMAIL" FROM "CHRONOS_EMPLOYEE" WHERE "EMPLOYEE_EMAIL" = ?';
var resultset = query.execute(sql, [user.getName()]);

response.setContentType("application/json");
response.println(resultset[0].EMPLOYEE_ID);

response.flush();
response.close();