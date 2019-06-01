var build = {
    run: function (room) {
        if (room.memory.hasBuiltRoads) {
            return;
        }

        var spawns = room.find(FIND_MY_SPAWNS);

        var sources = room.find(FIND_SOURCES);

        var paths = [];
        for (var spawn of spawns) {
            for (var source of sources) {
                var path = spawn.pos.findPathTo(source);
                paths.push(path);
            }
        }

        var exitTop = spawn.pos.findClosestByPath(FIND_EXIT_TOP);
        var exitBottom = spawn.pos.findClosestByPath(FIND_EXIT_BOTTOM);
        var exitLeft = spawn.pos.findClosestByPath(FIND_EXIT_LEFT);
        var exitRight = spawn.pos.findClosestByPath(FIND_EXIT_RIGHT);

        if (exitTop) {
            paths.push(spawn.pos.findPathTo(exitTop));
        }
        if (exitBottom) {
            paths.push(spawn.pos.findPathTo(exitBottom));
        }
        if (exitLeft) {
            paths.push(spawn.pos.findPathTo(exitLeft));
        }
        if (exitRight) {
            paths.push(spawn.pos.findPathTo(exitRight));
        }

        for (var path of paths) {
            for (var i = 0; i < path.length; i++) {
                var node1 = path[i];
                room.createConstructionSite(node1.x, node1.y, STRUCTURE_ROAD);
            }
        }

        for (var path of paths) {
            for (var i = 0; i < path.length - 1; i++) {
                var node1 = path[i];
                var node2 = path[i + 1];
                room.visual.line(node1.x, node1.y, node2.x, node2.y);
            }
        }


        room.memory.hasBuiltRoads = true;
    }
};


module.exports = build;