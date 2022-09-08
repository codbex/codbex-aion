const viewData = {
    id: "Task",
    label: "Task",
    factory: "frame",
    region: "bottom",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/Project/Task/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
