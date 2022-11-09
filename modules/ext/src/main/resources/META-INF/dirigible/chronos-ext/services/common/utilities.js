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

    getFirstDayOfMonth(d) {
        let date = new Date(d);
        date.setDate(1);
        return date;
    },

    getLastDayOfMonth(d) {
        let date = new Date(d);
        date.setMonth(d.getMonth() + 1, 0);
        return date;
    },

    addDays: function (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },

    toDate: function (time) {
        let date = new Date();
        date.setTime(time);
        return date;
    },

    dateToString: (date) => date ? date.toLocaleDateString(utilities.locale, utilities.options) : '-',

    groupTimesheetItemsByDate: function (timesheets) {
        return timesheets.map(timesheet => {
            if (timesheet.items) {
                timesheet.groupedItems = timesheet.items.reduce((itemsByDate, item) => {
                    const val = Date.parse(item.Day);
                    itemsByDate[val] = itemsByDate[val] || []
                    itemsByDate[val].push(item);
                    return itemsByDate;
                }, {});
                timesheet.groupedItems = Object.entries(timesheet.groupedItems).map(([day, items]) => ({ day: utilities.toDate(day), items }));
            }
            return timesheet;
        });
    },

    locale: 'en-US',

    options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },

    TimesheetStatus: { Opened: 1, Reopened: 2, Approved: 3, Rejected: 4 },
    ProjectStatus: { Active: 1, Finished: 2, Cancelled: 3 },

    settings: {
        maxHoursPerWeek: 40,
        mailFrom: 'service@codbex.com'
    }
};

if (typeof exports !== 'undefined') {
    exports.getMonday = utilities.getMonday;
    exports.getFriday = utilities.getFriday;
    exports.getFirstDayOfMonth = utilities.getFirstDayOfMonth;
    exports.getLastDayOfMonth = utilities.getLastDayOfMonth;
    exports.addDays = utilities.addDays;
    exports.toDate = utilities.toDate;
    exports.dateToString = utilities.dateToString;
    exports.groupTimesheetItemsByDate = utilities.groupTimesheetItemsByDate;
    exports.locale = utilities.locale;
    exports.options = utilities.options;
    exports.TimesheetStatus = utilities.TimesheetStatus;
    exports.ProjectStatus = utilities.ProjectStatus;
    exports.settings = utilities.settings
}

if (typeof angular !== 'undefined') {
    angular.module('app').constant('utilities', utilities);
}