angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'chronos-app.Employees.Assignment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/chronos-app/gen/api/Employees/Assignment.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Assignment Details",
			create: "Create Assignment",
			update: "Update Assignment"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		if (window != null && window.frameElement != null && window.frameElement.hasAttribute("data-parameters")) {
			let dataParameters = window.frameElement.getAttribute("data-parameters");
			if (dataParameters) {
				let params = JSON.parse(dataParameters);
				$scope.action = params.action;
				if ($scope.action === "create") {
					// Set Errors for required fields only
					$scope.formErrors = {
						ProjectId: true,
						Role: true,
						Start: true,
						End: true,

					};
				}

				if (params.entity.Start) {
					params.entity.Start = new Date(params.entity.Start);
				}
				if (params.entity.End) {
					params.entity.End = new Date(params.entity.End);
				}

				$scope.entity = params.entity;
				$scope.selectedMainEntityKey = params.selectedMainEntityKey;
				$scope.selectedMainEntityId = params.selectedMainEntityId;
				$scope.optionsEmployeeId = params.optionsEmployeeId;
				$scope.optionsProjectId = params.optionsProjectId;
				$scope.optionsRole = params.optionsRole;
			}
		}

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
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Assignment", `Unable to create Assignment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Assignment", "Assignment successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Assignment", `Unable to update Assignment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("Assignment", "Assignment successfully updated");
			});
		};

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("Assignment-details");
		};

	}]);