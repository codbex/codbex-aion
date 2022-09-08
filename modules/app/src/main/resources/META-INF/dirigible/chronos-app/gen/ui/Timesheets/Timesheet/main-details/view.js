const viewData = {
    id: "Timesheet-details",
    label: "Timesheet",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/Timesheets/Timesheet/main-details/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
