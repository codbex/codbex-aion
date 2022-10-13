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

app.controller('controller', ['$scope', '$http', '$q', 'utilities', 'classNames', function ($scope, $http, $q, utilities, classNames) {

    const { TimesheetStatus } = utilities;

    $scope.projects = [];
    $scope.timesheets = [];
    $scope.manage = {
        timesheetItem: {},
        showDialog: false
    };
    $scope.projectTasks = {};

    const loadTasks = function (projectId) {
        return new $q((resolve, reject) => {
            let tasks = $scope.projectTasks[projectId];
            if (tasks) {
                resolve(tasks);
            } else {
                $http.get(`/services/v4/js/chronos-ext/services/manager/mytasks.js?ProjectId=${projectId}`)
                    .then(response => {
                        $scope.projectTasks[projectId] = tasks = response.data;
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
            $http.get(`/services/v4/js/chronos-ext/services/developer/mytimesheets.js?ProjectId=${projectId}&StatusId=${TimesheetStatus.Opened}&StatusId=${TimesheetStatus.Reopened}&StatusId=${TimesheetStatus.Rejected}`)
                .then(function (response) {
                    $scope.timesheets = response.data;
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
            Hours: timesheetItem.Hours,
            Description: timesheetItem.Description
        };

        $http.post('/services/v4/js/chronos-app/gen/api/Timesheets/Item.js', JSON.stringify(item))
            .then(function (response) {
                console.log("Item has been stored: " + JSON.stringify(response.data));

                $scope.loadTimesheets();
                $scope.hideItemDialog();
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
            });
    }

    $scope.saveTimesheetItem = function () {
        const { timesheetItem } = $scope.manage;
        if (!timesheetItem.Id)
            return;

        const item = {
            TimesheetId: timesheetItem.TimesheetId,
            TaskId: timesheetItem.TaskId,
            Hours: timesheetItem.Hours,
            Description: timesheetItem.Description
        };

        $http.put(`/services/v4/js/chronos-app/gen/api/Timesheets/Item.js/${timesheetItem.Id}`, JSON.stringify(item))
            .then(function (response) {
                console.log("Item has been stored: " + JSON.stringify(response.data));

                $scope.loadTimesheets();
                $scope.hideItemDialog();
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
            });
    }

    $scope.deleteTimesheetItem = function (id) {
        if (confirm("Are you sure you want to delete this task")) {
            $http.delete(`/services/v4/js/chronos-app/gen/api/Timesheets/Item.js/${id}`)
                .then(function (response) {
                    console.log("Item has been deleted: " + JSON.stringify(response.data));

                    $scope.loadTimesheets();
                }, function (data) {
                    alert('Error: ' + JSON.stringify(data.data));
                });
        }
    }

    $scope.deleteTimesheet = function (timesheet, e) {
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this timesheet")) {
            $http.delete(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${timesheet.Id}`)
                .then(function (response) {
                    console.log("Timesheet has been deleted: " + JSON.stringify(response.data));

                    $scope.loadTimesheets();
                }, function (data) {
                    alert('Error: ' + JSON.stringify(data.data));
                });
        }

        // messageHub.showDialogAsync(
        //     'Delete Timesheet?',
        //     `Are you sure you want to delete this timesheet.`,
        //     [{
        //         id: "delete-btn-yes",
        //         type: "emphasized",
        //         label: "Yes",
        //     },
        //     {
        //         id: "delete-btn-no",
        //         type: "normal",
        //         label: "No",
        //     }],
        // ).then(function (msg) {
        //     if (msg.data === "delete-btn-yes") {
        //         $http.delete(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${timesheet.Id}`)
        //             .then(function (response) {
        //                 console.log("Timesheet has been deleted: " + JSON.stringify(response.data));

        //                 $scope.loadTimesheets();
        //             }, function (data) {
        //                 alert('Error: ' + JSON.stringify(data.data));
        //             });
        //     }
        // });

    }

    $scope.reopenTimesheet = function (timesheet, e) {
        const item = {
            EmployeeId: timesheet.EmployeeId,
            Start: timesheet.Start,
            End: timesheet.End,
            ProjectId: timesheet.ProjectId,
            Status: TimesheetStatus.Reopened
        };

        $http.put(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${timesheet.Id}`, JSON.stringify(item))
            .then(function (response) {
                console.log("Timesheet updated: " + JSON.stringify(response.data));

                $scope.loadTimesheets();
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
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
        return !timesheetItem.Hours || !timesheetItem.TaskId ? 'disabled' : undefined;
    }

    $scope.showItemDialog = function (e, timesheetId, item) {
        loadTasks($scope.manage.projectId).then(tasks => {
            $scope.manage.tasks = tasks;
            $scope.manage.timesheetItem = { TimesheetId: timesheetId, ...(item || {}) };

            $scope.manage.showDialog = true;
        }).catch(ex => console.log(`Failed to get tasks for project ID ${projectId}. ${ex.message}`));

        e.stopPropagation();
    }

    $scope.hideItemDialog = function () {
        $scope.manage.showDialog = false;
        $scope.manage.timesheetItem = {}
    }

    $http.get('/services/v4/js/chronos-ext/services/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;
        if ($scope.projects.length > 0) {
            $scope.manage.projectId = $scope.projects[0].Id;
            $scope.loadTimesheets();
        }
    });

    $http.get('/services/v4/js/chronos-ext/services/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });
}]);

