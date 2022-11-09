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

app.controller('controller', ['$scope', '$q', 'utilities', 'classNames', 'api', function ($scope, $q, utilities, classNames, api) {

    const { TimesheetStatus, groupTimesheetItemsByDate, dateToString } = utilities;

    $scope.projects = [];
    $scope.timesheets = [];
    $scope.manage = {
        timesheetItem: {},
        showDialog: false
    };
    $scope.projectTasks = {};
    $scope.dateToString = dateToString;

    const loadTasks = function (projectId) {
        return new $q((resolve, reject) => {
            let tasks = $scope.projectTasks[projectId];
            if (tasks) {
                resolve(tasks);
            } else {
                api.getDeveloperProjectTasks(projectId)
                    .then(projectTasks => {
                        $scope.projectTasks[projectId] = tasks = projectTasks;
                        resolve(tasks);
                    }).catch(ex => reject(ex));
            }
        });
    }

    $scope.isTimesheetRejected = function (timesheet) {
        return timesheet.StatusId === TimesheetStatus.Rejected;
    }

    $scope.hasSelectedProject = function () {
        return !!$scope.manage.projectId;
    }

    $scope.getProjectName = function (id) {
        let project = $scope.projects.find(x => x.Id === id);
        return project && project.Name;
    }

    $scope.loadTimesheets = function () {
        const { projectId } = $scope.manage;
        if (projectId) {
            api.getDeveloperTimesheets(projectId, [TimesheetStatus.Opened, TimesheetStatus.Reopened, TimesheetStatus.Rejected])
                .then(function (timesheets) {
                    $scope.timesheets = groupTimesheetItemsByDate(timesheets);
                });
        }
    };

    $scope.addTimesheetItem = function () {
        const { timesheetItem } = $scope.manage;
        if (!timesheetItem.TimesheetId)
            return;

        const item = {
            TimesheetId: timesheetItem.TimesheetId,
            TaskId: timesheetItem.TaskId,
            Day: timesheetItem.Day,
            Hours: timesheetItem.Hours,
            Description: timesheetItem.Description
        };

        api.createTimesheetItem(item)
            .then(function () {
                $scope.loadTimesheets();
                $scope.hideItemDialog();
            }, function (error) {
                alert('Error: ' + JSON.stringify(error));
            });
    }

    $scope.saveTimesheetItem = function () {
        const { timesheetItem } = $scope.manage;
        if (!timesheetItem.Id)
            return;

        const item = {
            TimesheetId: timesheetItem.TimesheetId,
            TaskId: timesheetItem.TaskId,
            Day: timesheetItem.Day,
            Hours: timesheetItem.Hours,
            Description: timesheetItem.Description
        };

        api.updateTimesheetItem(timesheetItem.Id, item)
            .then(function () {
                $scope.loadTimesheets();
                $scope.hideItemDialog();
            }, function (error) {
                alert('Error: ' + JSON.stringify(error));
            });
    }

    $scope.deleteTimesheetItem = function (id) {
        if (confirm("Are you sure you want to delete this task")) {
            api.deleteTimesheetItem(id)
                .then(function () {
                    $scope.loadTimesheets();
                }, function (error) {
                    alert('Error: ' + JSON.stringify(error));
                });
        }
    }

    $scope.deleteTimesheet = function (timesheet, e) {
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this timesheet")) {
            api.deleteTimesheet(timesheet.Id)
                .then(function () {
                    $scope.loadTimesheets();
                }, function (error) {
                    alert('Error: ' + JSON.stringify(error));
                });
        }
    }

    $scope.reopenTimesheet = function (timesheet, e) {
        const item = {
            EmployeeId: timesheet.EmployeeId,
            Start: timesheet.Start,
            End: timesheet.End,
            ProjectId: timesheet.ProjectId,
            Status: TimesheetStatus.Reopened
        };

        api.updateTimesheet(timesheet.Id, item)
            .then(function () {
                $scope.loadTimesheets();
            }, function (error) {
                alert('Error: ' + JSON.stringify(error));
            });

        e.stopPropagation();
    }

    $scope.getStatusClassNames = function (id) {
        return classNames('sap-icon', {
            'sap-icon--pending sap-icon--color-information': id === TimesheetStatus.Opened || id === TimesheetStatus.Reopened,
            'sap-icon--sys-cancel sap-icon--color-negative': id === TimesheetStatus.Rejected
        })
    }

    $scope.getAddTaskButtonState = function () {
        const { timesheetItem } = $scope.manage;
        return !timesheetItem.Hours || !timesheetItem.TaskId || !timesheetItem.Day ? 'disabled' : undefined;
    }

    $scope.showItemDialog = function (e, timesheetId, item) {
        loadTasks($scope.manage.projectId).then(tasks => {
            $scope.manage.tasks = tasks;
            $scope.manage.timesheetItem = {
                ...(item || {}),
                TimesheetId: timesheetId,
                Day: item ? new Date(item.Day) : null
            };

            $scope.manage.showDialog = true;
        }).catch(ex => console.log(`Failed to get tasks for project ID ${projectId}. ${ex.message}`));

        e.stopPropagation();
    }

    $scope.hideItemDialog = function () {
        $scope.manage.showDialog = false;
        $scope.manage.timesheetItem = {}
    }

    api.getDeveloperProjects()
        .then(function (projects) {
            $scope.projects = projects;

            if ($scope.projects.length > 0) {
                $scope.manage.projectId = $scope.projects[0].Id;
                $scope.loadTimesheets();
            }
        });

    api.getUser()
        .then(function (userId) {
            $scope.userid = userId;
        });
}]);

