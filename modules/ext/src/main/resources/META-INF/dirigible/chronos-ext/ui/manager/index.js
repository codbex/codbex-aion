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
    messageHubProvider.eventIdPrefix = 'chronos-developer-index';
}]);

app.controller('controller', ['$scope', function ($scope) {

    $scope.activities = [
        {
            id: 'manageProjectTasks',
            name: 'Manage Project Tasks',
            description: 'Add, remove or edit project tasks',
            link: 'manageproject.html'
        },
        {
            id: 'approveTimesheets',
            name: 'Approve Timesheets',
            description: 'Approve timesheets of direct reports for the current week',
            link: 'approvetimesheets.html'
        },
        {
            id: 'genereateReport',
            name: 'Generate Report',
            description: 'Generate monthly timesheets report',
            link: 'generatereport.html'
        }
    ];

    $scope.openActivity = function (activity) {
        window.location = activity.link;
    }


}]);
