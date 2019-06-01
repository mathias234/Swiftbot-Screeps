var roleHarvester = require('role.harvester');
var getSource = require('world.getSource');

function findNewTarget(creep) {

    // find any structure below 50% damage
    var damagedStructures = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => (structure.hits < structure.hitsMax)
    });


    return _.sortBy(damagedStructures, function (str) {
        var res = str.hits;
        return res;
    })[0];
}

var roleRepair = {
    run: function (creep) {
        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.memory.targetId = undefined;
            creep.say('🔄 harvest');
        }

        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.memory.targetId = findNewTarget(creep).id;

            getSource.leaveSource(creep);

            creep.say('⚡ repair');
        }

        if (creep.memory.repairing) {
            var target = Game.getObjectById(creep.memory.targetId);

            if (target == null || target.hits == target.hitsMax) {
                var newTar = findNewTarget(creep);
                if (newTar == undefined)
                    return;

                creep.memory.targetId = newTar.id;
                target = Game.getObjectById(creep.memory.targetId);
            }

            if (target) {
                creep.repair(target);

                if (creep.pos.getRangeTo(target) >= 1) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else { // if theres nothing to build i will convert into a harvester..
                roleHarvester.run(creep);
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


module.exports = roleRepair;