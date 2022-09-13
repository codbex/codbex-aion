const viewData = {
    id: "home-launchpad",
    label: "Home Launchpad",
    factory: "frame",
    region: "center",
    link: "/services/v4/web/chronos-app/gen/ui/launchpad/Home/index.html",
};

if (typeof exports !== 'undefined') {
    exports.getView = function () {
        return viewData;
    }
}
