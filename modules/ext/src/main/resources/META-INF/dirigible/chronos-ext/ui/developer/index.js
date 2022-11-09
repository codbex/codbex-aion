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
            id: 'filloutTimesheet',
            name: 'Fill out the Weekly Timesheet',
            description: 'Enter the relevant hours spent on the tasks you worked on this week from the selected project.',
            link: 'fillouttimesheet.html'
        },
        {
            id: 'myTimesheets',
            name: 'My Timesheets',
            description: 'Edit your opened or rejected timesheets.',
            link: 'managetimesheets.html'
        }
    ];

    $scope.openActivity = function (activity) {
        window.location = activity.link;
    }


}]);
