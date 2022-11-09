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
let app = angular.module("app", ['ideUI', 'ideView']);

app.controller('controller', ['$scope', 'api', 'utilities', function ($scope, api, utilities) {

    const { TimesheetStatus, dateToString, groupTimesheetItemsByDate } = utilities;

    $scope.projects = [];
    $scope.timesheets = [];
    $scope.manage = {};
    $scope.reject = {
        showDialog: false,
        timesheet: {},
        reason: ''
    };
    $scope.dateToString = dateToString;

    const removeTimesheet = function (timesheet) {
        const index = $scope.timesheets.findIndex(x => x.Id === timesheet.Id);
        if (index >= 0) $scope.timesheets.splice(index, 1);
    };

    $scope.hasSelectedProject = function () {
        return !!$scope.manage.projectId;
    }

    $scope.getProjectName = function (id) {
        let project = $scope.projects.find(x => x.Id === id);
        return project && project.Name;
    }

    api.getManagerProjects()
        .then(function (projects) {
            $scope.projects = projects;
        });

    $scope.loadTimesheets = function () {
        const { projectId } = $scope.manage;
        if (projectId) {
            api.getManagerTimesheets(projectId, [TimesheetStatus.Opened, TimesheetStatus.Reopened])
                .then(function (timesheets) {
                    $scope.timesheets = groupTimesheetItemsByDate(timesheets);
                });
        }
    };

    api.getUser()
        .then(function (userId) {
            $scope.userid = userId;
        });

    $scope.approveTimesheet = function (timesheet, e) {
        e.stopPropagation();

        api.approveTimesheet(timesheet.Id)
            .then(function () {
                removeTimesheet(timesheet);
            }, function (error) {
                alert('Error: ' + JSON.stringify(error));
            });
    }

    $scope.rejectTimesheet = function () {
        const { timesheet, reason } = $scope.reject;
        if (!timesheet.Id)
            return;

        $scope.reject.inProgress = true;

        api.rejectTimesheet(timesheet.Id, reason)
            .then(function () {
                removeTimesheet(timesheet);
                $scope.hideRejectDialog();
            }, function (error) {
                $scope.reject.inProgress = false;
                alert('Error: ' + JSON.stringify(error));
            });
    }

    $scope.showRejectDialog = function (timesheet, e) {
        e.stopPropagation();
        $scope.reject.timesheet = timesheet;
        $scope.reject.showDialog = true;
    }

    $scope.hideRejectDialog = function () {
        $scope.reject.reason = '';
        $scope.reject.timesheet = {};
        $scope.reject.showDialog = false;
        $scope.reject.inProgress = false;
    }

}]);

