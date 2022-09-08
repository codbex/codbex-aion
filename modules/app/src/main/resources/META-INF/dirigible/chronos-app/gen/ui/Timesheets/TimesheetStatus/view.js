const viewData = {
    id: "TimesheetStatus",
    label: "TimesheetStatus",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/Timesheets/TimesheetStatus/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
