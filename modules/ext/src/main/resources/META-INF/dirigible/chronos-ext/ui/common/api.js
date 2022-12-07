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
angular.module('app')
    .provider('api', function Api() {
        const asUTC = d => {
            let utcDate = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
            return new Date(utcDate).toISOString();
        };

        const stringifyReplacer = (key, value) => {
            if (key === '') {
                for (const [propName, propValue] of Object.entries(value)) {
                    if (propValue instanceof Date) {
                        value[propName] = asUTC(propValue);
                    }
                }
            }
            return value;
        }
        this.$get = ['$q', '$http', function ($q, $http) {

            const httpGet = uri => {
                return $q((resolve, reject) => {
                    return $http.get(uri)
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            };

            const httpPost = (uri, data = {}) => {
                return $q((resolve, reject) => {
                    return $http.post(uri, data ? JSON.stringify(data, stringifyReplacer) : "{}")
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            }

            const httpPut = (uri, data) => {
                return $q((resolve, reject) => {
                    return $http.put(uri, JSON.stringify(data, stringifyReplacer))
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            }

            const httpDelete = (uri) => {
                return $q((resolve, reject) => {
                    return $http.delete(uri)
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            }

            return {
                getUser: function () {
                    return httpGet('/services/v4/js/chronos-ext/services/common/myuser.js');
                },
                getDeveloperProjects: function () {
                    return httpGet('/services/v4/js/chronos-ext/services/developer/myprojects.js');
                },
                getDeveloperProjectTasks: function (projectId) {
                    return httpGet(`/services/v4/js/chronos-ext/services/developer/mytasks.js?ProjectId=${projectId}`);
                },
                getDeveloperTimesheets: function (projectId, statusIds = []) {
                    const statusParams = statusIds.map(x => `&StatusId=${x}`).join('');
                    return httpGet(`/services/v4/js/chronos-ext/services/developer/mytimesheets.js?ProjectId=${projectId}${statusParams}`);
                },
                getManagerProjects: function () {
                    return httpGet('/services/v4/js/chronos-ext/services/manager/myprojects.js');
                },
                getManagerProjectTasks: function (projectId) {
                    return httpGet(`/services/v4/js/chronos-ext/services/manager/mytasks.js?ProjectId=${projectId}`);
                },
                createProjectTask: function (task) {
                    return httpPost('/services/v4/js/chronos-app/gen/api/Projects/Task.js', task);
                },
                updateProjectTask: function (id, task) {
                    return httpPut(`/services/v4/js/chronos-app/gen/api/Projects/Task.js/${id}`, task);
                },
                deleteProjectTask: function (id) {
                    return httpDelete(`/services/v4/js/chronos-app/gen/api/Projects/Task.js/${id}`);
                },
                getManagerTimesheets: function (projectId, statusIds = []) {
                    const statusParams = statusIds.map(x => `&StatusId=${x}`).join('');
                    return httpGet(`/services/v4/js/chronos-ext/services/manager/mytimesheets.js?ProjectId=${projectId}${statusParams}`);
                },
                createTimesheet: function (timesheet) {
                    return httpPost('/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js', timesheet);
                },
                updateTimesheet: function (id, timesheet) {
                    return httpPut(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${id}`, timesheet);
                },
                deleteTimesheet: function (id) {
                    return httpDelete(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${id}`);
                },
                createTimesheetItem: function (timesheetItem) {
                    return httpPost('/services/v4/js/chronos-app/gen/api/Timesheets/Item.js', timesheetItem);
                },
                updateTimesheetItem: function (id, timesheetItem) {
                    return httpPut(`/services/v4/js/chronos-app/gen/api/Timesheets/Item.js/${id}`, timesheetItem);
                },
                deleteTimesheetItem: function (id) {
                    return httpDelete(`/services/v4/js/chronos-app/gen/api/Timesheets/Item.js/${id}`);
                },
                approveTimesheet: function (id) {
                    return httpPost(`/services/v4/js/chronos-ext/services/manager/approvetimesheet.js/${id}`);
                },
                rejectTimesheet: function (id, reason) {
                    return httpPost(`/services/v4/js/chronos-ext/services/manager/rejecttimesheet.js/${id}`, { reason });
                },
                getTaskStatuses: function () {
                    return httpGet('/services/v4/js/chronos-app/gen/api/Configurations/TaskStatus.js');
                }
            }
        }]
    });