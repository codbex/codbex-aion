let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-fillouttimesheet';
}]);

app.controller('controller', ['$scope', '$http', 'utilities', function ($scope, $http, utilities) {

    const { TimesheetStatus, settings } = utilities;
    $scope.options = utilities.options;
    $scope.maxHoursPerWeek = settings.maxHoursPerWeek;

    $scope.timesheet = {};
    $scope.timesheet.Start = utilities.getMonday(new Date());
    $scope.timesheet.End = utilities.getFriday(new Date());

    $scope.projects = [];
    $scope.tasks = [];

    $http.get('/services/v4/js/chronos-ext/services/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;

        if ($scope.projects.length == 1) {
            $scope.timesheet.projectId = $scope.projects[0].Id;
            $scope.loadTasks();
        }
    });

    $scope.loadTasks = function () {
        const { projectId } = $scope.timesheet;
        if (projectId) {
            $http.get(`/services/v4/js/chronos-ext/services/developer/mytasks.js?ProjectId=${projectId}`)
                .then(function (response) {
                    $scope.tasks = response.data;
                    $scope.items = [];
                });
        }
    };

    $http.get('/services/v4/js/chronos-ext/services/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });

    $scope.items = [];
    $scope.item = {};
    $scope.item.Id = (new Date()).getTime();

    $scope.addItem = function () {
        $scope.item.ProjectId = $scope.timesheet.projectId;
        $scope.items.push($scope.item);
        $scope.item = {};
        $scope.item.Id = (new Date()).getTime();

    }

    $scope.removeItem = function (id) {
        $scope.items.splice($scope.items.findIndex(function (i) {
            return i.Id === id;
        }), 1);
    }

    $scope.saveTimesheet = function () {

        let timesheet = {};
        timesheet.EmployeeId = $scope.userid;
        timesheet.Start = $scope.timesheet.Start;
        timesheet.End = $scope.timesheet.End;
        timesheet.ProjectId = $scope.timesheet.projectId;
        timesheet.Status = TimesheetStatus.Opened;

        $http.post('/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js', JSON.stringify(timesheet))
            .then(function (data) {
                $scope.items.forEach(function (item) {
                    let timesheetItem = {};
                    timesheetItem.TimesheetId = data.data.Id;
                    timesheetItem.TaskId = item.taskId;
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

                $scope.gotoNextStep();

            }, function (data) {
                alert('Error: ' + JSON.stringify(data.data));
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
        $scope.items = [];
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
                isDisabled = !$scope.items.length;
                break;
        }

        return isDisabled ? 'disabled' : undefined;
    }

    $scope.getAddTaskButtonState = function () {
        return !$scope.item.Hours || !$scope.item.taskId ? 'disabled' : undefined;
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
        return $scope.items.reduce((sum, x) => sum + x.Hours, 0);
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