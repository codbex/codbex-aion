const viewData = {
    id: "TimesheetStatus-details",
    label: "TimesheetStatus",
    link: "/services/v4/web/chronos-app/gen/ui/Timesheets/TimesheetStatus/dialog-window/index.html"
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}