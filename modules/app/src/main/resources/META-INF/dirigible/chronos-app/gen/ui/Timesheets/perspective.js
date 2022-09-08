const perspectiveData = {
	id: "Timesheets",
	name: "Timesheets",
	link: "/services/v4/web/chronos-app/gen/ui/Timesheets/index.html",
	order: "100",
	// icon: "/services/v4/web/chronos/gen/ui/Timesheets/images/workbench.svg",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}