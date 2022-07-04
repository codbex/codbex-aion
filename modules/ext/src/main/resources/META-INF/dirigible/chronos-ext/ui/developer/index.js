let app = angular.module("app", ['ideUI', 'ideView']);

app.config(["messageHubProvider", function (messageHubProvider) {
    messageHubProvider.eventIdPrefix = 'chronos-developer-index';
}]);

app.controller('controller', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {

    $scope.activities = [
        {
            id: 'filloutTimesheet',
            name: 'Fill out the Weekly Timesheet',
            description: 'Enter the corresponding hours spent daily for a given project',
            link: 'fillouttimesheet.html'
        }
    ];

    $scope.openActivity = function (activity) {
        window.location = activity.link;
    }


}]);
