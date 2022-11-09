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

app.controller('controller', ['$scope', 'api', 'classNames', function ($scope, api, classNames) {

    $scope.projects = [];
    $scope.tasks = [];
    $scope.manage = {
        task: {},
        showDialog: false
    };

    api.getManagerProjects()
        .then(function (projects) {
            $scope.projects = projects;
        });

    api.getTaskStatuses()
        .then(function (statuses) {
            $scope.statuses = statuses;
        });

    const loadProjectTasks = function () {
        api.getManagerProjectTasks($scope.manage.projectId)
            .then(function (tasks) {
                $scope.tasks = tasks;
            });
    }

    $scope.$watch('manage.projectId', function (newProjectId) {
        if (newProjectId) {
            loadProjectTasks();
        }
    });

    api.getUser()
        .then(function (userId) {
            $scope.userid = userId;
        });

    $scope.addTask = function () {
        $scope.manage.task.ProjectId = $scope.manage.projectId;
        api.createProjectTask($scope.manage.task)
            .then(function () {
                loadProjectTasks();

                $scope.manage.task = {};

                $scope.hideTaskDialog();
            }, function (error) {
                alert(JSON.stringify(error));
            });
    }

    $scope.updateTask = function () {
        if (!$scope.manage.task.Id) {
            console.log('No task to update')
            return;
        }

        $scope.manage.task.ProjectId = $scope.manage.projectId;

        api.updateProjectTask($scope.manage.task.Id, $scope.manage.task)
            .then(function () {
                loadProjectTasks();

                $scope.manage.task = {};

                $scope.hideTaskDialog();
            }, function (error) {
                alert(JSON.stringify(error));
            });
    }

    $scope.removeSelectedTask = function () {
        if ($scope.manage.selectedTaskId) {
            $scope.removeTask($scope.manage.selectedTaskId);
        }
    }

    $scope.removeTask = function (id) {
        if (confirm("Are you sure you want to delete this task")) {
            api.deleteProjectTask(id)
                .then(function () {
                    loadProjectTasks();
                }, function (error) {
                    alert(JSON.stringify(error));
                });

            $scope.manage.selectedTaskId = null;
        }
    }

    $scope.showEditTaskDialog = function (id) {
        let taskId = id || $scope.manage.selectedTaskId;
        if (!taskId)
            return;

        let task = $scope.tasks.find(x => x.Id === taskId);
        if (!task)
            return;

        $scope.manage.task = { Id: task.Id, Name: task.Name, Link: task.Link, TaskStatusId: task.Status };

        $scope.showTaskDialog();
    }

    $scope.showTaskDialog = function () {
        $scope.manage.showDialog = true;
    }

    $scope.hideTaskDialog = function () {
        $scope.manage.showDialog = false;
        $scope.manage.task = {};
    }

    $scope.getProjectName = function (id) {
        let project = $scope.projects.find(x => x.Id === id);
        return project && project.Name;
    }

    $scope.hasSelectedProject = function () {
        return !!$scope.manage.projectId;
    }

    $scope.getStatusName = function (id) {
        let status = $scope.statuses.find(x => x.Id === id);
        return status && status.Name;
    }

    $scope.getStatusClassName = function (id) {
        const isActive = id === 1;
        const isInactive = id === 2;
        return classNames('sap-icon', {
            'sap-icon--sys-enter sap-icon--color-positive': isActive,
            'sap-icon--sys-cancel sap-icon--color-negative': isInactive,
            'sap-icon--question-mark sap-icon--color-information': !isActive && !isInactive,
        })
    }

    $scope.getStatus = function (id) {
        let name = $scope.getStatusName(id);
        return name === 'Active' ? 'positive' :
            name === 'Inactive' ? 'negative' : 'informative';
    }

    $scope.selectRow = function (taskId) {
        $scope.manage.selectedTaskId = taskId;
    }

    $scope.isRowSelected = function (taskId) {
        return $scope.manage.selectedTaskId === taskId;
    }

    $scope.hasSelectedRows = function () {
        return !!$scope.manage.selectedTaskId;
    }
}]);

