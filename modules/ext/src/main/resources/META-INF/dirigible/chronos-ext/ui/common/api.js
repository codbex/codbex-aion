angular.module('app')
    .provider('api', function Api() {
        this.$get = ['$q', '$http', function ($q, $http) {

            const httpGet = uri => {
                return $q((resolve, reject) => {
                    return $http.get(uri)
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            };

            const httpPost = (uri, data) => {
                return $q((resolve, reject) => {
                    return $http.post(uri, JSON.stringify(data))
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            }

            const httpPut = (uri, data) => {
                return $q((resolve, reject) => {
                    return $http.put(uri, JSON.stringify(data))
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            }

            const httpDelete = (uri) => {
                return $q((resolve, reject) => {
                    return $http.delete(uri)
                        .then(response => resolve(response.data), response => reject(response.data));
                });
            }

            return {
                getUser: function () {
                    return httpGet('/services/v4/js/chronos-ext/services/common/myuser.js');
                },
                getProjects: function () {
                    return httpGet('/services/v4/js/chronos-ext/services/common/myprojects.js');
                },
                getDeveloperProjectTasks: function (projectId) {
                    return httpGet(`/services/v4/js/chronos-ext/services/developer/mytasks.js?ProjectId=${projectId}`);
                },
                getDeveloperTimesheets: function (projectId, statusIds = []) {
                    const statusParams = statusIds.map(x => `&StatusId=${x}`).join('');
                    return httpGet(`/services/v4/js/chronos-ext/services/developer/mytimesheets.js?ProjectId=${projectId}${statusParams}`);
                },
                createTimesheet: function (timesheet) {
                    return httpPost('/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js', timesheet);
                },
                updateTimesheet: function (id, timesheet) {
                    return httpPut(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${id}`, timesheet);
                },
                deleteTimesheet: function (id) {
                    return httpDelete(`/services/v4/js/chronos-app/gen/api/Timesheets/Timesheet.js/${id}`);
                },
                createTimesheetItem: function (timesheetItem) {
                    return httpPost('/services/v4/js/chronos-app/gen/api/Timesheets/Item.js', timesheetItem);
                },
                updateTimesheetItem: function (id, timesheetItem) {
                    return httpPut(`/services/v4/js/chronos-app/gen/api/Timesheets/Item.js/${id}`, timesheetItem);
                },
                deleteTimesheetItem: function (id) {
                    return httpDelete(`/services/v4/js/chronos-app/gen/api/Timesheets/Item.js/${id}`);
                }
            }
        }]
    });