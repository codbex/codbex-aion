const viewData = {
    id: "TaskStatus",
    label: "TaskStatus",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/TaskStatus/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
