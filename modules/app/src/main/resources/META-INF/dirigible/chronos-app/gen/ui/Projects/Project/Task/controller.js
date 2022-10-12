angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'chronos-app.Projects.Task';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/chronos-app/gen/api/Projects/Task.js";
	}])
	.controller('PageController', ['$scope', '$http', '$http', 'messageHub', 'entityApi', function ($scope, $http, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("chronos-app.Projects.Project.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("chronos-app.Projects.Project.clearDetails", function (msg) {
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
			let ProjectId = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(ProjectId).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Task", `Unable to count Task: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `ProjectId=${ProjectId}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Task", `Unable to list Task: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("Task-details", {
				action: "select",
				entity: entity,
				optionsTaskStatusId: $scope.optionsTaskStatusId,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Task-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "ProjectId",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsTaskStatusId: $scope.optionsTaskStatusId,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Task-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "ProjectId",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsTaskStatusId: $scope.optionsTaskStatusId,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Task?',
				`Are you sure you want to delete Task? This action cannot be undone.`,
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
							messageHub.showAlertError("Task", `Unable to delete Task: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsTaskStatusId = [];

		$http.get("/services/v4/js/chronos-app/gen/api/Configurations/TaskStatus.js").then(function (response) {
			$scope.optionsTaskStatusId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsTaskStatusIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsTaskStatusId.length; i++) {
				if ($scope.optionsTaskStatusId[i].value === optionKey) {
					return $scope.optionsTaskStatusId[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
