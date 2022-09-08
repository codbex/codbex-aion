const perspectiveData = {
	id: "Projects",
	name: "Projects",
	link: "/services/v4/web/chronos-app/gen/ui/Projects/index.html",
	order: "100",
	// icon: "/services/v4/web/chronos/gen/ui/Timesheets/images/workbench.svg",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}