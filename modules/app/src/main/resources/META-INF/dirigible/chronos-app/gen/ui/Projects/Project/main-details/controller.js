angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'chronos-app.Projects.Project';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/v4/js/chronos-app/gen/api/Projects/Project.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Project Details",
			create: "Create Project",
			update: "Update Project"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsEmployeeId = [];
				$scope.optionsProjectStatusId = [];
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
				$scope.optionsProjectStatusId = msg.data.optionsProjectStatusId;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsEmployeeId = msg.data.optionsEmployeeId;
				$scope.optionsProjectStatusId = msg.data.optionsProjectStatusId;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
					Name: true,
					EmployeeId: true,
					Start: true,
					End: true,
					ProjectStatusId: true,
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
				$scope.optionsProjectStatusId = msg.data.optionsProjectStatusId;
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
					messageHub.showAlertError("Project", `Unable to create Project: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Project", "Project successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Project", `Unable to update Project: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Project", "Project successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);