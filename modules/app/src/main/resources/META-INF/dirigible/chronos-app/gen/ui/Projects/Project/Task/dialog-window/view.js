const viewData = {
    id: "Task-details",
    label: "Task",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/Project/Task/dialog-window/index.html"
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}