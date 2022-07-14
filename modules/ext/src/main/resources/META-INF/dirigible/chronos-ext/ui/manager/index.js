let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-index';
}]);

app.controller('controller', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

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
        }
    ];

    $scope.openActivity = function (activity) {
        window.location = activity.link;
    }


}]);
