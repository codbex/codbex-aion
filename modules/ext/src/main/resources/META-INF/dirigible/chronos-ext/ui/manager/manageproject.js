let app = angular.module("app", ['ideUI', 'ideView']);

app.controller('controller', ['$scope', '$http', 'classNames', function ($scope, $http, classNames) {

    $scope.projects = [];
    $scope.tasks = [];
    $scope.manage = {
        task: {},
        showDialog: false
    };

    $http.get('/services/v4/js/chronos-ext/services/common/myprojects.js').then(function (response) {
        $scope.projects = response.data;
    });

    $http.get('/services/v4/js/chronos-app/gen/api/Projects/TaskStatus.js').then(function (response) {
        $scope.statuses = response.data;
    });

    $scope.$watch('manage.projectId', function (newProjectId) {
        if (newProjectId) {
            $http.get('/services/v4/js/chronos-ext/services/manager/mytasks.js?ProjectId=' + newProjectId).then(function (response) {
                $scope.tasks = response.data;
            });
        }
    });

    $http.get('/services/v4/js/chronos-ext/services/common/myuser.js').then(function (response) {
        $scope.userid = response.data;
    });

    $scope.addTask = function () {
        $scope.manage.task.ProjectId = $scope.manage.projectId;
        $http.post('/services/v4/js/chronos-app/gen/api/Projects/Task.js', JSON.stringify($scope.manage.task))
            .then(function (data) {
                $http.get('/services/v4/js/chronos-ext/services/manager/mytasks.js?ProjectId=' + $scope.manage.projectId).then(function (response) {
                    $scope.tasks = response.data;
                });
                $scope.manage.task = {};

                $scope.hideTaskDialog();
            }, function (data) {
                alert(JSON.stringify(data.data));
            });
    }

    $scope.updateTask = function () {
        if (!$scope.manage.task.Id) {
            console.log('No task to update')
            return;
        }

        $scope.manage.task.ProjectId = $scope.manage.projectId;

        $http.put(`/services/v4/js/chronos-app/gen/api/Projects/Task.js/${$scope.manage.task.Id}`, JSON.stringify($scope.manage.task))
            .then(function (data) {
                $http.get('/services/v4/js/chronos-ext/services/manager/mytasks.js?ProjectId=' + $scope.manage.projectId).then(function (response) {
                    $scope.tasks = response.data;
                });
                $scope.manage.task = {};

                $scope.hideTaskDialog();
            }, function (data) {
                alert(JSON.stringify(data.data));
            });
    }

    $scope.removeSelectedTask = function () {
        if ($scope.manage.selectedTaskId) {
            $scope.removeTask($scope.manage.selectedTaskId);
        }
    }

    $scope.removeTask = function (id) {
        if (confirm("Are you sure you want to delete this task")) {
            $http.delete('/services/v4/js/chronos-app/gen/api/Projects/Task.js/' + id)
                .then(function (data) {
                    $http.get('/services/v4/js/chronos-ext/services/manager/mytasks.js?ProjectId=' + $scope.manage.projectId).then(function (response) {
                        $scope.tasks = response.data;
                    });
                }, function (data) {
                    alert(JSON.stringify(data));
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

