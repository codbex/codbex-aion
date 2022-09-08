const viewData = {
    id: "Item",
    label: "Item",
    factory: "frame",
    region: "bottom",
    link: "/services/v4/web/chronos-app/gen/ui/Timesheets/Timesheet/Item/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
