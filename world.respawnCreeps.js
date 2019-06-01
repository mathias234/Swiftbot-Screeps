var harvDef = require('def.harvester');
var buildDef = require('def.builder');
var upgrDef = require('def.upgrader');

var spawn = {
    run: function () {
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];

            for (var name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                }
            }

            var spawn1 = room.find(FIND_MY_SPAWNS)[0];

            if (spawn1 == undefined)
                return;

            if (spawn1.spawning) {
                var spawningCreep = Game.creeps[spawn1.spawning.name];
                spawn1.room.visual.text(
                    '🛠️' + spawningCreep.memory.role + " " + (((spawn1.spawning.needTime - spawn1.spawning.remainingTime) / spawn1.spawning.needTime) * 100).toFixed(1) + "%",
                    spawn1.pos.x + 1,
                    spawn1.pos.y,
                    { align: 'left', opacity: 0.8 });
            }

            if (room.memory.counts == undefined)
                room.memory.counts = {};

            // Initialize to some default values
            if (room.memory.counts.harvCount == undefined)
                room.memory.counts.harvCount = 2;
            if (room.memory.counts.upgrCount == undefined)
                room.memory.counts.upgrCount = 1;
            if (room.memory.counts.buildCount == undefined)
                room.memory.counts.buildCount = 1;
            if (room.memory.counts.repairCount == undefined)
                room.memory.counts.repairCount = 1;
            if (room.memory.counts.meleeCount == undefined)
                room.memory.counts.meleeCount = 0;
            if (room.memory.counts.claimerCount == undefined)
                room.memory.counts.claimerCount = 0;

            var creeps = [];
            for (var creepName in Game.creeps) {
                var creep = Game.creeps[creepName];
                if (creep.memory.myRoom == undefined)
                    creep.memory.myRoom = room.name;

                if (creep.memory.myRoom == room.name) {
                    creeps.push(creep);
                }
            }

            var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
            var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
            var builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
            var repairs = _.filter(creeps, (creep) => creep.memory.role == 'repair');
            var meleeFighters = _.filter(creeps, (creep) => creep.memory.role == 'attack_melee');
            var claimers = _.filter(creeps, (creep) => creep.memory.role == 'claimer');

            if (harvesters.length < room.memory.counts.harvCount) {
                var harv = harvDef.getBody(room);
                var newName = 'T' + harv.tier + 'Harvester' + Game.time;
                spawn1.spawnCreep(
                    harv.body,
                    newName,
                    {
                        memory: {
                            role: 'harvester', myRoom: room.name
                        }
                    });
                return;
            }

            if (upgraders.length < room.memory.counts.upgrCount) {
                var upgr = upgrDef.getBody(room);
                var newName = 'T' + upgr.tier + 'Upgrader' + Game.time;
                spawn1.spawnCreep(
                    upgr.body,
                    newName,
                    {
                        memory: {
                            role: 'upgrader', myRoom: room.name
                        }
                    });
                return;
            }

            var conSites = [];
            for (var room2Name in Game.rooms) {
                var room2 = Game.rooms[room2Name];
                var sitesInRoom = room2.find(FIND_CONSTRUCTION_SITES);
                for (var site of sitesInRoom) {
                    conSites.push(site);
                }
            }

            if (conSites.length > 0) {
                if (builders.length < room.memory.counts.buildCount) {
                    var build = buildDef.getBody(room);
                    var newName = 'T' + build.tier + 'Builder' + Game.time;
                    spawn1.spawnCreep(
                        build.body,
                        newName,
                        {
                            memory: {
                                role: 'builder', myRoom: room.name
                            }
                        });
                    return;
                }
            }

            if (repairs.length < room.memory.counts.repairCount) { // Only tower repair for now..
                var newName = 'Repair' + Game.time;
                spawn1.spawnCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    newName,
                    {
                        memory: {
                            role: 'repair', myRoom: room.name
                        }
                    });
                return;
            }

            if (meleeFighters.length < room.memory.counts.meleeCount) {
                var newName = 'Melee' + Game.time;
                spawn1.spawnCreep(
                    [ATTACK, ATTACK, MOVE, MOVE],
                    newName,
                    {
                        memory: {
                            role: 'attack_melee', myRoom: room.name
                        }
                    });
                return;
            }

            if (claimers.length < room.memory.counts.claimerCount) {
                var newName = 'Claimer' + Game.time;
                spawn1.spawnCreep(
                    [CLAIM, MOVE],
                    newName,
                    {
                        memory: {
                            role: 'claimer', myRoom: room.name
                        }
                    });
            }
        }
    }
};

module.exports = spawn;