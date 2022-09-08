const viewData = {
    id: "Item-details",
    label: "Item",
    link: "/services/v4/web/chronos-app/gen/ui/Timesheets/Timesheet/Item/dialog-window/index.html"
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}