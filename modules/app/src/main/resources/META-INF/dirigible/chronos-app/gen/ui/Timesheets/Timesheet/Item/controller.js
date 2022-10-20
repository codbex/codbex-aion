angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'chronos-app.Timesheets.Item';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/chronos-app/gen/api/Timesheets/Item.js";
	}])
	.controller('PageController', ['$scope', '$http', '$http', 'messageHub', 'entityApi', function ($scope, $http, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("chronos-app.Timesheets.Timesheet.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("chronos-app.Timesheets.Timesheet.clearDetails", function (msg) {
			$scope.$apply(function () {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}, true);

		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			let TimesheetId = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(TimesheetId).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Item", `Unable to count Item: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `TimesheetId=${TimesheetId}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Item", `Unable to list Item: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Day) {
							e.Day = new Date(e.Day);
						}
					});

					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Item-details", {
				action: "select",
				entity: entity,
				optionsTaskId: $scope.optionsTaskId,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Item-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "TimesheetId",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsTaskId: $scope.optionsTaskId,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Item-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "TimesheetId",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsTaskId: $scope.optionsTaskId,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Item?',
				`Are you sure you want to delete Item? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("Item", `Unable to delete Item: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsTaskId = [];

		$http.get("/services/v4/js/chronos-app/gen/api/Projects/Task.js").then(function (response) {
			$scope.optionsTaskId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsTaskIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsTaskId.length; i++) {
				if ($scope.optionsTaskId[i].value === optionKey) {
					return $scope.optionsTaskId[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
