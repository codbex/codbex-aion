let app = angular.module("app", ['ideUI', 'ideView']);

app.controller('controller', ['$scope', '$http', 'utilities', function ($scope, $http, utilities) {

    const { TimesheetStatus } = utilities;

    $scope.projects = [];
    $scope.timesheets = [];
    $scope.manage = {};
    $scope.reject = {
        showDialog: false,
        timesheet: {},
        reason: ''
    };

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

    $http.get('/services/v4/js/chronos-ext/services/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;
    });

    $scope.loadTimesheets = function () {
        const { projectId } = $scope.manage;
        if (projectId) {
            $http.get(`/services/v4/js/chronos-ext/services/manager/mytimesheets.js?ProjectId=${projectId}&StatusId=${TimesheetStatus.Opened}&StatusId=${TimesheetStatus.Reopened}`)
                .then(function (response) {
                    $scope.timesheets = response.data;
                });
        }
    };

    $http.get('/services/v4/js/chronos-ext/services/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });

    $scope.approveTimesheet = function (timesheet, e) {
        e.stopPropagation();

        $http.post('/services/v4/js/chronos-ext/services/manager/approvetimesheet.js/' + timesheet.Id)
            .then(function (data) {
                removeTimesheet(timesheet);
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
            });
    }

    $scope.rejectTimesheet = function () {
        const { timesheet, reason } = $scope.reject;
        if (!timesheet.Id)
            return;

        $http.post('/services/v4/js/chronos-ext/services/manager/rejecttimesheet.js/' + timesheet.Id, { reason })
            .then(function (data) {
                removeTimesheet(timesheet);
                $scope.hideRejectDialog();
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
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
    }

}]);

