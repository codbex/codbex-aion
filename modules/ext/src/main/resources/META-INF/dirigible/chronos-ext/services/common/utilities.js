exports.getMonday = function (d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

exports.getFriday = function (d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff + 4));
}

exports.options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };