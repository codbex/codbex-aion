const viewData = {
    id: "Project-details",
    label: "Project",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/Project/main-details/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
