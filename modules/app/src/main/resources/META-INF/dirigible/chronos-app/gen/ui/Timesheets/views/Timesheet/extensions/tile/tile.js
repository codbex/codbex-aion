/*
 * Copyright (c) 2010-2021 SAP and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 * Contributors:
 * SAP - initial API and implementation
 */

var dao = require("chronos-app/gen/dao/Timesheets/Timesheet.js")

exports.getTile = function(relativePath) {
	let count = "n/a";
	try {
		count = dao.customDataCount();	
	} catch (e) {
		console.error("Error occured while involking 'chronos-app/gen/dao/Timesheets/Timesheet.customDataCount()': " + e);
	}
	return {
		name: "Timesheet",
		group: "Timesheets",
		icon: "calendar",
		location: relativePath + "services/v4/web/chronos-app/gen/ui/Timesheets/index.html",
		count: count,
		order: "100"
	};
};
