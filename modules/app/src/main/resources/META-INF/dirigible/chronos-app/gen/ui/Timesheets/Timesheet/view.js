const viewData = {
    id: "Timesheet",
    label: "Timesheet",
    factory: "frame",
    region: "left",
    link: "/services/v4/web/chronos-app/gen/ui/Timesheets/Timesheet/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
