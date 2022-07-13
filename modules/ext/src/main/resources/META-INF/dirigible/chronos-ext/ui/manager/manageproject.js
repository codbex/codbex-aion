let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-fillouttimesheet';
}]);

app.controller('controller', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    $scope.projects = [];
    $scope.tasks = [];
    $scope.manage = {};

    $http.get('/services/v4/js/chronos-ext/ui/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;
    });

    $http.get('/services/v4/js/chronos-app/gen/api/Projects/TaskStatus.js').then(function (response) {
        $scope.statuses = response.data;
    });

    $scope.$watch('manage.project', function (newProject) {
        if (newProject) {
            $http.get('/services/v4/js/chronos-ext/ui/manager/mytasks.js?ProjectId=' + newProject.Id).then(function (response) {
                $scope.tasks = response.data;
            });
        }
    });

    $http.get('/services/v4/js/chronos-ext/ui/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });

    $scope.addTask = function () {
        $scope.manage.task.ProjectId = $scope.manage.project.Id;
        $scope.manage.task.TaskStatusId = $scope.manage.task.Status.Id;
        $http.post('/services/v4/js/chronos-app/gen/api/Projects/Task.js', JSON.stringify($scope.manage.task))
            .then(function (data) {
                $scope.tasks.push($scope.manage.task);
                $scope.manage.task = {};
            }, function (data) {
                alert(JSON.stringify(data.data));
            });

    }

    $scope.removeTask = function (id) {
        if (confirm("Are you sure you want to delete this task")) {
            $http.delete('/services/v4/js/chronos-app/gen/api/Projects/Task.js/' + id)
                .then(function (data) {
                    $http.get('/services/v4/js/chronos-ext/ui/manager/mytasks.js?ProjectId=' + $scope.manage.project.Id).then(function (response) {
                        $scope.tasks = response.data;
                    });
                }, function (data) {
                    alert(JSON.stringify(data));
                });
        }
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

        // let manage = {};
        // manage.EmployeeId = $scope.userid;
        // manage.ProjectId = $scope.manage.project.Id;

        // $http.post('/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js', JSON.stringify(timesheet))
        //     .then(function (data) {
        //         $scope.items.forEach(function (item) {
        //             let timesheetItem = {};
        //             timesheetItem.TimesheetId = data.data.Id;
        //             timesheetItem.TaskId = item.task.Id;
        //             timesheetItem.Hours = item.Hours;
        //             timesheetItem.Description = item.Description;
        //             $http.post('/services/v4/js/chronos-app/gen/api/Timesheets/Item.js', JSON.stringify(timesheetItem))
        //                 .then(function (data) {
        //                     console.log("Item has been stored: " + JSON.stringify(timesheetItem));
        //                 }, function (data) {
        //                     alert('Error: ' + JSON.stringify(data.data));
        //                 });
        //         })
        //         console.log("Timesheet has been stored: " + JSON.stringify(timesheet));
        //         alert("Timesheet has been registered successfully.");
        //         window.location = "index.html";
        //     }, function (data) {
        //         alert('Error: ' + JSON.stringify(data.data));
        //     });

    }



}]);

