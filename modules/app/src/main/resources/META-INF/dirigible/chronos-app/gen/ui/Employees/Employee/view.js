const viewData = {
    id: "Employee",
    label: "Employee",
    factory: "frame",
    region: "left",
    link: "/services/v4/web/chronos-app/gen/ui/Employees/Employee/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
