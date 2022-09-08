const viewData = {
    id: "ProjectStatus",
    label: "ProjectStatus",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/ProjectStatus/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
