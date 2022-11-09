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

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-fillouttimesheet';
}]);

app.controller('controller', ['$scope', 'utilities', 'api', function ($scope, utilities, api) {

    const { TimesheetStatus, settings, dateToString, groupTimesheetItemsByDate } = utilities;
    $scope.options = utilities.options;
    $scope.maxHoursPerWeek = settings.maxHoursPerWeek;
    $scope.dateToString = dateToString;

    $scope.timesheet = {
        items: [],
        groupedItems: [],
        groupItems: () => $scope.timesheet.groupedItems = groupTimesheetItemsByDate([$scope.timesheet])[0].groupedItems,
        addItem: (item) => {
            $scope.timesheet.items.push(item);
            $scope.timesheet.groupItems();
        },
        removeItem: (id) => {
            const { items } = $scope.timesheet;
            let index = items.findIndex(item => item.Id === id);
            if (index >= 0) {
                items.splice(index, 1);
                $scope.timesheet.groupItems();
            }
        },
        clearItems: () => {
            $scope.timesheet.items = [];
            $scope.timesheet.groupedItems = [];
        }
    };
    $scope.timesheet.Start = utilities.getMonday(new Date());
    $scope.timesheet.End = utilities.getFriday(new Date());

    $scope.projects = [];
    $scope.tasks = [];

    api.getDeveloperProjects()
        .then(function (projects) {
            $scope.projects = projects;

            if ($scope.projects.length == 1) {
                $scope.timesheet.projectId = $scope.projects[0].Id;
                $scope.loadTasks();
            }
        });

    $scope.loadTasks = function () {
        const { projectId } = $scope.timesheet;
        if (projectId) {
            api.getDeveloperProjectTasks(projectId)
                .then(function (tasks) {
                    $scope.tasks = tasks;
                    $scope.timesheet.clearItems();
                });
        }
    };

    api.getUser()
        .then(function (userId) {
            $scope.userid = userId;
        });

    $scope.item = {};
    $scope.item.Id = (new Date()).getTime();

    $scope.addItem = function () {
        $scope.item.ProjectId = $scope.timesheet.projectId;
        $scope.timesheet.addItem($scope.item);

        $scope.item = {};
        $scope.item.Id = (new Date()).getTime();
    }

    $scope.removeItem = function (id) {
        $scope.timesheet.removeItem(id);
    }

    $scope.saveTimesheet = function () {

        let timesheet = {};
        timesheet.EmployeeId = $scope.userid;
        timesheet.Start = $scope.timesheet.Start;
        timesheet.End = $scope.timesheet.End;
        timesheet.ProjectId = $scope.timesheet.projectId;
        timesheet.Status = TimesheetStatus.Opened;

        api.createTimesheet(timesheet)
            .then(function (createdTimesheet) {
                $scope.timesheet.items.forEach(function (item) {
                    let timesheetItem = {};
                    timesheetItem.TimesheetId = createdTimesheet.Id;
                    timesheetItem.TaskId = item.taskId;
                    timesheetItem.Day = item.Day;
                    timesheetItem.Hours = item.Hours;
                    timesheetItem.Description = item.Description;

                    api.createTimesheetItem(timesheetItem)
                        .then(function () {
                            console.log("Item has been stored: " + JSON.stringify(timesheetItem));
                        }, function (error) {
                            alert('Error: ' + JSON.stringify(error));
                        });
                })

                console.log("Timesheet has been stored: " + JSON.stringify(timesheet));

                $scope.gotoNextStep();

            }, function (error) {
                alert('Error: ' + JSON.stringify(error));
            });

    }

    $scope.finish = function () {
        window.location = "index.html";
    }

    $scope.page = {
        number: 1,
        completed: 0,
        count: 2
    };

    $scope.restart = function () {
        $scope.page.number = 1;
        $scope.page.completed = 0;
        $scope.timesheet.clearItems();
    }

    $scope.gotoNextStep = function () {
        if ($scope.page.number > $scope.page.completed) {
            $scope.page.completed = $scope.page.number;
        }

        if ($scope.page.number <= $scope.page.count) {
            $scope.gotoStep($scope.page.number + 1);
        }
    }

    $scope.gotoPreviousStep = function () {
        if ($scope.page.number > 1) {
            $scope.gotoStep($scope.page.number - 1);
        }
    }

    $scope.gotoStep = function (pageNumber) {
        $scope.page.number = pageNumber;
    }

    $scope.getIndicatorGlyph = function (pageNumber) {
        return pageNumber <= $scope.page.completed ? 'sap-icon--accept' : undefined;
    }

    $scope.isLastStep = function () {
        return $scope.page.number === $scope.page.count;
    }

    $scope.allStepsCompleted = function () {
        return $scope.page.completed >= $scope.page.count;
    }

    $scope.getBackButtonState = function () {
        return $scope.page.number === 1 ? 'disabled' : undefined;
    }

    $scope.getNextButtonState = function () {
        let isDisabled = false;

        switch ($scope.page.number) {
            case 1:
                isDisabled = !$scope.timesheet.projectId || !$scope.timesheet.Start || !$scope.timesheet.End;
                break;
            case 2:
                isDisabled = !$scope.timesheet.items.length;
                break;
        }

        return isDisabled ? 'disabled' : undefined;
    }

    $scope.getAddTaskButtonState = function () {
        return !$scope.item.Hours || !$scope.item.taskId || !$scope.item.Day ? 'disabled' : undefined;
    }

    $scope.getProjectName = function (id) {
        let project = $scope.projects.find(x => x.Id === id);
        return project && project.Name;
    }

    $scope.getTaskName = function (id) {
        let task = $scope.tasks.find(x => x.Id === id);
        return task && task.Name;
    }

    $scope.getTotalHours = function () {
        return $scope.timesheet.items.reduce((sum, x) => sum + x.Hours, 0);
    }

    $scope.isNextDisabled = function () {
        return $scope.page.number == 3;
    }

    $scope.isBackDisabled = function () {
        return $scope.page.number == 1;
    }

    $scope.isAddDisabled = function () {
        return $scope.page.number != 2;
    }

    $scope.isFinishDisabled = function () {
        return $scope.page.number != 3;
    }

    $scope.isProjectFormDisabled = function () {
        return $scope.page.number != 1;
    }

    $scope.isItemsFormDisabled = function () {
        return $scope.page.number != 2;
    }

    $scope.nextPage = function () {
        $scope.page.number = $scope.page.number + 1;
    }

    $scope.previousPage = function () {
        $scope.page.number = $scope.page.number - 1;
    }

    $scope.startDateChanged = function () {
        if ($scope.timesheet.Start >= $scope.timesheet.End) {
            $scope.timesheet.End = utilities.addDays($scope.timesheet.Start, 1);
        }
    }

    $scope.endDateChanged = function () {
        if ($scope.timesheet.Start >= $scope.timesheet.End) {
            $scope.timesheet.Start = utilities.addDays($scope.timesheet.End, -1);
        }
    }
}]);