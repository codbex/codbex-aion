const perspectiveData = {
	id: "home",
	name: "Home",
	link: "/services/v4/web/chronos-app/gen/index.html",
	order: "1",
	// icon: "/services/v4/web/ide/images/workbench.svg",
};

if (typeof exports !== 'undefined') {
	exports.getPerspective = function () {
		return perspectiveData;
	}
}