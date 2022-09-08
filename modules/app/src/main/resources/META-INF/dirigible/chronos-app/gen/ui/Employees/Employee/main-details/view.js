const viewData = {
    id: "Employee-details",
    label: "Employee",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/Employees/Employee/main-details/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
