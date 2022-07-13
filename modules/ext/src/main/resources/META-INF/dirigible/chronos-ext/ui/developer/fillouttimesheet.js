let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-fillouttimesheet';
}]);

app.controller('controller', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    $scope.options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    $scope.week = {};
    $scope.week.start = getMonday(new Date()).toLocaleDateString("en-US", $scope.options);
    $scope.week.end = getFriday(new Date()).toLocaleDateString("en-US", $scope.options);

    $scope.timesheet = {};
    $scope.timesheet.Start = getMonday(new Date());
    $scope.timesheet.End = getFriday(new Date());

    $scope.projects = [];
    $scope.tasks = [];

    $http.get('/services/v4/js/chronos-ext/ui/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;
    });

    $scope.$watch('timesheet.project', function (newProject) {
        if (newProject) {
            $http.get('/services/v4/js/chronos-ext/ui/developer/mytasks.js?ProjectId=' + newProject.Id).then(function (response) {
                $scope.tasks = response.data;
                $scope.items = [];
            });
        }
    });

    $http.get('/services/v4/js/chronos-ext/ui/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });



    $scope.items = [];
    $scope.item = {};
    $scope.item.Id = (new Date()).getTime();

    $scope.addItem = function () {
        $scope.item.ProjectId = $scope.timesheet.project.Id;
        $scope.items.push($scope.item);
        $scope.item = {};
        $scope.item.Id = (new Date()).getTime();

    }

    $scope.removeItem = function (id) {
        $scope.items.splice($scope.items.findIndex(function (i) {
            return i.Id === id;
        }), 1);
    }

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

    $scope.isSaveDisabled = function () {
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

    $scope.saveTimesheet = function () {

        let timesheet = {};
        timesheet.EmployeeId = $scope.userid;
        timesheet.Start = $scope.timesheet.Start;
        timesheet.End = $scope.timesheet.End;
        timesheet.ProjectId = $scope.timesheet.project.Id;

        $http.post('/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js', JSON.stringify(timesheet))
            .then(function (data) {
                $scope.items.forEach(function (item) {
                    let timesheetItem = {};
                    timesheetItem.TimesheetId = data.data.Id;
                    timesheetItem.TaskId = item.task.Id;
                    timesheetItem.Hours = item.Hours;
                    timesheetItem.Description = item.Description;
                    $http.post('/services/v4/js/chronos-app/gen/api/Timesheets/Item.js', JSON.stringify(timesheetItem))
                        .then(function (data) {
                            console.log("Item has been stored: " + JSON.stringify(timesheetItem));
                        }, function (data) {
                            alert('Error: ' + JSON.stringify(data.data));
                        });
                })
                console.log("Timesheet has been stored: " + JSON.stringify(timesheet));
                alert("Timesheet has been registered successfully.");
                window.location = "index.html";
            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
            });

    }



}]);

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

