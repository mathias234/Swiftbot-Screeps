var roleHarvester = require('role.harvester');
var getSource = require('world.getSource');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var conSites = [];
        for (var room2Name in Game.rooms) {
            var room2 = Game.rooms[room2Name];
            var sitesInRoom = room2.find(FIND_CONSTRUCTION_SITES);
            for (var site of sitesInRoom) {
                conSites.push(site);
            }
        }

        var targets = conSites;

        if (targets.length == 0) {// if theres nothing to build i will convert into a harvester..
            roleHarvester.run(creep);
            return;
        }

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }

        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            getSource.leaveSource(creep);
            creep.say('🚧 build');
        }


        if (creep.memory.building) {
            if (targets.length) {
                creep.build(targets[0]);

                if (creep.room.name != targets[0].room.name || creep.pos.getRangeTo(targets[0]) >= 1) {
                    creep.say('🚧 moving');
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        else {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            })[0];

            var target = container;

            if (target != undefined || target != null) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            else { // theres no containers with any energy, try to harvest instead
                var target;
                if (creep.memory.targetId == undefined) {
                    var src = getSource.getAnyFreeSource(creep);
                    if (src != null)
                        target = src;
                }

                if (target == undefined || target == null) {
                    var idleFlag = creep.room.find(FIND_FLAGS, { filter: flag => flag.name.includes('Idle') && flag.pos.roomName == creep.room.name });
                    creep.moveTo(idleFlag[0]);
                }

                else if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    }
};

module.exports = roleBuilder;