const viewData = {
    id: "Project",
    label: "Project",
    factory: "frame",
    region: "left",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/Project/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
