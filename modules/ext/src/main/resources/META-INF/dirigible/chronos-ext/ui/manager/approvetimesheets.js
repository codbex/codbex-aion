let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-fillouttimesheet';
}]);

app.controller('controller', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    $scope.projects = [];
    $scope.timesheets = [];
    $scope.manage = {};

    $http.get('/services/v4/js/chronos-ext/services/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;
    });

    $scope.$watch('manage.project', function (newProject) {
        if (newProject) {
            $http.get('/services/v4/js/chronos-ext/services/manager/mytimesheets.js?ProjectId=' + newProject.Id).then(function (response) {
                $scope.timesheets = response.data;
            });
        }
    });

    $http.get('/services/v4/js/chronos-ext/services/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });

    $scope.page = {};
    $scope.page.number = 1;

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

    $scope.finishProject = function () {
        window.location = "index.html";
    }

    $scope.approveTimesheet = function (timesheet) {
        $http.post('/services/v4/js/chronos-ext/services/manager/approvetimesheet.js/' + timesheet.Id)
            .then(function (data) {
                timesheet.Approved = 1;
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
            });

    }

    $scope.rejectTimesheet = function (timesheet) {
        $http.post('/services/v4/js/chronos-ext/services/manager/rejecttimesheet.js/' + timesheet.Id)
            .then(function (data) {
                timesheet.Approved = 0;
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
            });

    }

    $scope.options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    $scope.week = {};
    $scope.week.start = getMonday(new Date()).toLocaleDateString("en-US", $scope.options);
    $scope.week.end = getFriday(new Date()).toLocaleDateString("en-US", $scope.options);

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    function getFriday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff + 4));
    }

}]);

