angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'chronos-app.Employees.Assignment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/chronos-app/gen/api/Employees/Assignment.js";
	}])
	.controller('PageController', ['$scope', '$http', '$http', 'messageHub', 'entityApi', function ($scope, $http, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("chronos-app.Employees.Employee.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("chronos-app.Employees.Employee.clearDetails", function (msg) {
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
			let EmployeeId = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(EmployeeId).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Assignment", `Unable to count Assignment: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `EmployeeId=${EmployeeId}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("Assignment", `Unable to list Assignment: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Start) {
							e.Start = new Date(e.Start);
						}
						if (e.End) {
							e.End = new Date(e.End);
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
			messageHub.showDialogWindow("Assignment-details", {
				action: "select",
				entity: entity,
				optionsEmployeeId: $scope.optionsEmployeeId,
				optionsProjectId: $scope.optionsProjectId,
				optionsRole: $scope.optionsRole,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("Assignment-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "EmployeeId",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsEmployeeId: $scope.optionsEmployeeId,
				optionsProjectId: $scope.optionsProjectId,
				optionsRole: $scope.optionsRole,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("Assignment-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "EmployeeId",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsEmployeeId: $scope.optionsEmployeeId,
				optionsProjectId: $scope.optionsProjectId,
				optionsRole: $scope.optionsRole,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete Assignment?',
				`Are you sure you want to delete Assignment? This action cannot be undone.`,
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
							messageHub.showAlertError("Assignment", `Unable to delete Assignment: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsEmployeeId = [];
		$scope.optionsProjectId = [];
		$scope.optionsRole = [];

		$http.get("/services/v4/js/chronos-app/gen/api/Employees/Employee.js").then(function (response) {
			$scope.optionsEmployeeId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/v4/js/chronos-app/gen/api/Projects/Project.js").then(function (response) {
			$scope.optionsProjectId = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/v4/js/chronos-app/gen/api/Configurations/Role.js").then(function (response) {
			$scope.optionsRole = response.data.map(e => {
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
		$scope.optionsProjectIdValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsProjectId.length; i++) {
				if ($scope.optionsProjectId[i].value === optionKey) {
					return $scope.optionsProjectId[i].text;
				}
			}
			return null;
		};
		$scope.optionsRoleValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsRole.length; i++) {
				if ($scope.optionsRole[i].value === optionKey) {
					return $scope.optionsRole[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//

	}]);
