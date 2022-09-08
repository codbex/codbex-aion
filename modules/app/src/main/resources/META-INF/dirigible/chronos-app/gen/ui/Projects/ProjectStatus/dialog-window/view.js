const viewData = {
    id: "ProjectStatus-details",
    label: "ProjectStatus",
    link: "/services/v4/web/chronos-app/gen/ui/Projects/ProjectStatus/dialog-window/index.html"
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}