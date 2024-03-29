angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-aion.Timesheets.Timesheet';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-aion/gen/api/Timesheets/Timesheet.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Timesheet Details",
			create: "Create Timesheet",
			update: "Update Timesheet"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsEmployeeId = [];
				$scope.optionsProjectId = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Start) {
					msg.data.entity.Start = new Date(msg.data.entity.Start);
				}
				if (msg.data.entity.End) {
					msg.data.entity.End = new Date(msg.data.entity.End);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsEmployeeId = msg.data.optionsEmployeeId;
				$scope.optionsProjectId = msg.data.optionsProjectId;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsEmployeeId = msg.data.optionsEmployeeId;
				$scope.optionsProjectId = msg.data.optionsProjectId;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
					EmployeeId: true,
					ProjectId: true,
					Start: true,
					End: true,
					Status: true,
				};
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Start) {
					msg.data.entity.Start = new Date(msg.data.entity.Start);
				}
				if (msg.data.entity.End) {
					msg.data.entity.End = new Date(msg.data.entity.End);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsEmployeeId = msg.data.optionsEmployeeId;
				$scope.optionsProjectId = msg.data.optionsProjectId;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Timesheet", `Unable to create Timesheet: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Timesheet", "Timesheet successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Timesheet", `Unable to update Timesheet: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Timesheet", "Timesheet successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);