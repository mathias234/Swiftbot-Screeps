var ui = {
    run: function (room) {
        if (!Memory.showUi)
            return;

        var creeps = [];
        for (var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            if (creep.memory.myRoom == undefined)
                creep.memory.myRoom = room.name;

            if (creep.memory.myRoom == room.name) {
                creeps.push(creep);
            }
        }

        if (room.memory.sources == undefined)
            return;

        var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
        var repairs = _.filter(creeps, (creep) => creep.memory.role == 'repair');
        var meleeFighters = _.filter(creeps, (creep) => creep.memory.role == 'attack_melee');
        var claimers = _.filter(creeps, (creep) => creep.memory.role == 'claimer');

        var idx = 2;

        var windowWidth = 7.3;

        var startIdx = idx; {
            var leftOffset = 0.8;
            room.visual.text("Creep Overview", 0.2, idx++, { align: 'left' });
            room.visual.text("Harvester creep: " + harvesters.length, leftOffset, idx++, { align: 'left' });
            room.visual.text("Upgrader creep: " + upgraders.length, leftOffset, idx++, { align: 'left' });
            room.visual.text("Builder creep: " + builders.length, leftOffset, idx++, { align: 'left' });
            room.visual.text("Repair creep: " + repairs.length, leftOffset, idx++, { align: 'left' });
            room.visual.text("Melee creep: " + meleeFighters.length, leftOffset, idx++, { align: 'left' });
            room.visual.text("Claimer creep: " + claimers.length, leftOffset, idx++, { align: 'left' });
        } room.visual.rect(0, startIdx - 1, windowWidth, (idx - startIdx) + 0.5);

        idx++;

        var startIdx = idx; {
            room.visual.text("CPU Info", 0.2, idx++, { align: 'left' });
            room.visual.text('CPU: ' + Game.cpu.tickLimit, leftOffset, idx++, { align: 'left' });
            room.visual.text('Limit: ' + Game.cpu.limit, leftOffset, idx++, { align: 'left' });
            room.visual.text('Bucket: ' + Game.cpu.bucket, leftOffset, idx++, { align: 'left' });
        } room.visual.rect(0, startIdx - 1, windowWidth, (idx - startIdx) + 0.5);

        idx++;

        var startIdx = idx; {
            room.visual.text("Room Info", 0.2, idx++, { align: 'left' });
            room.visual.text('Sources: ' + room.memory.sources.length, leftOffset, idx++, { align: 'left' });

            for (var i = 0; i < room.memory.sources.length; i++) {
                var source = room.memory.sources[i];

                room.visual.text('Creeps: ' + source.creeps, leftOffset + 0.5, idx++, { align: 'left' });

                if (i < room.memory.sources.length - 1) {
                    room.visual.text('Max Creeps: ' + source.maxAllowed, leftOffset + 0.5, idx, { align: 'left' });
                    idx += 0.5;
                    room.visual.line(leftOffset + 0.5, idx, windowWidth - (leftOffset + 0.5), idx);
                    idx += 1.0;
                }
                else {
                    room.visual.text('Max Creeps: ' + source.maxAllowed, leftOffset + 0.5, idx++, { align: 'left' });
                }
            }

            room.visual.text('Spawn energy', leftOffset, idx++, { align: 'left' });
            var spawns = room.find(FIND_MY_SPAWNS);
            var spawnStored = 0;
            for (var spawn of spawns) {
                spawnStored += spawn.energy;
            }

            room.visual.text('Spawns(' + spawns.length + '): ' + spawnStored, leftOffset + 0.5, idx++, { align: 'left' });

            var exts = room.find(FIND_STRUCTURES, { filter: str => str.structureType == STRUCTURE_EXTENSION });
            var extsStored = 0;
            for (var ext of exts) {
                extsStored += ext.energy;
            }

            room.visual.text('Ext(' + exts.length + '): ' + extsStored, leftOffset + 0.5, idx++, { align: 'left' });

            room.visual.text('Total: ' + (extsStored + spawnStored), leftOffset + 0.5, idx++, { align: 'left' });



        } room.visual.rect(0, startIdx - 1, windowWidth, (idx - startIdx) + 0.5);
    }
}

module.exports = ui;