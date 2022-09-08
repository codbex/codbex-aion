const viewData = {
    id: "TaskStatus-details",
    label: "TaskStatus",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/TaskStatus/dialog-window/index.html"
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}