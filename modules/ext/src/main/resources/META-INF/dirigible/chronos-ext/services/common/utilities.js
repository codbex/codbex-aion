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
const utilities = {
    getMonday: function (d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    },

    getFriday: function (d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff + 4));
    },

    addDays: function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },

    TimesheetStatus: { Opened: 1, Reopened: 2, Approved: 3, Rejected: 4 },

    settings: {
        maxHoursPerWeek: 40
    }
};

if (typeof exports !== 'undefined') {
    exports.getMonday = utilities.getMonday;
    exports.getFriday = utilities.getFriday;
    exports.addDays = utilities.addDays;
    exports.options = utilities.options;
    exports.TimesheetStatus = utilities.TimesheetStatus;
}

if (typeof angular !== 'undefined') {
    angular.module('app').constant('utilities', utilities);
}