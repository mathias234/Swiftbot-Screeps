var getSources = {
    getAnyFreeSource: function (creep) {
        var room = creep.room;
        if (room.memory.sources == undefined) {
            room.memory.sources = [];
            var sources = creep.room.find(FIND_SOURCES);

            for (var s of sources) {
                room.memory.sources.push({ srcId: s.id, maxAllowed: 0, creeps: 0 });
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);

            for (var s of sources) {
                if (!room.memory.sources.find(p => p.srcId == s.id)) {
                    room.memory.sources.push({ srcId: s.id, maxAllowed: 0, creeps: 0 });
                }
            }
        }

        if (creep.memory.source != undefined)
            return Game.getObjectById(creep.memory.source);

        var target = undefined;

        var sortedSources = _.sortBy(room.memory.sources, src => {
            return Game.getObjectById(src.srcId).energy;
        });

        for (var source of sortedSources) {
            if (source.creeps < source.maxAllowed) {
                target = Game.getObjectById(source.srcId);
                source.creeps++;
                break;
            }
        }

        if (target == null) {
            return null;
        }

        creep.memory.source = target.id;
        return target;
    },

    leaveSource: function (creep) {
        var room = creep.room;
        if (!room.memory.sources) {
            creep.memory.source = undefined;
            return;
        }
        for (var source of room.memory.sources) {
            if (source.srcId == creep.memory.source) {
                source.creeps--;
                creep.memory.source = undefined;
            }
        }
    }
}

module.exports = getSources;