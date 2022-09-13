const response = require("http/v4/response");
const extensions = require("core/v4/extensions");

let tiles = {};

let tileExtensions = extensions.getExtensions("chronos-app-tile");
for (let i = 0; tileExtensions !== null && i < tileExtensions.length; i++) {
    let tileExtension = require(tileExtensions[i]);
    let tile = tileExtension.getTile();
    if (!tiles[tile.group]) {
        tiles[tile.group] = [];
    }
    tiles[tile.group].push({
        name: tile.name,
        location: tile.location,
        description: tile.description,
        order: tile.order
    });
}

for (let next in tiles) {
    tiles[next] = tiles[next].sort(function (a, b) {
        var result = a.order - b.order;
        return result;
    });
}

response.println(JSON.stringify(tiles));