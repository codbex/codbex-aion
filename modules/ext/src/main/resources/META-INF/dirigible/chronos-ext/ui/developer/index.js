let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-index';
}]);

app.controller('controller', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    $scope.activities = [
        {
            id: 'filloutTimesheet',
            name: 'Fill out the Weekly Timesheet',
            description: 'Enter the relevant hours spent on the tasks you worked on this week from the selected project.',
            link: 'fillouttimesheet.html'
        }
    ];

    $scope.openActivity = function (activity) {
        window.location = activity.link;
    }


}]);
