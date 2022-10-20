angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'chronos-app.Projects.Project';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/chronos-app/gen/api/Projects/Project.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = "select";

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.selectedEntity = null;
				$scope.action = "select";
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			refreshData();
			$scope.loadPage();
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			refreshData();
			$scope.loadPage();
		});
		//-----------------Events-------------------//

		$scope.loadPage = function () {
			$scope.selectedEntity = null;
			entityApi.count().then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Project", `Unable to count Project: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				let offset = ($scope.dataPage - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				if ($scope.dataReset) {
					offset = 0;
					limit = $scope.dataPage * $scope.dataLimit;
				}
				entityApi.list(offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Project", `Unable to list Project: '${response.message}'`);
						return;
					}
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}

					response.data.forEach(e => {
						if (e.Start) {
							e.Start = new Date(e.Start);
						}
						if (e.End) {
							e.End = new Date(e.End);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.postMessage("entitySelected", {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsEmployeeId: $scope.optionsEmployeeId,
				optionsProjectStatusId: $scope.optionsProjectStatusId,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			$scope.action = "create";

			messageHub.postMessage("createEntity", {
				entity: {},
				optionsEmployeeId: $scope.optionsEmployeeId,
				optionsProjectStatusId: $scope.optionsProjectStatusId,
			});
		};

		$scope.updateEntity = function () {
			$scope.action = "update";
			messageHub.postMessage("updateEntity", {
				entity: $scope.selectedEntity,
				optionsEmployeeId: $scope.optionsEmployeeId,
				optionsProjectStatusId: $scope.optionsProjectStatusId,
			});
		};

		$scope.deleteEntity = function () {
			let id = $scope.selectedEntity.Id;
			messageHub.showDialogAsync(
				'Delete Project?',
				`Are you sure you want to delete Project? This action cannot be undone.`,
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
							messageHub.showAlertError("Project", `Unable to delete Project: '${response.message}'`);
							return;
						}
						refreshData();
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsEmployeeId = [];
		$scope.optionsProjectStatusId = [];

		$http.get("/services/v4/js/chronos-app/gen/api/Employees/Employee.js").then(function (response) {
			$scope.optionsEmployeeId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/v4/js/chronos-app/gen/api/Configurations/ProjectStatus.js").then(function (response) {
			$scope.optionsProjectStatusId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsEmployeeIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsEmployeeId.length; i++) {
				if ($scope.optionsEmployeeId[i].value === optionKey) {
					return $scope.optionsEmployeeId[i].text;
				}
			}
			return null;
		};
		$scope.optionsProjectStatusIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsProjectStatusId.length; i++) {
				if ($scope.optionsProjectStatusId[i].value === optionKey) {
					return $scope.optionsProjectStatusId[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
