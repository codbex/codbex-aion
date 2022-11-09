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
    messageHubProvider.eventIdPrefix = 'chronos-developer-generatereport';
}]);

app.controller('controller', ['$scope', 'api', 'utilities', function ($scope, api, utilities) {
    const now = new Date();

    $scope.projects = [];
    $scope.report = {
        Start: utilities.getFirstDayOfMonth(now),
        End: utilities.getLastDayOfMonth(now)
    };

    api.getManagerProjects()
        .then(projects => {
            $scope.projects = projects;

            if ($scope.projects.length == 1) {
                $scope.report.projectId = $scope.projects[0].Id;
            }
        });
}]);